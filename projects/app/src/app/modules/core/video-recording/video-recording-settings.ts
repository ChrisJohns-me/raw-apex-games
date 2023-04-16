import { OWStreamSettings } from "../overwolf";

interface VideoRecordingSettingsConstructor {
    autoCalcKBPS?: boolean;
    fps?: number;
    width?: number;
    height?: number;
    bufferLength?: number;
    folderName?: string;
}

export class VideoRecordingSettings {
    public autoCalcKBPS: boolean;
    public fps: number;
    public width: number;
    public height: number;
    /** Max 40,000 ms */
    public bufferLength: number;
    public folderName: string;

    constructor(ctor?: VideoRecordingSettingsConstructor) {
        this.autoCalcKBPS = ctor?.autoCalcKBPS ?? true;
        this.fps = ctor?.fps ?? 30;
        this.width = ctor?.width ?? 1280;
        this.height = ctor?.height ?? 720;
        this.bufferLength = ctor?.bufferLength ?? 30000;
        this.folderName = ctor?.folderName ?? "tmp";
    }

    public toOverwolfStreamSettings(): OWStreamSettings {
        const streamVideoOptions: overwolf.streaming.StreamVideoOptions = {
            auto_calc_kbps: this.autoCalcKBPS,
            fps: this.fps,
            width: this.width,
            height: this.height,
            buffer_length: this.bufferLength,
            test_drop_frames_interval: 5000,
            notify_dropped_frames_ratio: 0.5,
            max_file_size_bytes: 25000000000,
            include_full_size_video: true,
            sub_folder_name: this.folderName,
            game_window_capture: {
                enable_when_available: false,
                capture_overwolf_windows: true,
            },
            keep_game_capture_on_lost_focus: true,
            // encoder: StreamingVideoEncoderSettings; // TODO: use
            // override_overwolf_setting?: boolean; // TODO maybe use
        };
        const streamAudioOptions: overwolf.streaming.StreamAudioOptions = {
            mic: {
                enable: true,
                volume: 75,
            },
            game: {
                enable: true,
                volume: 75,
                filtered_capture: {
                    enable: false,
                    additional_process_names: [],
                },
            },
        };

        return {
            provider: overwolf.streaming.enums.StreamingProvider.VideoRecorder,
            settings: {
                replay_type: overwolf.media.replays.enums.ReplayType.Video,
                video: streamVideoOptions,
                audio: streamAudioOptions,
                peripherals: {
                    capture_mouse_cursor: overwolf.streaming.enums.StreamMouseCursor.both,
                },
            },
        };
    }
}
