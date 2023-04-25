import { Hotkey } from "#app/models/hotkey.js";
import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum.js";
import { OverwolfWindowName } from "#app/models/overwolf-window.js";
import { PlayerOriginIdService } from "#app/modules/core/player-origin-id.service";
import { RawGameLobby } from "#shared/models/raw-games/lobby.js";
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { mdiArrowLeft } from "@mdi/js";
import { filter, Subject, takeUntil } from "rxjs";
import { RawApexGamesView } from "./views/raw-apex-games-view.enum.js";

@Component({
    selector: "app-raw-apex-games-page",
    templateUrl: "./raw-apex-games-page.component.html",
    styleUrls: ["./raw-apex-games-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawApexGamesPageComponent implements OnInit, AfterViewChecked, OnDestroy {
    public selectedLobby?: Optional<RawGameLobby>;
    public selectedPlayList?: Optional<MatchGameModePlaylist>;
    public mainHotkey?: Hotkey;
    public hasRequiredData = false;

    public view = RawApexGamesView.Main;

    public readonly RawApexGamesView = RawApexGamesView;
    public readonly OverwolfWindowName = OverwolfWindowName;
    public readonly mdiArrowLeft = mdiArrowLeft;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly playerOriginId: PlayerOriginIdService) {}

    public ngOnInit(): void {
        this.setupRequiredData();
    }

    public ngAfterViewChecked(): void {
        this.refreshUI();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSelectLobby(lobby: RawGameLobby): void {
        this.selectedLobby = lobby;
        this.view = RawApexGamesView.PlayerLobby;
    }

    private setupRequiredData(): void {
        this.playerOriginId.myOriginId$
            .pipe(
                takeUntil(this.destroy$),
                filter((originId): originId is string => !!originId?.length)
            )
            .subscribe((originId) => {
                this.hasRequiredData = !!originId;
            });
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}
