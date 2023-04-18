import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatchMapGenericId } from "@app/app/common/match/map/map.enum";
import { MatchMap } from "@app/app/common/match/map/match-map";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

/**
 * Utilizes Map's GenericId for determining selection
 */
@Component({
    selector: "app-maps-dropdown-filter",
    templateUrl: "./maps-dropdown-filter.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsDropdownFilterComponent implements OnInit, OnChanges, OnDestroy {
    /** Input only Genericized Map List */
    @Input() public genericMapList: MatchMap[] = [];
    @Input() public selectAll?: Subject<void>;
    @Input() public clearAll?: Subject<void>;
    @Output("selectedMaps") public selectedMapsOutput = new EventEmitter<MatchMap[]>();

    public get mapList(): MatchMap[] {
        return this.genericMapList;
    }

    public selectedMapsFormGroup!: UntypedFormGroup;
    public get mapsForms(): Array<[mapGenericId: string, form: UntypedFormControl]> {
        return Object.entries(this.selectedMapsFormGroup.controls).filter(([mapGenericId]) =>
            this.mapList.map((m) => m.mapGenericId).includes(mapGenericId as MatchMapGenericId)
        ) as Array<[string, UntypedFormControl]>;
    }

    /** Shown on the Map Selection button */
    public get selectedMapsText(): string {
        if (this.everyMapsSelected) return "All Maps";
        if (!this.everyMapsSelected && !this.someMapsSelected) return "No Maps";
        const mapsSelected = Object.entries(this.selectedMapsFormGroup.controls).filter(([, mapFormControl]) => !!mapFormControl.value);
        if (mapsSelected.length === 1) {
            const mapGenericId = mapsSelected[0][0];
            const foundMap = this.genericMapList.find((m) => m.mapGenericId === mapGenericId);
            return foundMap?.mapName ?? "One Map";
        }

        // Battle Royal only Maps
        if (this.someBattleRoyaleMapsSelected) {
            if (this.everyBattleRoyaleMapsSelected) return "All Battle Royale Maps";
            else return "Some Battle Royale Maps";
        }

        return "Selected Maps";
    }
    public get everyMapsSelected(): boolean {
        return Object.values(this.selectedMapsFormGroup.controls).every((mapFormControl) => !!mapFormControl.value);
    }
    public get someMapsSelected(): boolean {
        return Object.entries(this.selectedMapsFormGroup.controls).some(([, mapFormControl]) => !!mapFormControl.value);
    }
    public get partialMapsSelected(): boolean {
        return this.someMapsSelected && !this.everyMapsSelected;
    }
    public get everyBattleRoyaleMapsSelected(): boolean {
        return this.mapsForms.every(([, mapFormControl]) => !!mapFormControl.value);
    }
    public get someBattleRoyaleMapsSelected(): boolean {
        return this.mapsForms.some(([, mapFormControl]) => !!mapFormControl.value);
    }
    public get partialBattleRoyaleMapsSelected(): boolean {
        return this.someBattleRoyaleMapsSelected && !this.everyBattleRoyaleMapsSelected;
    }

    private get selectedMapGenericIds(): string[] {
        return Object.entries(this.selectedMapsFormGroup.controls)
            .filter(([, mapFormControl]) => !!mapFormControl.value)
            .map(([mapGenericId]) => mapGenericId);
    }
    private get selectedMaps(): MatchMap[] {
        return this.selectedMapGenericIds
            .map((mapGenericId) => this.genericMapList.find((m) => m.mapGenericId === mapGenericId))
            .filter((m) => !!m) as MatchMap[];
    }

    private selectedMapsChangeSubscription?: Subscription;
    private destroy$ = new Subject<void>();

    constructor() {}

    public ngOnInit(): void {
        this.setupMapsList(this.genericMapList);
        this.setupSelectedMapsChange();
        this.selectAll?.pipe(takeUntil(this.destroy$)).subscribe(() => {
            Object.entries(this.selectedMapsFormGroup.controls).filter(([, mapFormControl]) => mapFormControl.setValue(true));
        });
        this.clearAll?.pipe(takeUntil(this.destroy$)).subscribe(() => {
            Object.entries(this.selectedMapsFormGroup.controls).filter(([, mapFormControl]) => mapFormControl.setValue(false));
        });
    }

    public ngOnChanges(): void {
        this.setupMapsList(this.genericMapList);
        this.setupSelectedMapsChange();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    //#region Forms
    public onAllMapsSelectedChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!(target instanceof HTMLInputElement)) return;

        this.setBattleRoyaleMapsAllSelected(target.checked);
        this.setArenasMapsAllSelected(target.checked);
        this.selectedMapsOutput.emit(this.selectedMaps);
    }

    public onAllBattleRoyaleMapsSelectedChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!(target instanceof HTMLInputElement)) return;

        this.setBattleRoyaleMapsAllSelected(target.checked);
        this.selectedMapsOutput.emit(this.selectedMaps);
    }

    public onAllArenasMapsSelectedChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!(target instanceof HTMLInputElement)) return;

        this.setArenasMapsAllSelected(target.checked);
        this.selectedMapsOutput.emit(this.selectedMaps);
    }
    //#endregion

    private setupMapsList(mapList: MatchMap[]): void {
        const group: Record<string, UntypedFormControl> = {};
        mapList.forEach((matchMap) => {
            group[matchMap.mapGenericId] = new UntypedFormControl(true);
        });
        this.selectedMapsFormGroup = new UntypedFormGroup(group);
    }

    private setupSelectedMapsChange(): void {
        this.selectedMapsChangeSubscription?.unsubscribe();
        this.selectedMapsChangeSubscription = this.selectedMapsFormGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((change) => {
            this.selectedMapsOutput.emit(this.selectedMaps);
        });
    }

    private setBattleRoyaleMapsAllSelected(selectAll: boolean): void {
        this.mapsForms.forEach(([, form]) => form.setValue(selectAll, { emitEvent: false }));
    }

    private setArenasMapsAllSelected(selectAll: boolean): void {
        this.mapsForms.forEach(([, form]) => form.setValue(selectAll, { emitEvent: false }));
    }
}
