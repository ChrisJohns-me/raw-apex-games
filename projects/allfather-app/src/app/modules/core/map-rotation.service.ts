import { Injectable } from "@angular/core";
import { AllfatherService } from "./allfather-service.abstract";

/**
 * @classdesc Provides
 */
@Injectable({
    providedIn: "root",
})
export class MapRotationService extends AllfatherService {
    constructor() {
        super();
    }
}
