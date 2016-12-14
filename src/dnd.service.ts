import {
	Injectable
} from '@angular/core';

import { DndContainer } from './dnd-container';
import { DndItem } from './dnd-item';

@Injectable()
export class DndService {

	source: DndContainer = undefined;
	sourceIndex: number = undefined;
	item: DndItem = undefined;
	target: DndContainer = undefined;
	targetIndex: number = undefined;
}
