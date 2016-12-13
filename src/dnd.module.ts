import {
	NgModule,
	Provider,
	ModuleWithProviders
} from '@angular/core';

import { DndContainer } from './dnd-container';
import { DndFor } from './dnd-for';
import { DndItem } from './dnd-item';
import { DndService } from './dnd.service';

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
export class DndModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: DndModule,
			providers: [
				DndService
			]
		};
	}
}
