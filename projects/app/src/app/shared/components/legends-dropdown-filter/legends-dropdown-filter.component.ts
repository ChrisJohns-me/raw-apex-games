import { Legend } from "#app/models/legend/legend.js";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-legends-dropdown-filter",
    templateUrl: "./legends-dropdown-filter.component.html",
    styleUrls: ["./legends-dropdown-filter.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendsDropdownFilterComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public legendList: Legend[] = [];
    @Input() public selectAll?: Subject<void>;
    @Input() public clearAll?: Subject<void>;
    @Output("selectedLegends") public selectedLegendsOutput = new EventEmitter<Legend[]>();

    public selectedLegendsFormGroup!: UntypedFormGroup;

    /** Shown on the Legend Selection button */
    public get selectedLegendsText(): string {
        if (this.everyLegendsSelected) return "All Legends";
        if (!this.everyLegendsSelected && !this.someLegendsSelected) return "No Legends";
        const legendsSelected = Object.entries(this.selectedLegendsFormGroup.controls).filter(
            ([, legendFormControl]) => !!legendFormControl.value
        );
        if (legendsSelected.length === 1) {
            const legendId = legendsSelected[0][0];
            const foundLegend = this.legendList.find((m) => m.legendId === legendId);
            return foundLegend?.name ?? "One Legend";
        }

        return "Selected Legends";
    }
    public get everyLegendsSelected(): boolean {
        return Object.values(this.selectedLegendsFormGroup.controls).every((legendFormControl) => !!legendFormControl.value);
    }
    public get someLegendsSelected(): boolean {
        return Object.entries(this.selectedLegendsFormGroup.controls).some(([, legendFormControl]) => !!legendFormControl.value);
    }
    public get partialLegendsSelected(): boolean {
        return this.someLegendsSelected && !this.everyLegendsSelected;
    }

    private get selectedLegendIds(): string[] {
        return Object.entries(this.selectedLegendsFormGroup.controls)
            .filter(([, legendFormControl]) => !!legendFormControl.value)
            .map(([legendId]) => legendId);
    }
    private get selectedLegends(): Legend[] {
        return this.selectedLegendIds
            .map((legendId) => this.legendList.find((m) => m.legendId === legendId))
            .filter((m) => !!m) as Legend[];
    }

    private selectedLegendsChangeSubscription?: Subscription;
    private destroy$ = new Subject<void>();

    constructor() {}

    public ngOnInit(): void {
        this.setupLegendsList(this.legendList);
        this.setupSelectedLegendsChange();
        this.selectAll?.pipe(takeUntil(this.destroy$)).subscribe(() => {
            Object.entries(this.selectedLegendsFormGroup.controls).filter(([, legendFormControl]) => legendFormControl.setValue(true));
        });
        this.clearAll?.pipe(takeUntil(this.destroy$)).subscribe(() => {
            Object.entries(this.selectedLegendsFormGroup.controls).filter(([, legendFormControl]) => legendFormControl.setValue(false));
        });
    }

    public ngOnChanges(): void {
        this.setupLegendsList(this.legendList);
        this.setupSelectedLegendsChange();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onAllLegendsSelectedChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!(target instanceof HTMLInputElement)) return;
        const formControls = Object.entries(this.selectedLegendsFormGroup.controls);
        formControls.forEach(([, form]) => form.setValue(target.checked, { emitEvent: false }));
        this.selectedLegendsOutput.emit(this.selectedLegends);
    }

    private setupLegendsList(legendList: Legend[]): void {
        const group: Record<string, UntypedFormControl> = {};
        legendList.forEach((matchLegend) => {
            if (!matchLegend.legendId) return;
            group[matchLegend.legendId] = new UntypedFormControl(true);
        });

        this.selectedLegendsFormGroup = new UntypedFormGroup(group);
    }

    private setupSelectedLegendsChange(): void {
        this.selectedLegendsChangeSubscription?.unsubscribe();
        this.selectedLegendsChangeSubscription = this.selectedLegendsFormGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.selectedLegendsOutput.emit(this.selectedLegends);
        });
    }
}
