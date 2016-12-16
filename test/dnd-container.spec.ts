import {
	Component,
	Input,
	ViewChild
} from '@angular/core';

import {
	async,
	ComponentFixture,
	inject,
	TestBed
} from '@angular/core/testing';

import { DndContainer } from '../src/dnd-container';
import { DndItem } from '../src/dnd-item';
import { DndModule } from '../src/dnd.module';
import { DndService } from '../src/dnd.service';

@Component({
	selector: 'test-cmp',
	template: '<div [dndContainer]="container"><div [dndItem]="item">Drag Me</div></div>'
})
class TestComponent {
	container: any = undefined;;
	items: any = undefined;
	containerTargets: string[] = [];
	itemTargets: string[] = [];
	horizontal: boolean = false;

	@ViewChild(DndContainer)
	dndContainer: DndContainer;

	@ViewChild(DndItem)
	dndItem: DndItem;
}

const INPUTS_TEMPLATE = `
	<div
			[dndContainer]="container"
			[dndItems]="items"
			[dndTargets]="containerTargets"
			[dndHorizontal]="horizontal"><div [dndItem]="item" [dndTargets]="itemTargets">Drag Me</div></div>`;

function createDefaultTestComponent(): ComponentFixture<TestComponent> {
	return TestBed.createComponent(TestComponent);
}

function createTestComponentWithInputs(): ComponentFixture<TestComponent> {
	return TestBed.overrideComponent(TestComponent, { set: { template: INPUTS_TEMPLATE } })
			.createComponent(TestComponent);
}

describe('DndContainer', () => {
	let fixture: ComponentFixture<TestComponent>;

	function getTestComponent(): TestComponent {
		return fixture.componentInstance;
	}

	function getDndContainer(): DndContainer {
		return getTestComponent().dndContainer;
	}

	function getDndItem(): DndItem {
		return getTestComponent().dndItem;
	}

	function getInjectedDndService(): DndService {
		return fixture.debugElement.injector.get(DndService);
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent
			],
			imports: [
				DndModule.forRoot()
			]
		});
	});

	afterEach(() => {
		fixture = null;
	});

	it('should be instantiated', async(() => {
		fixture = createDefaultTestComponent();

		expect(getTestComponent()).toBeDefined();
	}));

	it('should have an assignable container object', async(() => {
		const container = {};
		fixture = createDefaultTestComponent();
		getTestComponent().container = container;
		fixture.detectChanges();

		expect(getDndContainer().container).toBe(container);
	}));

	it('should have an assignable items for holding content in the container', async(() => {
		const items = ['object 1', 'object 2'];
		fixture = createTestComponentWithInputs();
		getTestComponent().items = items;
		fixture.detectChanges();

		expect(getDndContainer().items).toEqual(items);
	}));

	it('should have default targets of []', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		expect(getDndContainer().targets).toEqual([]);
	}));

	it('should have settable dnd targets', async(() => {
		const targets = ['tom', 'jerry'];
		fixture = createTestComponentWithInputs();
		getTestComponent().containerTargets = targets;
		fixture.detectChanges();

		expect(getDndContainer().targets).toEqual(targets);
	}));

	it('should have default horizontal mode of false', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		expect(getDndContainer().horizontal).toBe(false);
	}));

	it('should have settable horizontal mode', async(() => {
		const targets = ['tom', 'jerry'];
		fixture = createTestComponentWithInputs();
		getTestComponent().horizontal = true;
		fixture.detectChanges();

		expect(getDndContainer().horizontal).toBe(true);
	}));

	it('should provide index of item within items', async(() => {
		fixture = createTestComponentWithInputs();
		getTestComponent().items = [1, 2, 3];
		fixture.detectChanges();

		expect(getDndContainer().itemIndexOf(2)).toEqual(1);
	}));

	it('should allow items with at least one matching target to be dropped', async(() =>{
		fixture = createTestComponentWithInputs();

		getTestComponent().containerTargets = [];
		getTestComponent().itemTargets = [];
		fixture.detectChanges();

		expect(getDndContainer().isDropAllowed(getDndItem())).toBe(true, 'item [] container []');
		
		getTestComponent().containerTargets = ['1', '2'];
		getTestComponent().itemTargets = ['1'];
		fixture.detectChanges();

		expect(getDndContainer().isDropAllowed(getDndItem())).toBe(true, 'item [1] container [1, 2]');

		getTestComponent().containerTargets = ['1', '2'];
		getTestComponent().itemTargets = ['A'];
		fixture.detectChanges();

		expect(getDndContainer().isDropAllowed(getDndItem())).toBe(false, 'item [A] container [1, 2]');

		getTestComponent().containerTargets = ['B'];
		getTestComponent().itemTargets = ['1', 'B'];
		fixture.detectChanges();

		expect(getDndContainer().isDropAllowed(getDndItem())).toBe(true, 'item [1, B] container [B]');
	}));
});
