import {
	Directive,
	Input
} from '@angular/core';

@Directive({
	selector: '[dndContainer]'
})
export class DndContainer {

	@Input() dndContainer: any;
	@Input() dndItems: any;
}
