import {
	Component,
	DebugElement,
	ViewChild
} from '@angular/core';

import {
	async,
	ComponentFixture,
	TestBed
} from '@angular/core/testing';

import {
	By
} from '@angular/platform-browser';

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

	function getTestDebugElement(): DebugElement {
		return fixture.debugElement;
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

	it('should be instantiated', async(() => {
		fixture = createDefaultTestComponent();

		expect(getTestComponent()).toBeDefined();
	}));

	it('should have an assignable item', async(() => {
		const item = 'the item';

		fixture = createDefaultTestComponent();
		getTestComponent().item = item;
		fixture.detectChanges();

		expect(getDndItem().dndItem).toBe(item);
	}));

	it('should have default targets of []', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		expect(getDndItem().dndTargets).toEqual([]);
	}));

	it('should have settable dnd targets', async(() => {
		const targets = ['tom', 'jerry'];
		fixture = createTestComponentWithInputs();
		getTestComponent().targets = targets;
		fixture.detectChanges();

		expect(getDndItem().dndTargets).toEqual(targets);
	}));

	it('should be draggable by default', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		expect(getDndItem().dndDraggable).toBeTruthy();
	}));

	it('should have settable draggability', async(() => {
		fixture = createTestComponentWithInputs();
		getTestComponent().draggable = false;
		fixture.detectChanges();

		expect(getDndItem().dndDraggable).toBeFalsy();
	}));

	it('should have default drag threshold of 3px', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		expect(getDndItem().dndDragThreshold).toBe(3);
	}));

	it('should have assignable drag threshold', async(() => {
		fixture = createTestComponentWithInputs();
		getTestComponent().dragThreshold = 50;
		fixture.detectChanges();

		expect(getDndItem().dndDragThreshold).toEqual(50);
	}));

	it('should not be dragging on instantiation', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(false);
	}));

	it('should not be dragging after mouse down 1', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		getDndItem().onMouseDown(createMouseEvent('mousedown'));
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(false);
	}));

	it('should not be dragging after mousedown 1 when mouse moves threshold or less in X direction', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		getDndItem().onMouseDown(createMouseEvent('mousedown'));
		getDndItem().onMouseMove(createMouseEvent('mousemove', 3));
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(false);
	}));

	it('should not be dragging after mousedown 1 when mouse moves threshold or less in Y direction', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		getDndItem().onMouseDown(createMouseEvent('mousedown'));
		getDndItem().onMouseMove(createMouseEvent('mousemove', undefined, 3));
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(false);
	}));

	it('should be dragging after mousedown 1 when mouse moves more than threshold in X direction', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		getDndItem().onMouseDown(createMouseEvent('mousedown'));
		getDndItem().onMouseMove(createMouseEvent('mousemove', 20));
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(true);
	}));

	it('should be dragging after mousedown 1 when mouse moves more than threshold in Y direction', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		getDndItem().onMouseDown(createMouseEvent('mousedown'));
		getDndItem().onMouseMove(createMouseEvent('mousemove', undefined, 20));
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(true);
	}));

	it('should not be dragging after mouse up', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		getDndItem().onMouseDown(createMouseEvent('mousedown'));
		getDndItem().onMouseMove(createMouseEvent('mousemove', 20, 20));
		getDndItem().onMouseUp(createMouseEvent('mouseup'));
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(false);
	}));

	it('should have absolute position styling when dragging', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		getDndItem().onMouseDown(createMouseEvent('mousedown'));
		getDndItem().onMouseMove(createMouseEvent('mousemove', 20));
		fixture.detectChanges();

		const div = getTestDebugElement().query(By.css('div'));
		expect(div.styles['position']).toBe('absolute');
	}));

	it('should have original position styling after mouse up', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();
		let div = getTestDebugElement().query(By.css('div'));
		const originalPositionStyle = div.styles['position'];

		getDndItem().onMouseDown(createMouseEvent('mousedown'));
		getDndItem().onMouseMove(createMouseEvent('mousemove', 20));
		fixture.detectChanges();
		getDndItem().onMouseUp(createMouseEvent('mouseup'));
		fixture.detectChanges();

		div = getTestDebugElement().query(By.css('div'));
		expect(div.styles['position']).toEqual(originalPositionStyle);
	}));
});

const MARGIN_OFFSET = 8;

function createMouseEvent(eventType: string, x = 0, y = 0) {
	return new MouseEvent(eventType, <MouseEventInit>{
		buttons: 1,
		clientX: MARGIN_OFFSET + x,
		clientY: MARGIN_OFFSET + y
	});
}
