import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/app/singleton-service.provider.factory";
import { Socket, SocketIoConfig } from "ngx-socket-io";
import { BaseService } from "../base-service.abstract";
import { ConfigurationService } from "../configuration.service";

/**
 * @classdesc
 */
@Injectable({
    providedIn: "root",
    deps: [ConfigurationService],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("RawGamesSocketService", RawGamesSocketService, deps),
})
export class RawGamesSocketService extends BaseService implements OnDestroy {
    private readonly socketConfig: SocketIoConfig = {
        url: "http://192.168.43.142:9780",
        options: {},
    };

    constructor(private readonly configuration: ConfigurationService, private readonly socket: Socket) {
        this.socket = new Socket(this.socketConfig);
    }

    public changeToAdminSocket(): void {
        this.socket.disconnect();
        this.config.url = "http://192.168.43.142:9781"; // Note the port change
        this.socket = new Socket(this.socketConfig);
    }
}
