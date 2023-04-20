import { Injectable } from "@angular/core";
import { BaseService } from "@app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { Observable, Subject } from "rxjs";
import { StreamingDelegate } from "./api/streaming/streaming-delegate.js";
import {
    OWStopStreamingEvent,
    OWStopStreamingResult,
    OWStreamEvent,
    OWStreamResult,
    OWStreamSettings,
    OWVideoSplitedEvent,
} from "./index.js";

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
