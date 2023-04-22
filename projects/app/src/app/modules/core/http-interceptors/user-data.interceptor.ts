import { UserData } from "#shared/models/user-data";
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PlayerOriginIdService } from "../player-origin-id.service";

@Injectable()
export class HttpUserDataInterceptor implements HttpInterceptor {
    constructor(private readonly playerOriginId: PlayerOriginIdService) {}

    public intercept(req: HttpRequest<unknown>, next: HttpHandler) {
        const userData = new UserData({
            originId: this.playerOriginId.myOriginId$.value,
        });
        const authReq = req.clone({ headers: req.headers.set("x-origin-id", userData.originId) });
        return next.handle(authReq);
    }
}
