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
		let observedAction: DndAction;
		service.$actions.subscribe(action => {
			observedAction = action;
		});
		service.dispatchAction(DndAction.Started);

		expect(observedAction).toEqual(DndAction.Started);
	}));
});