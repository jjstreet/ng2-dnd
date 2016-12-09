import {
	Directive,
	Input
} from '@angular/core';

@Directive({
	selector: '[dndItem]'
})
export class DndItem {

	@Input() dndItem: any;
}
