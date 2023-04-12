import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { Observable, Subject } from "rxjs";
import { BaseService } from "../base-service.abstract";
import { StreamingDelegate } from "./api/streaming/streaming-delegate";
import {
    OWStopStreamingEvent,
    OWStopStreamingResult,
    OWStreamEvent,
    OWStreamResult,
    OWStreamSettings,
    OWVideoSplitedEvent,
} from "./types/overwolf-types";

/**
 * @class OverwolfStreamingService
 * @classdesc Wrapper for Overwolf's "overwolf.streaming." API namespace.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfStreamingService", OverwolfStreamingService, deps),
})
export class OverwolfStreamingService extends BaseService {
    //#region Delegate Outputs
    public get onStartStreaming$(): Subject<OWStreamEvent> {
        return this.streamingDelegate.onStartStreaming$;
    }
    public get onStopStreaming$(): Subject<OWStopStreamingEvent> {
        return this.streamingDelegate.onStopStreaming$;
    }
    public get onStreamingError$(): Subject<OWStreamEvent> {
        return this.streamingDelegate.onStreamingError$;
    }
    public get onStreamingWarning$(): Subject<OWStreamEvent> {
        return this.streamingDelegate.onStreamingWarning$;
    }
    public get onVideoFileSplited$(): Subject<OWVideoSplitedEvent> {
        return this.streamingDelegate.onVideoFileSplited$;
    }
    //#endregion

    private streamingDelegate = new StreamingDelegate();

    public start(streamSettings: OWStreamSettings): Observable<OWStreamResult> {
        return this.streamingDelegate.start(streamSettings);
    }

    public stop(streamId: number): Observable<OWStopStreamingResult> {
        return this.streamingDelegate.stop(streamId);
    }
}
