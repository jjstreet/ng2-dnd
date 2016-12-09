import {
	ChangeDetectorRef,
	CollectionChangeRecord,
	DefaultIterableDiffer,
	Directive,
	EmbeddedViewRef,
	Input,
	IterableDiffer,
	IterableDiffers,
	DoCheck,
	OnChanges,
	SimpleChanges,
	TemplateRef,
	ViewContainerRef
} from '@angular/core';

function getTypeNameForDebugging(type: any): string {
	return type['name'] || typeof type;
}

export interface DndTrackByFn { (index: number, item: any): any; }

export class DndForRow {

	constructor(
			public $implicit: any, public index: number, public count: number) {}

	get first(): boolean { return this.index === 0; }

	get last(): boolean { return this.index === this.count - 1; }

	get even(): boolean { return this.index % 2 === 0; }

	get odd(): boolean { return !this.even; }
}

class RecordViewTuple {

	constructor(public record: any, public view: EmbeddedViewRef<DndForRow>) {}
}

@Directive({
	selector: '[dndFor][dndForOf]'
})
export class DndFor implements DoCheck, OnChanges {

	@Input() dndForOf: any;
	@Input() dndForTrackBy: DndTrackByFn;

	private differ: IterableDiffer = null;

	private placeholder: EmbeddedViewRef<any>;

	constructor(
			private viewContainerRef: ViewContainerRef,
			private templateRef: TemplateRef<DndForRow>,
			private differs: IterableDiffers,
			private cdr: ChangeDetectorRef
	) {}

	ngDoCheck() {
		if (this.differ) {
			const changes = this.differ.diff(this.dndForOf);
			if (changes) {
				this.applyChanges(changes);
			}
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if ('dndForOf' in changes) {
			const value = changes['dndForOf'].currentValue;
			if (!this.differ && value) {
				try {
					this.differ = this.differs.find(value).create(this.cdr, this.dndForTrackBy);
				} catch (e) {
					throw new Error(
							`Cannot find a differ supporting object '${value}' of type ` +
							`'${getTypeNameForDebugging(value)}'. DndFor only supports ` +
							`binding to Iterables such as Arrays.`);
				}
			}
		}
	}

	private applyChanges(changes: DefaultIterableDiffer) {
		if (this.placeholder) {
			this.placeholder.destroy();
			this.placeholder = null;
		}
		const insertTuples: RecordViewTuple[] = [];
		changes.forEachOperation(
				(item: CollectionChangeRecord, adjustedPreviousIndex: number, currentIndex: number) => {
					if (item.previousIndex == null) {
						// new item (could be dropped item?)
						const view = this.viewContainerRef.createEmbeddedView(
								this.templateRef, new DndForRow(null, null, null), currentIndex);
						const tuple = new RecordViewTuple(item, view);
						insertTuples.push(tuple);
					} else if (currentIndex == null) {
						// Item removed (could be dragged item?)
						this.viewContainerRef.remove(adjustedPreviousIndex);
					} else {
						// Item moved
						const view = this.viewContainerRef.get(adjustedPreviousIndex);
						this.viewContainerRef.move(view, currentIndex);
						const tuple = new RecordViewTuple(item, <EmbeddedViewRef<DndForRow>>view);
						insertTuples.push(tuple);
					}
				});

		for (let i = 0; i < insertTuples.length; i++) {
			this.perViewChange(insertTuples[i].view, insertTuples[i].record);
		}

		for (let i = 0, vcSize = this.viewContainerRef.length; i < vcSize; i++) {
			const viewRef = <EmbeddedViewRef<DndForRow>>this.viewContainerRef.get(i);
			viewRef.context.index = i;
			viewRef.context.count = vcSize; // TODO: do not include placeholder;
		}

		changes.forEachIdentityChange((record: CollectionChangeRecord) => {
			const viewRef = <EmbeddedViewRef<DndForRow>>this.viewContainerRef.get(record.currentIndex);
			viewRef.context.$implicit = record.item;
		});
	}

	private perViewChange(view: EmbeddedViewRef<DndForRow>, record: CollectionChangeRecord) {
		view.context.$implicit = record.item;
	}
}
