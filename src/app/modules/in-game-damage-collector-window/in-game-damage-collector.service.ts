import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { filter, takeUntil, tap } from "rxjs/operators";
import { DamageAction, Roster, RosterPlayerDamageActions } from "./roster-player-damage-action.interface";

@Injectable()
export class InGameDamageCollectorService implements OnDestroy {
    private rosterDamageHistory: RosterPlayerDamageActions = {};
    private activeRoster: Roster = {};

    private readonly _unsubscribe = new Subject<void>();

    constructor() {
        this.registerGameInfo();
        this.registerGameEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerGameInfo(): void {
        // TODO: Maybe clear roster when game ends
        this.gameEvents.gameInfo$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoData) => infoData?.feature === "roster"),
                tap((infoData) => {
                    const matchInfo = infoData?.info.match_info;
                    if (matchInfo) this.extractRoster(matchInfo);
                })
            )
            .subscribe();
    }

    private registerGameEvents(): void {
        this.gameEvents.gameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((gameEvent) => {
                    const parseable = gameEvent?.data && typeof gameEvent?.data === "string";
                    const data = parseable ? JSONTryParse<DtoGameEventData["data"]>(gameEvent?.data as string) : null;
                    if (gameEvent?.name === "match_start") {
                        // type: string
                        // ...
                    } else if (gameEvent?.name === "kill_feed") {
                        // ...
                        this.gameEventKillFeed(data as DtoGameEventKillFeed);
                    } else if (gameEvent?.name === "damage") {
                        this.gameEventDamage(data as DtoGameEventDamage);
                    } else if (gameEvent?.name === "knocked_out") {
                        // type: string
                        // ...
                    } else if (gameEvent?.name === "healed_from_ko") {
                        // ...
                    } else if (gameEvent?.name === "death") {
                        // type: string
                        // ...
                    } else if (gameEvent?.name === "respawn") {
                        // type: string
                        // ...
                    } else if (gameEvent?.name === "match_end") {
                        // type: string
                        // ...
                    }
                })
            )
            .subscribe();
    }

    /**
     * Extracts updates to the roster of players in the match.
     * Typically is fired when:
     *      - Beginning and end of the match
     *      - Teammates `state` changes
     */
    private extractRoster(matchInfo: DtoMatchInfo): void {
        const dtoRawRosterPlayerObj = incrementedPropertiesToKeyedObject(matchInfo, /^roster_(\d+)/);
        if (Object.keys(dtoRawRosterPlayerObj).length) return;

        Object.entries(dtoRawRosterPlayerObj).forEach(([key, value]) => {
            const parsedValue = JSONTryParse<DtoPlayerRoster>(value);
            if (!parsedValue?.name) return;
            this.activeRoster[parseInt(key)] = {
                playerName: parsedValue.name,
                teamId: parsedValue.team_id,
                platformInfo: {
                    hardware: parsedValue.platform_hw,
                    software: parsedValue.platform_sw,
                },
                hasShield: false,
                isKnocked: parsedValue.state === "knockedout",
                isEliminated: parsedValue.state === "dead",
            };
        });
    }

    //#region Game Events
    /**
     *
     */
    private gameEventKillFeed(killFeedEvent: DtoGameEventKillFeed): void {
        const action = killFeedEvent.action;
        action;
        const newDamageAction: DamageAction = {
            timestamp: new Date(),
            isKnocked: action === "knockdown" || action === "Caustic Gas" || action === "Melee",
            isEliminated: action === "kill" || action === "headshot_kill" || action === "Bleed Out",
        };
    }

    /**
     * Active player has inflicted damage on an enemy.
     * Data is already split up when crossing from sheild to health.
     *   damageAmount: "42.000000", armor: true
     *   damageAmount: "8.000000", armor: true
     *   damageAmount: "34.000000", armor: false
     *
     * @param damageEvent
     */
    private gameEventDamage(damageEvent: DtoGameEventDamage): void {
        const target = damageEvent.targetName;
        const hasShield = !!damageEvent.armor;
        const damageAmount = parseInt(damageEvent.damageAmount as string);
        const newDamageAction: DamageAction = {
            timestamp: new Date(),
            hasShield: hasShield, // TODO: Just make sure that this is in fact a boolean
            healthDamage: !hasShield ? damageAmount : 0,
            shieldDamage: hasShield ? damageAmount : 0,
        };

        this.rosterDamageHistory[target].push(newDamageAction);
    }
    //#endregion
}
