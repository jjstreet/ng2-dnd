import {
	Component,
	ViewChild
} from '@angular/core';

import {
	async,
	ComponentFixture,
	TestBed
} from '@angular/core/testing';

import { DndItem } from '../src/dnd-item';
import { DndModule } from '../src/dnd.module';

@Component({
	selector: 'test-cmp',
	template: '<div [dndItem]="item"></div>'
})
export class TestComponent {
	item: any;
	targets: string[];
	draggable: boolean;
	dragThreshold: number;

	@ViewChild(DndItem)
	dndItem: DndItem;
}

const INPUTS_TEMPLATE = `
	<div
			[dndItem]="item"
			[dndTargets]="targets"
			[dndDraggable]="draggable"
			[dndDragThreshold]="dragThreshold"></div>`;

function createDefaultTestComponent(): ComponentFixture<TestComponent> {
	return TestBed.createComponent(TestComponent);
}

function createTestComponentWithInputs(): ComponentFixture<TestComponent> {
	return TestBed.overrideComponent(TestComponent, { set: { template: INPUTS_TEMPLATE } })
			.createComponent(TestComponent);
}

describe('DndItem', () => {
	let fixture: ComponentFixture<TestComponent>;

	function getTestComponent(): TestComponent {
		return fixture.componentInstance;
	}

	function getDndItem(): DndItem {
		return getTestComponent().dndItem;
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent
			],
			imports: [
				DndModule
			]
		});
	});

	afterEach(() => {
		fixture = null;
	});

	it('should be instantiated', () => {
		fixture = createDefaultTestComponent();

		expect(getTestComponent()).toBeDefined();
	});

	it('should have an assignable item', () => {
		const item = 'the item';

		fixture = createDefaultTestComponent();
		getTestComponent().item = item;
		fixture.detectChanges();

		expect(getDndItem().dndItem).toBe(item);
	});

	it('should have default targets of []', () => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		expect(getDndItem().dndTargets).toEqual([]);
	});

	it('should have settable dnd targets', () => {
		const targets = ['tom', 'jerry'];
		fixture = createTestComponentWithInputs();
		getTestComponent().targets = targets;
		fixture.detectChanges();

		expect(getDndItem().dndTargets).toEqual(targets);
	});

	it('should be draggable by default', () => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		expect(getDndItem().dndDraggable).toBeTruthy();
	});

	it('should have settable draggability', () => {
		fixture = createTestComponentWithInputs();
		getTestComponent().draggable = false;
		fixture.detectChanges();

		expect(getDndItem().dndDraggable).toBeFalsy();
	});

	it('should have default drag threshold of 3px', () => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		expect(getDndItem().dndDragThreshold).toBe(3);
	});

	it('should have assignable drag threshold', () => {
		fixture = createTestComponentWithInputs();
		getTestComponent().dragThreshold = 50;
		fixture.detectChanges();

		expect(getDndItem().dndDragThreshold).toEqual(50);
	});
});
