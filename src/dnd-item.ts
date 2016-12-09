import {
	Directive,
	Input
} from '@angular/core';

@Directive({
	selector: '[dndItem]'
})
export class DndItem {

	@Input() dndItem: any;
	@Input() dndTargets: string[] = [];
	@Input() dndDraggable: boolean = true;
	@Input() dndDragThreshold: number = 3;
}
