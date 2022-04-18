import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-game-modes-dropdown-filter",
    templateUrl: "./game-modes-dropdown-filter.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameModesDropdownFilterComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public gameModeList: MatchGameMode[] = [];
    @Input() public selectAll?: Subject<void>;
    @Input() public clearAll?: Subject<void>;
    @Output("selectedGameModes") public selectedGameModesOutput = new EventEmitter<MatchGameMode[]>();

    public selectedGameModesFormGroup!: FormGroup;

    /** Shown on the Game Mode Selection button */
    public get selectedGameModesText(): string {
        if (this.everyGameModesSelected) return "All Game Modes";
        if (!this.everyGameModesSelected && !this.someGameModesSelected) return "No Game Modes";
        const gameModesSelected = Object.entries(this.selectedGameModesFormGroup.controls).filter(
            ([, gameModeFormControl]) => !!gameModeFormControl.value
        );
        if (gameModesSelected.length === 1) {
            const gameModeId = gameModesSelected[0][0];
            const foundGameMode = this.gameModeList.find((m) => m.gameModeId === gameModeId);
            return foundGameMode?.gameModeName ?? "One Game Mode";
        }

        return "Selected Game Modes";
    }
    public get everyGameModesSelected(): boolean {
        return Object.values(this.selectedGameModesFormGroup.controls).every((gameModeFormControl) => !!gameModeFormControl.value);
    }
    public get someGameModesSelected(): boolean {
        return Object.entries(this.selectedGameModesFormGroup.controls).some(([, gameModeFormControl]) => !!gameModeFormControl.value);
    }
    public get partialGameModesSelected(): boolean {
        return this.someGameModesSelected && !this.everyGameModesSelected;
    }

    private get selectedGameModeIds(): string[] {
        return Object.entries(this.selectedGameModesFormGroup.controls)
            .filter(([, gameModeFormControl]) => !!gameModeFormControl.value)
            .map(([gameModeId]) => gameModeId);
    }
    private get selectedGameModes(): MatchGameMode[] {
        return this.selectedGameModeIds
            .map((gameModeId) => this.gameModeList.find((m) => m.gameModeId === gameModeId))
            .filter((m) => !!m) as MatchGameMode[];
    }

    private selectedGameModesChangeSubscription?: Subscription;
    private destroy$ = new Subject<void>();

    constructor() {}

    public ngOnInit(): void {
        this.setupGameModesList(this.gameModeList);
        this.setupSelectedGameModesChange();
        this.selectAll?.pipe(takeUntil(this.destroy$)).subscribe(() => {
            Object.entries(this.selectedGameModesFormGroup.controls).filter(([, gameModeFormControl]) =>
                gameModeFormControl.setValue(true)
            );
        });
        this.clearAll?.pipe(takeUntil(this.destroy$)).subscribe(() => {
            Object.entries(this.selectedGameModesFormGroup.controls).filter(([, gameModeFormControl]) =>
                gameModeFormControl.setValue(false)
            );
        });
    }

    public ngOnChanges(): void {
        this.setupGameModesList(this.gameModeList);
        this.setupSelectedGameModesChange();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onAllGameModesSelectedChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!(target instanceof HTMLInputElement)) return;
        const formControls = Object.entries(this.selectedGameModesFormGroup.controls);
        formControls.forEach(([, form]) => form.setValue(target.checked, { emitEvent: false }));
        this.selectedGameModesOutput.emit(this.selectedGameModes);
    }

    private setupGameModesList(gameModeList: MatchGameMode[]): void {
        const group: Record<string, FormControl> = {};
        gameModeList.forEach((gameMode) => {
            if (!gameMode.gameModeId) return;
            group[gameMode.gameModeId] = new FormControl(true);
        });

        this.selectedGameModesFormGroup = new FormGroup(group);
    }

    private setupSelectedGameModesChange(): void {
        this.selectedGameModesChangeSubscription?.unsubscribe();
        this.selectedGameModesChangeSubscription = this.selectedGameModesFormGroup.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.selectedGameModesOutput.emit(this.selectedGameModes);
            });
    }
}
