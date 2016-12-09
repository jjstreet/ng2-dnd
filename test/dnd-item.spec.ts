import {
	Component,
	ViewChild
} from '@angular/core';

import {
	async,
	ComponentFixture,
	TestBed
} from '@angular/core/testing';

import { DndItem } from '../src/dnd-item';
import { DndModule } from '../src/dnd.module';

@Component({
	selector: 'test-cmp',
	template: '<div [dndItem]="item"></div>'
})
export class TestComponent {
	item: any;

	@ViewChild(DndItem)
	dndItem: DndItem;
}

describe('DndItem', () => {
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent
			],
			imports: [
				DndModule
			]
		});
	});

	afterEach(() => {
		fixture = null;
	});

	it('should be instantiated', () => {
		fixture = TestBed.createComponent(TestComponent);

		expect(fixture.componentInstance).toBeDefined();
	});

	it('should have an assignable item', () => {
		const item = 'the item';

		fixture = TestBed.createComponent(TestComponent);
		fixture.componentInstance.item = item;

		fixture.detectChanges();

		expect(fixture.componentInstance.dndItem.dndItem).toBe(item);
	});
});
