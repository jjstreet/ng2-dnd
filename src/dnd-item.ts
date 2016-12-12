import {
	Directive,
	ElementRef,
	Input,
	Renderer,
	OnDestroy
} from '@angular/core';

import {
	getMouseRelativeTo,
	Point
} from './shared';

@Directive({
	selector: '[dndItem]'
})
export class DndItem implements OnDestroy {

	@Input() dndItem: any;
	@Input() dndTargets: string[] = [];
	@Input() dndDraggable: boolean = true;
	@Input() dndDragThreshold: number = 3;

	dragging = false;

	private clickPosition: Point;

	private unbindMouseDown: Function;
	private unbindMouseMove: Function;
	private unbindMouseUp: Function;

	private el: HTMLElement;

	constructor(
			private elementRef: ElementRef,
			private renderer: Renderer) {
		this.el = this.elementRef.nativeElement;
		this.unbindMouseDown = this.renderer.listen(this.el, 'mousedown', this.onMouseDown.bind(this));
	}

	ngOnDestroy() {
		this.unbindMouseDown();
	}

	onMouseDown(event: MouseEvent) {
		this.dragging = false;
		this.clickPosition = this.getRelativeMousePosition(event);
		this.attachDragListeners();
		event.preventDefault();
		event.stopPropagation();
	}

	onMouseMove(event: MouseEvent) {
		if (!this.dragging && this.canStartDragging(event) && event.buttons === 1) {
			this.dragging = true;
		}
		event.preventDefault();
		event.stopPropagation();
	}

	onMouseUp(event: MouseEvent) {
		if (this.dragging) {
			this.dragging = false;
		}
		this.detachDragListeners();
	}

	private attachDragListeners(): void {
		this.unbindMouseMove = this.renderer.listenGlobal('document', 'mousemove', this.onMouseMove.bind(this));
		this.unbindMouseUp = this.renderer.listenGlobal('document', 'mouseup', this.onMouseUp.bind(this));
	}

	private detachDragListeners(): void {
		this.unbindMouseMove();
		this.unbindMouseUp();
	}

	private canStartDragging(event: MouseEvent): boolean {
		const mouse = this.getRelativeMousePosition(event);
		return Math.abs(this.clickPosition.x - mouse.x) > this.dndDragThreshold
				|| Math.abs(this.clickPosition.y - mouse.y) > this.dndDragThreshold;
	}

	private getRelativeMousePosition(event): Point {
		return getMouseRelativeTo(event, this.el);
	}
}
