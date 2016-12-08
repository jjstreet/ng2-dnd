import { NgModule } from '@angular/core';
import { Provider } from '@angular/core';

import { DndItem } from './dnd-item';

export {
	DndItem
}

export const DND_DIRECTIVES: Provider[] = [
	DndItem
];

@NgModule({
	declarations: [DND_DIRECTIVES],
	exports: [DND_DIRECTIVES],
	providers: []
})
export class DndModule {}
