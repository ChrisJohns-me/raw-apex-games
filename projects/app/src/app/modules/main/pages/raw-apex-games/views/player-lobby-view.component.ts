import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum";
import { RawGamesPlayerService } from "#app/modules/core/raw-games/player.service";
import { RawGameLobby } from "#shared/models/raw-games/lobby";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { formatDistance } from "date-fns";
import { interval, Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-player-lobby-view",
    templateUrl: "./player-lobby-view.component.html",
    styleUrls: ["./player-lobby-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerLobbyViewComponent implements OnInit, OnDestroy {
    @Input() public lobby?: Optional<RawGameLobby>;
    public lobbyCodeDate?: Optional<Date> = new Date();
    public get timeUntilLobbyEnds(): string {
        if (!this.lobby?.endDate) return "";
        return formatDistance(this.lobby.endDate, new Date(), { addSuffix: true });
    }
    public get playlistItems(): {
        friendlyName: string;
        playlist: MatchGameModePlaylist;
        enabled: boolean;
    }[] {
        if (!this.lobby) return [];
        const friendlyName =
            this.lobby.gameModePlaylist === MatchGameModePlaylist.Mixtape
                ? "Mixtape"
                : this.lobby.gameModePlaylist === MatchGameModePlaylist.BattleRoyale
                ? "Battle Royale"
                : "Unknown";
        return [
            {
                friendlyName,
                playlist: this.lobby.gameModePlaylist,
                enabled: false,
            },
        ];
    }

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly rawGamesPlayer: RawGamesPlayerService) {}

    public ngOnInit(): void {
        interval(60 * 1000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refreshUI());
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}
