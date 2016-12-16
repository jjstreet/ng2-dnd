import {
	ContentChildren,
	Directive,
	Input,
	QueryList
} from '@angular/core';

import { DndItem } from './dnd-item';
import { DndService } from './dnd.service';

@Directive({
	selector: '[dndContainer]'
})
export class DndContainer {

	@Input('dndContainer') container: any;
	@Input('dndItems') items: any[];
	@Input('dndTargets') targets: string[] = [];
	@Input('dndHorizontal') horizontal: boolean = false;

	constructor(
			private dnd: DndService) { }

	itemIndexOf(item: any): number {
		if (!this.items) {
			return -1;
		}
		return this.items.indexOf(item);
	}

	isDropAllowed(dndItem: DndItem): boolean {
		if (this.targets.length === 0 && dndItem.targets.length === 0) {
			return true;
		}
		for (let target of dndItem.targets) {
			if (this.targets.indexOf(target) > -1) {
				return true;
			}
		}
		return false;
	}
}
