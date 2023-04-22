import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { ConfigurationService } from "#app/modules/core/configuration.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { RawGameLobby } from "#shared/models/raw-games/lobby.js";
import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { map, Observable, switchMap, takeUntil } from "rxjs";

/**
 * @classdesc Service for the Raw Apex Games Organizer.
 */
@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, HttpClient],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("RawGamesOrganizerService", RawGamesOrganizerService, deps),
})
export class RawGamesOrganizerService extends BaseService implements OnDestroy {
    // private socket: Optional<Socket>; // Recheck Socket.io dependencies

    constructor(private readonly configuration: ConfigurationService, private readonly http: HttpClient) {
        super();
        // this.setupSocket();
    }

    public getLobbies(): Observable<RawGameLobby[]> {
        return this.configuration.config$.pipe(
            takeUntil(this.destroy$),
            switchMap((config) => this.http.get<RawGameLobby>(`${config.general.apiUrl}raw-games/lobbies`)),
            map((lobbies) => (Array.isArray(lobbies) ? lobbies.map((l) => new RawGameLobby(l)) : []))
        );
    }

    public createLobby(lobby: RawGameLobby): Observable<null> {
        return this.configuration.config$.pipe(
            takeUntil(this.destroy$),
            switchMap((config) => this.http.post<null>(`${config.general.apiUrl}raw-games/lobby`, lobby))
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
}
