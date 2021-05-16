import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { PlatformHardware, PlatformSoftware } from "@allfather-app/app/common/platform";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { isTRNPlayerData, TRNBulkPlayerListRequest, TRNPlatformTypes, TRNPlayerData } from "./interfaces";
import { TRNConfig, TRN_CONFIG } from "./trn-config";

/**
 *
 */
@Injectable({
    providedIn: "root",
    deps: [TRN_CONFIG, HttpClient],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("TTNService", TTNService, deps),
})
export class TTNService {
    constructor(private readonly httpClient: HttpClient, private readonly trnConfig: TRNConfig) {}

    /**
     *
     * @todo Interface and return value still need to be mapped out.
     */
    public getPlayerData(rosterPlayer: MatchRosterPlayer): Observable<any> {
        if (!rosterPlayer?.name) of();
        const platform = this.getTRNPlatform(rosterPlayer.platformHardware, rosterPlayer.platformSoftware);
        const url = this.trnConfig.playerProfileUrl(platform ?? "origin", rosterPlayer.name!);
        const headers: { [header: string]: string } = { "TRN-Api-Key": this.trnConfig.API_KEY };
        const params: { [param: string]: string } = {};

        return this.httpClient.get(url, { headers, params }).pipe();
    }

    public getBulkPlayerData(rosterPlayers: MatchRosterPlayer[]): Observable<TRNPlayerData[]> {
        const inputPlayers: TRNBulkPlayerListRequest = rosterPlayers.map((rp) => {
            return {
                platform: this.getTRNPlatform(rp.platformHardware, rp.platformSoftware) ?? "origin",
                nickname: rp.name,
            };
        });
        const headers: { [header: string]: string } = { "TRN-Api-Key": this.trnConfig.API_KEY };

        return this.httpClient
            .post(this.trnConfig.bulkProfileUrl, inputPlayers, {
                headers,
                responseType: "json",
            })
            .pipe(
                map((response: any): TRNPlayerData[] => {
                    if (Array.isArray(response?.players) && response.players.every((p: unknown) => isTRNPlayerData(p)))
                        return response.players;
                    else return [];
                })
            );
    }

    private getTRNPlatform(platformHardware?: PlatformHardware, platformSoftware?: PlatformSoftware): Optional<TRNPlatformTypes> {
        if (platformHardware === PlatformHardware.PC && platformSoftware === PlatformSoftware.Origin) return "origin";
        else if (platformHardware === PlatformHardware.PC && platformSoftware === PlatformSoftware.Steam) return "steam";
        else if (platformHardware === PlatformHardware.PlayStation && platformSoftware === PlatformSoftware.PlayStation) return "psn";
        else if (platformHardware === PlatformHardware.Xbox && platformSoftware === PlatformSoftware.Xbox) return "xbl";
        else if (platformHardware === PlatformHardware.Switch && platformSoftware === PlatformSoftware.Switch) return "switch";
        else return undefined;
    }
}
