import { NgModule } from '@angular/core';
import { Provider } from '@angular/core';

import { DndContainer } from './dnd-container';
import { DndFor } from './dnd-for';
import { DndItem } from './dnd-item';

export {
	DndContainer,
	DndFor,
	DndItem
}

export const DND_DIRECTIVES: Provider[] = [
	DndContainer,
	DndFor,
	DndItem
];

@NgModule({
	declarations: [DND_DIRECTIVES],
	exports: [DND_DIRECTIVES],
	providers: []
})
export class DndModule {}
