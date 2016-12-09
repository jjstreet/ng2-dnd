import {
	Component,
	Directive,
	DebugElement,
	Input } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DndContainer } from '../src/dnd-container';
import { DndModule } from '../src/dnd.module';

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

describe('dndFor', () => {
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

	it('should reflect initial elements', () => {
		fixture = createTestComponent();
		detectChangesAndExpectNativeText('1;2;');
	});

	it('should reflect added elements', () => {
		fixture = createTestComponent();
		fixture.detectChanges();
		getComponent().items.push(3);

		detectChangesAndExpectNativeText('1;2;3;');
	});

	it('should reflect removed elements', () => {
		fixture = createTestComponent();
		fixture.detectChanges();
		getComponent().items.splice(1, 1);

		detectChangesAndExpectNativeText('1;');
	});

	it('should reflect moved elements', () => {
		fixture = createTestComponent();
		fixture.detectChanges();
		getComponent().items.splice(0, 1);
		getComponent().items.push(1);

		detectChangesAndExpectNativeText('2;1;');
	});

	it('should reflect a mix of all changes (additions/removals/moves)', () => {
		fixture = createTestComponent();
		getComponent().items = [0, 1, 2, 3, 4, 5];
		fixture.detectChanges();

		getComponent().items = [6, 2, 7, 0, 4, 8];

		detectChangesAndExpectNativeText('6;2;7;0;4;8;');
	});
});
