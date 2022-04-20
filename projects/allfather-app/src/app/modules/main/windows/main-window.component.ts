import { APP_NAME } from "@allfather-app/app/common/app";
import { FeatureState } from "@allfather-app/app/common/feature-status";
import { aXNWSVA } from "@allfather-app/app/common/vip";
import { GoogleAnalyticsService } from "@allfather-app/app/modules/core/google-analytics.service";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { mdiDiscord, mdiYoutube } from "@mdi/js";
import { fadeInOutAnimation } from "@shared/animations/fade-in-out.animation";
import { scaleInOutAnimationFactory } from "@shared/animations/scale-in-out-factory.animation";
import { Modal } from "bootstrap";
import { isEmpty, parseBoolean, wordsToUpperCase } from "common/utilities/";
import { exhaustiveEnumSwitch } from "common/utilities/switch";
import { combineLatest, interval, of, Subject } from "rxjs";
import { delay, delayWhen, filter, map, take, takeUntil } from "rxjs/operators";
import { Hotkey, HotkeyEnum } from "../../../common/hotkey";
import { BackgroundService } from "../../background/background.service";
import { HotkeyService } from "../../background/hotkey.service";
import { ConfigLoadStatus, ConfigurationService } from "../../core/configuration.service";
import { LocalStorageKeys } from "../../core/local-storage/local-storage-keys";
import { LocalStorageService } from "../../core/local-storage/local-storage.service";
import { OverwolfFeatureStatusService } from "../../core/overwolf/overwolf-feature-status.service";
import { OverwolfProfileService } from "../../core/overwolf/overwolf-profile.service";
import { VersionService } from "../../core/version.service";
import { MainPage } from "../pages/main-page";
import { MainWindowService } from "./main-window.service";

const STARTING_LOAD_DELAY = 2000;
const CAPTION_DISPLAY_CHANCE = 0.1;

@Component({
    selector: "app-main-window",
    templateUrl: "./main-window.component.html",
    styleUrls: ["./main-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInOutAnimation, scaleInOutAnimationFactory(0, 0.925)],
})
export class MainWindowComponent implements OnInit, AfterViewInit, OnDestroy {
    /** isVIP text */
    public aXNWSVA = "";
    @ViewChild("confirmExitModal") private confirmExitModal?: ElementRef;
    public get activePage(): MainPage {
        return this._activePage;
    }
    public set activePage(value: MainPage) {
        this.trackPageChange(value);
        this._activePage = value;
    }
    public isLoading = false;
    public hasSeenFirstRun = true;
    public isAppStarting = false;
    public appVersion?: string;
    public toggleMainHotkey?: Hotkey;
    public randomCaption = this.captionGenerator();
    public allFeatureStates?: FeatureState;

    //#region Passthrough Variables
    public MainPage = MainPage;
    public APP_NAME = APP_NAME;
    public mdiDiscord = mdiDiscord;
    public mdiYoutube = mdiYoutube;
    //#endregion

    private _activePage: MainPage = MainPage.Dashboard;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly cdr: ChangeDetectorRef,
        private readonly config: ConfigurationService,
        private readonly googleAnalytics: GoogleAnalyticsService,
        private readonly hotkey: HotkeyService,
        private readonly localStorage: LocalStorageService,
        private readonly mainWindow: MainWindowService,
        private readonly overwolfFeatureStatus: OverwolfFeatureStatusService,
        private readonly overwolfProfile: OverwolfProfileService,
        private readonly version: VersionService
    ) {
        const hasSeenFirstRunValue = this.localStorage.get(LocalStorageKeys.HasSeenFirstRun);
        this.hasSeenFirstRun = parseBoolean(hasSeenFirstRunValue);
    }

    public ngOnInit(): void {
        this.setupAppVersion();
        this.setupOverwolfGameEventStatus();
        this.setupHotkeys();
        this.setupFirstRunRouting();
        // Setup VIP
        this.overwolfProfile
            .getCurrentUser()
            .pipe(
                takeUntil(this.destroy$),
                filter((userData) => !isEmpty(userData?.username)),
                map((userData) => userData.username),
                take(1)
            )
            .subscribe((un) => (this.aXNWSVA = aXNWSVA(un!) ? window.atob("VklQ") : ""));

        this.mainWindow.isStarting$.pipe(takeUntil(this.destroy$)).subscribe((isStarting) => {
            this.isAppStarting = isStarting;
            this.cdr.detectChanges();
        });
    }

    public ngAfterViewInit(): void {
        this.setupLoading();
        this.setupPageRouting();
        this.setupRequestingExit();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onFinishFirstRunClick(): void {
        this.hasSeenFirstRun = true;
        this.localStorage.set(LocalStorageKeys.HasSeenFirstRun, `${this.hasSeenFirstRun}`);
        this.goToPage(MainPage.Dashboard);
    }

    public goToPage(page: MainPage): void {
        this.mainWindow.goToPage(page);
    }

    public onExitAppClick(): void {
        this.backgroundService.exitApp();
    }

    public onCloseButtonClick(): void {
        this.mainWindow.isRequestingExit$.next(true);
    }

    private trackPageChange(newPage: MainPage): void {
        this.mainWindow.overwolfWindow
            .windowInfo()
            .pipe(
                takeUntil(this.destroy$),
                map((winInfo) => winInfo.name),
                filter((windowName) => !isEmpty(windowName)),
                take(1)
            )
            .subscribe((windowName) => {
                this.googleAnalytics.sendPageview(`Main - ${wordsToUpperCase(newPage)}`, `/${windowName}/${newPage}`);
            });
    }

    private setupLoading(): void {
        this.config.loadStatus$
            .pipe(
                takeUntil(this.destroy$),
                delayWhen(() => interval(this.mainWindow.isStarting$ ? STARTING_LOAD_DELAY : 0))
            )
            .subscribe((configLoadStatus) => {
                switch (configLoadStatus) {
                    case ConfigLoadStatus.Failed:
                        break;
                    case ConfigLoadStatus.NotStarted:
                    case ConfigLoadStatus.Loading:
                        this.isLoading = true;
                        break;
                    case ConfigLoadStatus.Loaded:
                    case ConfigLoadStatus.LoadedFallback:
                        this.isLoading = false;
                        break;
                    default:
                        exhaustiveEnumSwitch(configLoadStatus);
                }
                this.mainWindow.setIsStarting(false);
                this.cdr.detectChanges();
            });
    }

    private setupFirstRunRouting(): void {
        of(MainPage.FirstRun)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => !this.hasSeenFirstRun),
                delay(STARTING_LOAD_DELAY)
            )
            .subscribe((page) => this.goToPage(page));
    }

    private setupPageRouting(): void {
        this.mainWindow.mainPage.pipe(takeUntil(this.destroy$)).subscribe((page) => {
            this.activePage = page;
            this.cdr.detectChanges();
        });
    }

    private setupRequestingExit(): void {
        const getConfirmModal = () => new Modal(this.confirmExitModal?.nativeElement);
        this.confirmExitModal?.nativeElement.addEventListener("hidden.bs.modal", () => this.mainWindow.cancelExit());
        let confirmModal = getConfirmModal();
        this.mainWindow.isRequestingExit$
            .pipe(
                takeUntil(this.destroy$),
                filter((isRequestingExit) => !!isRequestingExit)
            )
            .subscribe(() => {
                console.trace(`[MainWindow] Seen an Exit Request; showing Modal`);
                if (!confirmModal) confirmModal = getConfirmModal();
                if (confirmModal) confirmModal.show();
                else this.backgroundService.exitApp();
            });
    }

    private setupHotkeys(): void {
        this.hotkey
            .getGameHotkeyByName(HotkeyEnum.ToggleMain)
            .pipe(takeUntil(this.destroy$))
            .subscribe((toggleMainHotkey) => {
                this.toggleMainHotkey = toggleMainHotkey;
                this.cdr.detectChanges();
            });

        this.hotkey.onHotkeyChanged$
            .pipe(
                filter((hotkey) => hotkey.hotkeyName === HotkeyEnum.ToggleMain),
                takeUntil(this.destroy$)
            )
            .subscribe((toggleMainHotkey) => {
                this.toggleMainHotkey = toggleMainHotkey;
                this.cdr.detectChanges();
            });
    }

    private setupAppVersion(): void {
        combineLatest([this.version.packageVersion$, this.version.overwolfExtensionVersion$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([packageVersion, overwolfExtVersion]) => {
                this.appVersion = `v${packageVersion}`;
                if (packageVersion !== overwolfExtVersion)
                    this.appVersion = `${this.appVersion} (Overwolf Extension ${overwolfExtVersion})`;
                this.cdr.detectChanges();
            });
    }

    private setupOverwolfGameEventStatus(): void {
        this.overwolfFeatureStatus.featureStates$
            .pipe(
                map(() => this.overwolfFeatureStatus.checkAllFeatureStates()),
                takeUntil(this.destroy$)
            )
            .subscribe((allFeatureStates) => {
                this.allFeatureStates = allFeatureStates;
                this.cdr.detectChanges();
            });
    }

    private captionGenerator(): string {
        const shouldShowNum = Math.random();
        const captionPickNum = Math.random();

        const captions = [
            "The Allfather guides you now",
            "Allfather give me sight",
            "The gustr of wind calls our victory",
            "Fate will be on our side, félagi fighter",
            "Today will be our day, fight ríkr",
            "The Allfather will gift us today",
            "Allfather bless me with sight",
            "I will shed bloð and honor the Allfather",
            "Trust in the Allfather",
            "Prove your strength before the gods",
            "The hunt begins",
            "The true test is before the Allfather",
            "The Allfather graces your victory",
        ];
        const captionIndex = Math.floor(captions.length * captionPickNum);
        const caption = shouldShowNum <= CAPTION_DISPLAY_CHANCE ? captions[captionIndex] : "";
        if (caption) console.error(caption);
        return caption;
    }
}
