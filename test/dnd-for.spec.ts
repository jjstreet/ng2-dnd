import {
	Component,
	Directive,
	DebugElement,
	Input } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DndContainer } from '../src/dnd-container';
import { DndModule } from '../src/dnd.module';

class TestObject {
	toString() { return 'TestObject'; }
}

function getTextContentFromNative(elements: NodeListOf<HTMLElement>): string {
	let content = '';
	for (let i = 0; i < elements.length; i++) {
		content += elements.item(i).textContent;
	}
	return content;
}

@Directive({
	selector: '[dndContainer]'
})
class DndContainerStub {

	@Input() dndItems: any;
}

@Component({
	selector: 'test-cmp',
	template: ''
})
class TestComponent {
	items: any[] = [1, 2];
}

const TEMPLATE = `
		<div dndContainer [dndItems]="items"><span *dndFor="let item">{{item.toString()}};</span></div>`;

function createTestComponent(template: string = TEMPLATE): ComponentFixture<TestComponent> {
	return TestBed.overrideComponent(TestComponent, {set: {template: template}})
			.createComponent(TestComponent);
}

describe('DndFor', () => {
	let fixture: ComponentFixture<any>;

	function getComponent(): TestComponent {
		return fixture.componentInstance;
	}

	function getDebugElement(): DebugElement {
		return fixture.debugElement;
	}

	function detectChangesAndExpectNativeText(text: string): void {
		fixture.detectChanges();
		const spans = getDebugElement().nativeElement.querySelectorAll('span');
		expect(getTextContentFromNative(spans)).toEqual(text);
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent
			],
			imports: [
				DndModule
			],
			providers: [
				{provide: DndContainer, useClass: DndContainerStub}
			]
		});
	});

	afterEach(() => {
		fixture = null;
	});

	it('should reflect initial elements', async(() => {
		fixture = createTestComponent();
		detectChangesAndExpectNativeText('1;2;');
	}));

	it('should reflect added elements', async(() => {
		fixture = createTestComponent();
		fixture.detectChanges();
		getComponent().items.push(3);

		detectChangesAndExpectNativeText('1;2;3;');
	}));

	it('should reflect removed elements', async(() => {
		fixture = createTestComponent();
		fixture.detectChanges();
		getComponent().items.splice(1, 1);

		detectChangesAndExpectNativeText('1;');
	}));

	it('should reflect moved elements', async(() => {
		fixture = createTestComponent();
		fixture.detectChanges();
		getComponent().items.splice(0, 1);
		getComponent().items.push(1);

		detectChangesAndExpectNativeText('2;1;');
	}));

	it('should reflect a mix of all changes (additions/removals/moves)', async(() => {
		fixture = createTestComponent();
		getComponent().items = [0, 1, 2, 3, 4, 5];
		fixture.detectChanges();

		getComponent().items = [6, 2, 7, 0, 4, 8];

		detectChangesAndExpectNativeText('6;2;7;0;4;8;');
	}));

	it('should iterate over an array of objects', async(() => {
		const template = '<div dndContainer [dndItems]="items"><span *dndFor="let item">{{item["name"]}};</span></div>';
		const name1 = {name: 'fallon'};
		const name2 = {name: 'buford'};
		const name3 = {name: 'farely'};

		fixture = createTestComponent(template);
		getComponent().items = [name1, name2];

		// initial
		detectChangesAndExpectNativeText(`${name1.name};${name2.name};`);

		// grown
		getComponent().items.push(name3);
		detectChangesAndExpectNativeText(`${name1.name};${name2.name};${name3.name};`);

		// rearranged
		getComponent().items.splice(0, 1);
		getComponent().items.push(name1);
		detectChangesAndExpectNativeText(`${name2.name};${name3.name};${name1.name};`);

		// shrunken
		getComponent().items.splice(2, 1);
		getComponent().items.splice(0, 1);
		detectChangesAndExpectNativeText(`${name3.name};`);
	}));

	it('should gracefully handle nulls', async(() => {
		const template = '<div dndContainer [dndItems]="null"><span *dndFor="let item">{{item}};</span></div>';

		fixture = createTestComponent(template);

		detectChangesAndExpectNativeText('');
	}));

	it('should gracefully handle ref changing to null and back', async(() => {
		fixture = createTestComponent();

		detectChangesAndExpectNativeText('1;2;');

		getComponent().items = null;
		detectChangesAndExpectNativeText('');

		getComponent().items = [1, 2, 3];
		detectChangesAndExpectNativeText('1;2;3;');
	}));

	it('should throw on non-iterable ref and suggest using an array', async(() => {
		fixture = createTestComponent();

		getComponent().items = <any>'a_string';

		expect(() => fixture.detectChanges())
				.toThrowError(
						/Cannot find a differ supporting object 'a_string' of type 'string'. DndFor only supports binding to Iterables such as Arrays/);
	}));

	it('should throw on ref changing to string', async(() => {
		fixture = createTestComponent();

		detectChangesAndExpectNativeText('1;2;');

		getComponent().items = <any> 'this breaks';

		expect(() => fixture.detectChanges()).toThrowError();
	}));

	it('should work with duplicates', async(() => {
		fixture = createTestComponent();

		const a = new TestObject();
		getComponent().items = [a, a];

		detectChangesAndExpectNativeText('TestObject;TestObject;');
	}));
});
