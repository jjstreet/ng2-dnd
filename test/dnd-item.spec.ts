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
	template: '<div [dndItem]="item">Drag Me</div>'
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
			[dndDragThreshold]="dragThreshold">Drag Me</div>`;

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

	function getDndItemDebugElement(): DebugElement {
		return getTestDebugElement().query(By.directive(DndItem));
	}

	function createMouseEvent(eventType: string, element: HTMLElement = undefined, x = 0, y = 0) {
		let offset: {x: number, y: number} = {x: 0, y: 0};
		if (element) {
			const rect = element.getBoundingClientRect();
			offset = {x: rect.left, y: rect.top};
		}
		return new MouseEvent(eventType, <MouseEventInit>{
			buttons: 1,
			clientX: offset.x + x,
			clientY: offset.y + y,
			bubbles: true,
			cancelable: true
		});
	}

	function triggerMouseDown(x = 0, y = 0) {
		const el: HTMLElement = getDndItemDebugElement().nativeElement;
		(<EventTarget> el).dispatchEvent(createMouseEvent('mousedown', el, x, y));
	}

	function triggerMouseMove(x = 0, y = 0) {
		const el: HTMLElement = getDndItemDebugElement().nativeElement;
		document.dispatchEvent(createMouseEvent('mousemove', el, x, y));
	}

	function triggerMouseUp() {
		document.dispatchEvent(new MouseEvent('mouseup', <MouseEventInit>{
			buttons: 1,
			bubbles: true,
			cancelable: true
		}));
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

	it('should not be dragging after mousedown 1', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		triggerMouseDown();
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(false);
	}));

	it('should not be dragging after mousedown 1 when mouse moves threshold or less in X direction', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		triggerMouseDown();
		triggerMouseMove(3);
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(false);
	}));

	it('should not be dragging after mousedown 1 when mouse moves threshold or less in Y direction', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		triggerMouseDown();
		triggerMouseMove(0, 3);
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(false);
	}));

	it('should be dragging after mousedown 1 when mouse moves more than threshold in X direction', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		triggerMouseDown();
		triggerMouseMove(20);
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(true);
	}));

	it('should be dragging after mousedown 1 when mouse moves more than threshold in Y direction', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		triggerMouseDown();
		triggerMouseMove(0, 20);
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(true);
	}));

	it('should capture mouse down events for button 1', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		const el = getDndItemDebugElement().nativeElement;
		const event: MouseEvent = createMouseEvent('mousedown', el);
		spyOn(event, 'stopPropagation');
		spyOn(event, 'preventDefault');
		(<EventTarget> el).dispatchEvent(event);

		expect(event.stopPropagation).toHaveBeenCalled();
		expect(event.preventDefault).toHaveBeenCalled();
	}));

	it('should not be dragging after mouse up', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		triggerMouseDown();
		triggerMouseMove(20, 20);
		fixture.detectChanges();

		expect(getDndItem().dragging).toBe(true);

		triggerMouseUp();

		expect(getDndItem().dragging).toBe(false);
	}));

	it('should have absolute position styling when dragging', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		triggerMouseDown();
		triggerMouseMove(20, 20);
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['position']).toBe('absolute');
	}));

	it('should have original position styling after mouse up', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();
		const originalPositionStyle = getDndItemDebugElement().styles['position'];

		triggerMouseDown();
		triggerMouseMove(20, 20);
		triggerMouseUp();
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['position']).toEqual(originalPositionStyle);
	}));

	it('should set width styling to offsetWidth when dragging', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();
		const originalWidth = getDndItemDebugElement().nativeElement.offsetWidth;

		triggerMouseDown();
		triggerMouseMove(20, 20);
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['width']).toEqual(originalWidth + 'px');
	}));

	it('should remove width styling after mouse up', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();
		const originalWidthStyle = getDndItemDebugElement().styles['width'];

		triggerMouseDown();
		triggerMouseMove(20, 20);
		triggerMouseUp();
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['width']).toEqual(originalWidthStyle);
	}));

	it('should set height styling to offsetHeight when dragging', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();
		const originalHeight = getDndItemDebugElement().nativeElement.offsetHeight;

		triggerMouseDown();
		triggerMouseMove(20, 20);
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['height']).toEqual(originalHeight + 'px');
	}));

	it('should remove height styling after mouse up', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();
		const originalHeightStyle = getDndItemDebugElement().styles['height'];

		triggerMouseDown();
		triggerMouseMove(20, 20);
		triggerMouseUp();
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['height']).toEqual(originalHeightStyle);
	}));

	it('should ignore pointer events when dragging', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();

		triggerMouseDown();
		triggerMouseMove(20, 20);
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['pointerEvents']).toBe('none');
	}));

	it('should have original pointer events styling after mouse up', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();
		const originalPointerEvents = getDndItemDebugElement().styles['pointerEvents'];

		triggerMouseDown();
		triggerMouseMove(20, 20);
		triggerMouseUp();
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['pointerEvents']).toEqual(originalPointerEvents);
	}));

	it('should update left style based on mouse movement during dragging', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();
		const originalOffsetLeft = getDndItemDebugElement().nativeElement.offsetLeft;
		const traveledX = 20;

		triggerMouseDown();
		triggerMouseMove(traveledX);
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['left']).toEqual((originalOffsetLeft + traveledX) + 'px');
	}));

	it('should update top style based on mouse movement during dragging', async(() => {
		fixture = createDefaultTestComponent();
		fixture.detectChanges();
		const originalOffsetTop = getDndItemDebugElement().nativeElement.offsetTop;
		const traveledY = 20;

		triggerMouseDown();
		triggerMouseMove(0, traveledY);
		fixture.detectChanges();

		expect(getDndItemDebugElement().styles['top']).toEqual((originalOffsetTop + traveledY) + 'px');
	}));
});
