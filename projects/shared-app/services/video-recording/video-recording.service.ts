import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { isEmpty } from "common/utilities";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { BaseService } from "../base-service.abstract";
import { OWStopStreamingEvent, OWStreamEvent } from "../overwolf";
import { OverwolfStreamingService } from "../overwolf/overwolf-streaming.service";
import { VideoRecordingSettings } from "./video-recording-settings";

export enum VideoRecordingStatus {
    WAITING = "waiting",
    IN_PROGRESS = "in_progress",
    SUCCESS = "success",
    FAIL = "fail",
}

export interface VideoRecordingStateChangedEvent {
    status: VideoRecordingStatus;
    startDate?: Date;
    endDate?: Date;
}

@Injectable({
    providedIn: "root",
    deps: [OverwolfStreamingService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("VideoRecordingService", VideoRecordingService, deps),
})
export class VideoRecordingService extends BaseService {
    /** Emits changed state only when video recording has started */
    public readonly startedEvent$ = new Subject<VideoRecordingStateChangedEvent>();
    /** Emits changed state only when video recording has ended */
    public readonly endedEvent$ = new Subject<VideoRecordingStateChangedEvent>();
    /** Emits changed states; when video recording starts or ends, or upon subscription */
    public readonly state$ = new BehaviorSubject<VideoRecordingStateChangedEvent>({ status: VideoRecordingStatus.WAITING });

    private settings = new VideoRecordingSettings();
    private streamId?: number;

    constructor(private readonly overwolfStreaming: OverwolfStreamingService) {
        super();

        this.setupEvents();
    }

    public setVideoRecordingSettings(settings: VideoRecordingSettings): void {
        this.settings = settings;
    }

    public startVideoRecording(): Observable<OWStreamEvent> {
        const owVideoSettings = this.settings.toOverwolfStreamSettings();
        return this.overwolfStreaming.start(owVideoSettings).pipe(tap((streamEvent) => (this.streamId = streamEvent.stream_id)));
    }

    public stopVideoRecording(): Observable<OWStreamEvent | OWStopStreamingEvent> {
        if (isEmpty(this.streamId)) return of();
        return this.overwolfStreaming.stop(this.streamId!);
    }

    private setupEvents(): void {
        this.overwolfStreaming.onStartStreaming$.pipe(takeUntil(this.destroy$)).subscribe();
        this.overwolfStreaming.onStreamingError$.pipe(takeUntil(this.destroy$)).subscribe();
        this.overwolfStreaming.onStartStreaming$.pipe(takeUntil(this.destroy$)).subscribe();
    }
}
