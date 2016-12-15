import {
	Directive,
	Input
} from '@angular/core';

import { DndItem } from './dnd-item';
import { DndService } from './dnd.service';

@Directive({
	selector: '[dndContainer]'
})
export class DndContainer {

	@Input() dndContainer: any;
	@Input() dndItems: any[];
	@Input() dndTargets: string[] = [];
	@Input() dndHorizontal: boolean = false;

	constructor(
			private dnd: DndService) { }

	itemIndexOf(item: any): number {
		if (!this.dndItems) {
			return -1;
		}
		return this.dndItems.indexOf(item);
	}

	isDropAllowed(dndItem: DndItem): boolean {
		if (this.dndTargets.length === 0 && dndItem.dndTargets.length === 0) {
			return true;
		}
		for (let target of dndItem.dndTargets) {
			if (this.dndTargets.indexOf(target) > -1) {
				return true;
			}
		}
		return false;
	}
}
