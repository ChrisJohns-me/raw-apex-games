import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { ConfigurationService } from "#app/modules/core/configuration.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { organizerOriginIds } from "#shared/models/organizer-list.js";
import { RawGameLobby } from "#shared/models/raw-games/lobby.js";
import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, filter, map, Observable, switchMap, takeUntil } from "rxjs";
import { PlayerOriginIdService } from "../player-origin-id.service.js";

/**
 * @classdesc Service for the Raw Apex Games Organizer.
 */
@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, HttpClient, PlayerOriginIdService],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("RawGamesOrganizerService", RawGamesOrganizerService, deps),
})
export class RawGamesOrganizerService extends BaseService implements OnDestroy {
    /** Is the current user one of the designated organizers */
    public isUserOrganizer$ = new BehaviorSubject<boolean>(false);

    // private socket: Optional<Socket>; // Recheck Socket.io dependencies

    constructor(
        private readonly configuration: ConfigurationService,
        private readonly http: HttpClient,
        private readonly playerOriginId: PlayerOriginIdService
    ) {
        super();
        this.setupOrganizer();
        // this.setupSocket();
    }

    public getLobbies(): Observable<RawGameLobby[]> {
        return this.configuration.config$.pipe(
            takeUntil(this.destroy$),
            switchMap((config) => this.http.get<RawGameLobby>(`${config.general.apiUrl}raw-games/lobbies`)),
            map((lobbies) => (Array.isArray(lobbies) ? lobbies.map((l) => new RawGameLobby(l)) : []))
        );
    }

    public createLobby(lobby: RawGameLobby): Observable<RawGameLobby> {
        const lobbyId = lobby.lobbyId;
        return this.configuration.config$.pipe(
            takeUntil(this.destroy$),
            switchMap((config) => this.http.post(`${config.general.apiUrl}raw-games/lobby/${lobbyId}`, lobby)),
            switchMap(() => this.getLobby(lobbyId))
        );
    }

    public getLobby(lobbyId: string): Observable<RawGameLobby> {
        return this.configuration.config$.pipe(
            takeUntil(this.destroy$),
            switchMap((config) => this.http.get<RawGameLobby>(`${config.general.apiUrl}raw-games/lobby/${lobbyId}`)),
            map((lobbyJson) => new RawGameLobby(lobbyJson))
        );
    }

    // public joinLobby(): Observable<null> {
    //     if (!this.socket) return throwError(() => new Error("Socket not connected"));
    //     this.socket.connect();
    //     return fromEvent<string>(this.socket, "connect").pipe(map(() => null));
    // }

    // public onLobbyDisconnect(): Observable<null> {
    //     if (!this.socket) return of(null);
    //     return fromEvent<string>(this.socket, "disconnect").pipe(map(() => null));
    // }

    // public onLobbyUpdate(): Observable<RawGameLobby> {
    //     if (!this.socket) return throwError(() => new Error("Socket not connected"));
    //     return fromEvent<RawGameLobby>(this.socket, "lobbyUpdate").pipe(map((lobby) => new RawGameLobby(lobby)));
    // }

    // public emitLobbyUpdate(lobby: RawGameLobby): void {
    //     if (!this.socket) return;
    //     this.socket.emit("lobbyUpdate", lobby);
    // }

    // public leaveLobby(): void {
    //     if (!this.socket) return;
    //     this.socket.disconnect();
    // }

    // private setupSocket(): void {
    //     this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
    //         if (this.socket) this.socket.disconnect();
    //         this.socket = io(config.general.wssUrl, { autoConnect: false, retries: 3 });
    //     });
    // }

    private setupOrganizer(): void {
        this.playerOriginId.myOriginId$
            .pipe(
                takeUntil(this.destroy$),
                filter((myOriginId): myOriginId is string => !!myOriginId?.length)
            )
            .subscribe((myOriginId) => {
                this.isUserOrganizer$.next(organizerOriginIds.includes(myOriginId));
            });
    }
}
