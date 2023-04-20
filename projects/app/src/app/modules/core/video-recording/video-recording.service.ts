import { Injectable } from "@angular/core";
import { BaseService } from "@app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { isEmpty } from "@shared/utilities/primitives/boolean.js";
import { BehaviorSubject, Observable, of, Subject, throwError } from "rxjs";
import { takeUntil, tap, timeout } from "rxjs/operators";
import { OWStopStreamingResult, OWStreamResult } from "../overwolf/index.js";
import { OverwolfStreamingService } from "../overwolf/overwolf-streaming.service.js";
import { VideoRecordingSettings } from "./video-recording-settings.js";

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

    /**
     * Starts video recording.
     * @throws {string} error message
     */
    public startVideoRecording(): Observable<OWStreamResult> {
        if (this.streamId) return throwError(() => `Stream already in progress`);
        const owVideoSettings = this.settings.toOverwolfStreamSettings();
        return this.overwolfStreaming.start(owVideoSettings).pipe(
            tap((streamResult) => {
                if (!isEmpty(streamResult.error) || !streamResult.success) {
                    const stateEvent = { status: VideoRecordingStatus.FAIL };
                    this.state$.next(stateEvent);
                    throw new Error(streamResult.error ?? `Unable to start video recording`);
                }

                const stateEvent = {
                    status: VideoRecordingStatus.IN_PROGRESS,
                    startDate: new Date(),
                };
                this.startedEvent$.next(stateEvent);
                this.state$.next(stateEvent);
                this.streamId = streamResult.stream_id;
                console.log(`[${this.constructor.name}] Video recording started: "${this.streamId}"`);
            })
        );
    }

    /**
     * Stops video recording.
     * @throws {string} error message
     */
    public stopVideoRecording(): Observable<OWStopStreamingResult> {
        if (isEmpty(this.streamId)) return of();
        return this.overwolfStreaming.stop(this.streamId!).pipe(
            timeout(15000),
            tap((streamResult) => {
                if (!isEmpty(streamResult.error) || !streamResult.success) {
                    const stateEvent = { status: VideoRecordingStatus.FAIL };
                    this.state$.next(stateEvent);
                    throw new Error(streamResult.error ?? `Unable to stop/save video recording`);
                }

                const stateEvent = {
                    status: VideoRecordingStatus.SUCCESS,
                    startDate: new Date(),
                    endDate: new Date(),
                };
                this.endedEvent$.next(stateEvent);
                this.state$.next(stateEvent);
                console.log(`[${this.constructor.name}] Video recording stopped: "${this.streamId}"`);
                this.streamId = undefined;
            })
        );
    }

    private setupEvents(): void {
        this.overwolfStreaming.onStartStreaming$.pipe(takeUntil(this.destroy$)).subscribe();
        this.overwolfStreaming.onStreamingError$.pipe(takeUntil(this.destroy$)).subscribe();
        this.overwolfStreaming.onStartStreaming$.pipe(takeUntil(this.destroy$)).subscribe();
    }
}
