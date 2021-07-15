import { bindCallback, Observable, Subject } from "rxjs";

export class StreamingDelegate {
    public readonly onStartStreaming$ = new Subject<overwolf.streaming.StreamEvent>();
    public readonly onStopStreaming$ = new Subject<overwolf.streaming.StopStreamingEvent>();
    public readonly onStreamingError$ = new Subject<overwolf.streaming.StreamEvent>();
    public readonly onStreamingWarning$ = new Subject<overwolf.streaming.StreamEvent>();
    public readonly onVideoFileSplited$ = new Subject<overwolf.streaming.VideoFileSplitedEvent>();

    public start(streamSettings: overwolf.streaming.StreamSettings): Observable<overwolf.streaming.StreamResult> {
        const startObs = bindCallback(overwolf.streaming.start);
        return startObs(streamSettings);
    }

    public stop(streamId: number): Observable<overwolf.streaming.StreamResult | overwolf.streaming.StopStreamingResult> {
        const stopObs = bindCallback(overwolf.streaming.stop);
        return stopObs(streamId);
    }
}
