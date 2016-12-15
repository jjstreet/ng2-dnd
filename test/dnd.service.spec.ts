import {
	async,
	inject,
	TestBed
} from '@angular/core/testing';

import { DndAction } from '../src/dnd-action.enum';
import { DndService } from '../src/dnd.service';

describe('DndService', () => {
	let service: DndService;
	
	beforeEach(() => {
		service = new DndService();
	});

	it('should announce when actions are dispatched', async(() => {
		service.$actions.subscribe(action => {
			expect(action).toEqual(DndAction.Started);
		});
		service.dispatchAction(DndAction.Started);
	}));
});