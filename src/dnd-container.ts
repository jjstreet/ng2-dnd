import {
	Directive,
	Input
} from '@angular/core';

@Directive({
	selector: '[dndContainer]'
})
export class DndContainer {

	@Input() dndContainer: any;
	@Input() dndItems: any[];
	@Input() dndTargets: string[] = [];
	@Input() dndHorizontal: boolean = false;

	itemIndexOf(item: any): number {
		if (!this.dndItems) {
			return -1;
		}
		return this.dndItems.indexOf(item);
	}
}
