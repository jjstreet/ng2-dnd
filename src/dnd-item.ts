import {
	Directive,
	ElementRef,
	HostBinding,
	Input,
	Renderer,
	OnDestroy
} from '@angular/core';

import { DndContainer } from './dnd-container';
import { DndService } from './dnd.service';

import { Point } from './shared';

@Directive({
	selector: '[dndItem]'
})
export class DndItem implements OnDestroy {

	@Input() dndItem: any;
	@Input() dndTargets: string[] = [];
	@Input() dndDraggable: boolean = true;
	@Input() dndDragThreshold: number = 3;

	@HostBinding('style.top')
	private styleTop: string;

	@HostBinding('style.left')
	private styleLeft: string;

	@HostBinding('style.width')
	private styleWidth: string;

	@HostBinding('style.height')
	private styleHeight: string;

	@HostBinding('style.position')
	private stylePosition: string;

	@HostBinding('style.pointerEvents')
	private stylePointerEvents: string;

	private dragStarted = false;

	private clickPosition: Point;

	private unbindMouseDown: Function;
	private unbindMouseMove: Function;
	private unbindMouseUp: Function;

	private el: HTMLElement;

	constructor(
			private elementRef: ElementRef,
			private renderer: Renderer,
			private dnd: DndService,
			private dndContainer: DndContainer) {
		this.el = this.elementRef.nativeElement;
		this.unbindMouseDown = this.renderer.listen(this.el, 'mousedown', this.onMouseDown.bind(this));
	}

	ngOnDestroy() {
		this.unbindMouseDown();
	}

	get dragging(): boolean {
		return this.dragStarted;
	}

	get elementWidth(): number {
		return this.el.offsetWidth;
	}

	get elementHeight(): number {
		return this.el.offsetHeight;
	}

	onMouseDown(event: MouseEvent) {
		if (this.dndDraggable && event.buttons === 1) {
			this.dragStarted = false;
			this.clickPosition = this.getRelativeMousePosition(event);
			this.attachDragListeners();
			event.preventDefault();
			event.stopPropagation();
		}
	}

	onMouseMove(event: MouseEvent) {
		if (!this.dragging && this.canStartDragging(event) && event.buttons === 1) {
			this.startDrag();
		}
		if (this.dragging) {
			this.updatePosition(event);
			event.preventDefault();
			event.stopPropagation();
		}
	}

	onMouseUp(event: MouseEvent) {
		if (this.dragging) {
			this.stopDrag();
			this.detachDragListeners();
		}
	}

	private startDrag(): void {
		this.applyDragStyles();
		this.dnd.source = this.dndContainer;
		this.dnd.item = this;
		this.dragStarted = true;
	}

	private applyDragStyles(): void {
		this.stylePosition = 'absolute';
		this.stylePointerEvents = 'none';
		this.styleWidth = this.elementWidth + 'px';
		this.styleHeight = this.elementHeight + 'px';
	}

	private stopDrag(): void {
		this.dragStarted = false;
		this.removeDragStyles();
	}

	private removeDragStyles(): void {
		this.stylePosition = null;
		this.stylePointerEvents = null;
		this.styleWidth = null;
		this.styleHeight = null;
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

	private updatePosition(event: MouseEvent): void {
		this.styleLeft = (event.clientX - this.clickPosition.x) + 'px';
		this.styleTop = (event.clientY - this.clickPosition.y) + 'px';
	}

	private getRelativeMousePosition(event): Point {
		const rect: ClientRect = this.el.getBoundingClientRect();
		return new Point(event.clientX - rect.left, event.clientY - rect.top);
	}
}
