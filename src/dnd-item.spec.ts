import {
	Component
} from '@angular/core';

import {
	async,
	ComponentFixture,
	TestBed
} from '@angular/core/testing';

import { DndItem } from './dnd-item';
import { DndModule } from './dnd.module';

@Component({
	selector: 'test-cmp',
	template: '<div dndItem></div>'
})
export class TestComponent {

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
});
