import {
	Directive,
	TemplateRef
} from '@angular/core';

@Directive({
	selector: '[dndPlaceholder]'
})
export class DndPlaceholder {

	constructor(
			public templateRef: TemplateRef<any>) { }
}
