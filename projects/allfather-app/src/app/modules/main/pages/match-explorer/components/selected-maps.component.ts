import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-selected-maps",
    templateUrl: "./selected-maps.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedMapsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public mapList: MatchMap[] = [];
    @Output("selectedMaps") public selectedMapsOutput = new EventEmitter<MatchMap[]>();

    public get battleRoyaleMapList(): MatchMap[] {
        return this.mapList.filter((m) => m.isBattleRoyaleMap);
    }
    public get arenasMapList(): MatchMap[] {
        return this.mapList.filter((m) => m.isArenasMap);
    }

    public selectedMapsFormGroup!: FormGroup;
    public get selectedBattleRoyaleMapsForms(): Array<[mapId: string, form: FormControl]> {
        return Object.entries(this.selectedMapsFormGroup.controls).filter(([mapId]) =>
            this.battleRoyaleMapList.map((m) => m.mapId).includes(mapId)
        ) as Array<[string, FormControl]>;
    }
    public get selectedArenasMapsForms(): Array<[mapId: string, form: FormControl]> {
        return Object.entries(this.selectedMapsFormGroup.controls).filter(([mapId]) =>
            this.arenasMapList.map((m) => m.mapId).includes(mapId)
        ) as Array<[string, FormControl]>;
    }

    /** Shown on the Map Selection button */
    public get selectedMapsText(): string {
        if (this.everyMapsSelected) return "All Maps";
        if (!this.everyMapsSelected && !this.someMapsSelected) return "No Maps";
        const mapsSelected = Object.entries(this.selectedMapsFormGroup.controls).filter(([, mapFormControl]) => !!mapFormControl.value);
        if (mapsSelected.length === 1) {
            const mapId = mapsSelected[0][0];
            const foundMap = this.mapList.find((m) => m.mapId === mapId);
            return foundMap?.mapName ?? "One Map";
        }

        // Battle Royal only Maps
        if (this.someBattleRoyaleMapsSelected && !this.someArenasMapsSelected) {
            if (this.everyBattleRoyaleMapsSelected) return "All Battle Royale Maps";
            else return "Some Battle Royale Maps";
        }

        // Arenas only Maps
        if (this.someArenasMapsSelected && !this.someBattleRoyaleMapsSelected) {
            if (this.everyArenasMapsSelected) return "All Arenas Maps";
            else return "Some Arenas Maps";
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
        return this.selectedBattleRoyaleMapsForms.every(([, mapFormControl]) => !!mapFormControl.value);
    }
    public get someBattleRoyaleMapsSelected(): boolean {
        return this.selectedBattleRoyaleMapsForms.some(([, mapFormControl]) => !!mapFormControl.value);
    }
    public get partialBattleRoyaleMapsSelected(): boolean {
        return this.someBattleRoyaleMapsSelected && !this.everyBattleRoyaleMapsSelected;
    }
    public get everyArenasMapsSelected(): boolean {
        return this.selectedArenasMapsForms.every(([, mapFormControl]) => !!mapFormControl.value);
    }
    public get someArenasMapsSelected(): boolean {
        return this.selectedArenasMapsForms.some(([, mapFormControl]) => !!mapFormControl.value);
    }
    public get partialArenasMapsSelected(): boolean {
        return this.someArenasMapsSelected && !this.everyArenasMapsSelected;
    }

    private get selectedMapIds(): string[] {
        return Object.entries(this.selectedMapsFormGroup.controls)
            .filter(([, mapFormControl]) => !!mapFormControl.value)
            .map(([mapId]) => mapId);
    }
    private get selectedMaps(): MatchMap[] {
        return this.selectedMapIds.map((mapId) => this.mapList.find((m) => m.mapId === mapId)).filter((m) => !!m) as MatchMap[];
    }

    private selectedMapsChangeSubscription?: Subscription;
    private destroy$ = new Subject<void>();

    constructor() {}

    public ngOnInit(): void {
        this.setupMapsList(this.mapList);
        this.setupSelectedMapsChange();
    }

    public ngOnChanges(): void {
        this.setupMapsList(this.mapList);
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
    }

    public onAllBattleRoyaleMapsSelectedChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!(target instanceof HTMLInputElement)) return;

        this.setBattleRoyaleMapsAllSelected(target.checked);
    }

    public onAllArenasMapsSelectedChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!(target instanceof HTMLInputElement)) return;

        this.setArenasMapsAllSelected(target.checked);
    }
    //#endregion

    private setupMapsList(mapList: MatchMap[]): void {
        const group: Record<string, FormControl> = {};
        mapList.forEach((matchMap) => {
            group[matchMap.mapId] = new FormControl(true);
        });

        this.selectedMapsFormGroup = new FormGroup(group);
    }

    private setupSelectedMapsChange(): void {
        this.selectedMapsChangeSubscription?.unsubscribe();
        this.selectedMapsChangeSubscription = this.selectedMapsFormGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((change) => {
            this.selectedMapsOutput.emit(this.selectedMaps);
        });
    }

    private setBattleRoyaleMapsAllSelected(selectAll: boolean): void {
        this.selectedBattleRoyaleMapsForms.forEach(([, form]) => form.setValue(selectAll));
    }

    private setArenasMapsAllSelected(selectAll: boolean): void {
        this.selectedArenasMapsForms.forEach(([, form]) => form.setValue(selectAll));
    }
}
