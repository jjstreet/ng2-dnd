import {
	Component,
	ViewChild
} from '@angular/core';

import {
	async,
	ComponentFixture,
	TestBed
} from '@angular/core/testing';

import { DndContainer } from '../src/dnd-container';
import { DndModule } from '../src/dnd.module';

@Component({
	selector: 'test-cmp',
	template: '<div [dndContainer]="container"></div>'
})
export class TestComponent {
	container: any;
	items: any;

	@ViewChild(DndContainer)
	dndContainer: DndContainer;
}

const INPUTS_TEMPLATE = `
	<div
			[dndContainer]="container"
			[dndItems]="items"></div>`;

function createDefaultTestComponent(): ComponentFixture<TestComponent> {
	return TestBed.createComponent(TestComponent);
}

function createTestComponentWithInputs(): ComponentFixture<TestComponent> {
	return TestBed.overrideComponent(TestComponent, { set: { template: INPUTS_TEMPLATE } })
			.createComponent(TestComponent);
}

describe('DndContainer', () => {
	let fixture: ComponentFixture<TestComponent>;

	function getTestComponent(): TestComponent {
		return fixture.componentInstance;
	}

	function getDndContainer(): DndContainer {
		return getTestComponent().dndContainer;
	}

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
		fixture = createDefaultTestComponent();

		expect(getTestComponent()).toBeDefined();
	});

	it('should have an assignable container object', () => {
		const container = {};
		fixture = createDefaultTestComponent();
		getTestComponent().container = container;
		fixture.detectChanges();

		expect(getDndContainer().dndContainer).toBe(container);
	});

	it('should have an assignable items for holding content in the container', () => {
		const items = ['object 1', 'object 2'];
		fixture = createTestComponentWithInputs();
		getTestComponent().items = items;
		fixture.detectChanges();

		expect(getDndContainer().dndItems).toEqual(items);
	});
});
