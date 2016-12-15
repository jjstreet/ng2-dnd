import {
	Injectable
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { DndAction } from './dnd-action.enum';
import { DndContainer } from './dnd-container';
import { DndItem } from './dnd-item';

@Injectable()
export class DndService {

	source: DndContainer = undefined;
	sourceIndex: number = undefined;
	item: DndItem = undefined;
	target: DndContainer = undefined;
	targetIndex: number = undefined;

	private actionsSubject: Subject<DndAction> = new Subject<DndAction>();

	$actions: Observable<DndAction> = this.actionsSubject.asObservable();

	dispatchAction(action: DndAction) {
		this.actionsSubject.next(action);
	}
}
