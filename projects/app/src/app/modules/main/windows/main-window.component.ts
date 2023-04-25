import { APP_NAME } from "#app/models/app.js";
import { FeatureState } from "#app/models/feature-status.js";
import { Hotkey, HotkeyEnum } from "#app/models/hotkey.js";
import { OverwolfWindowName } from "#app/models/overwolf-window.js";
import { FairplayControllerService } from "#app/modules/background/fairplay-controller.service.js";
import { GoogleAnalyticsService } from "#app/modules/core/google-analytics.service.js";
import { fadeInOutAnimation } from "#shared/angular/animations/fade-in-out.animation.js";
import { scaleInOutAnimationFactory } from "#shared/angular/animations/scale-in-out-factory.animation.js";
import { isEmpty, parseBoolean } from "#shared/utilities/primitives/boolean.js";
import { wordsToUpperCase } from "#shared/utilities/primitives/string.js";
import { exhaustiveEnumSwitch } from "#shared/utilities/switch.js";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { mdiDiscord, mdiYoutube } from "@mdi/js";
import { Modal } from "bootstrap";
import { combineLatest, interval, merge, of, Subject } from "rxjs";
import { delay, delayWhen, filter, map, take, takeUntil } from "rxjs/operators";
import { BackgroundService } from "../../background/background.service.js";
import { HotkeyService } from "../../background/hotkey.service.js";
import { ConfigLoadStatus, ConfigurationService } from "../../core/configuration.service.js";
import { LocalStorageKeys } from "../../core/local-storage/local-storage-keys.js";
import { LocalStorageService } from "../../core/local-storage/local-storage.service.js";
import { OverwolfFeatureStatusService } from "../../core/overwolf/overwolf-feature-status.service.js";
import { VersionService } from "../../core/version.service.js";
import { MainPage } from "../pages/main-page.js";
import { MainDesktopWindowService } from "./main-desktop-window.service.js";
import { MainInGameWindowService } from "./main-ingame-window.service.js";

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
    @Input() public overwolfWindowName?: OverwolfWindowName;
    @ViewChild("confirmExitModal") private confirmExitModal?: ElementRef;
    @ViewChild("controllerWarningModal") private controllerWarningModal?: ElementRef;

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

    private _activePage: MainPage = MainPage.RawApexGames;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly cdr: ChangeDetectorRef,
        private readonly config: ConfigurationService,
        private readonly fairplayControllerService: FairplayControllerService,
        private readonly googleAnalytics: GoogleAnalyticsService,
        private readonly hotkey: HotkeyService,
        private readonly localStorage: LocalStorageService,
        private readonly mainDesktopWindow: MainDesktopWindowService,
        private readonly mainInGameWindow: MainInGameWindowService,
        private readonly overwolfFeatureStatus: OverwolfFeatureStatusService,
        private readonly version: VersionService
    ) {
        const hasSeenFirstRunValue = this.localStorage.get(LocalStorageKeys.HasSeenFirstRun);
        this.hasSeenFirstRun = parseBoolean(hasSeenFirstRunValue);
    }

    public ngOnInit(): void {
        this.setupAppVersion();
        this.setupOverwolfGameEventStatus();
        this.setupHotkeys();
        this.setupNonMouseWarning();
        this.setupFirstRunRouting();

        merge(this.mainDesktopWindow.isStarting$, this.mainInGameWindow.isStarting$)
            .pipe(takeUntil(this.destroy$))
            .subscribe((isStarting) => {
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
        this.goToPage(MainPage.RawApexGames);
    }

    public goToPage(page: MainPage): void {
        this.mainDesktopWindow.goToPage(page);
        this.mainInGameWindow.goToPage(page);
    }

    public onExitAppClick(): void {
        this.backgroundService.exitApp();
    }

    public onCloseButtonClick(): void {
        this.mainDesktopWindow.isRequestingExit$.next(true);
        this.mainInGameWindow.isRequestingExit$.next(true);
    }

    private trackPageChange(newPage: MainPage): void {
        merge(this.mainDesktopWindow.overwolfWindow.windowInfo(), this.mainInGameWindow.overwolfWindow.windowInfo())
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
                delayWhen(() => interval(this.mainDesktopWindow.isStarting$ || this.mainInGameWindow.isStarting$ ? STARTING_LOAD_DELAY : 0))
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
                this.mainDesktopWindow.setIsStarting(false);
                this.mainInGameWindow.setIsStarting(false);
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
        merge(this.mainDesktopWindow.mainPage, this.mainInGameWindow.mainPage)
            .pipe(takeUntil(this.destroy$))
            .subscribe((page) => {
                this.activePage = page;
                this.cdr.detectChanges();
            });
    }

    private setupRequestingExit(): void {
        const getConfirmModal = () => new Modal(this.confirmExitModal?.nativeElement);
        this.confirmExitModal?.nativeElement.addEventListener("hidden.bs.modal", () => {
            this.mainDesktopWindow.cancelExit();
            this.mainInGameWindow.cancelExit();
        });
        let confirmModal = getConfirmModal();
        merge(this.mainDesktopWindow.isRequestingExit$, this.mainInGameWindow.isRequestingExit$)
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

    private setupNonMouseWarning(): void {
        const getWarningModal = () => new Modal(this.controllerWarningModal?.nativeElement);
        this.controllerWarningModal?.nativeElement.addEventListener("hidden.bs.modal", () => {
            // Modal was closed
        });

        this.fairplayControllerService.isNonMouseInputWarning$
            .pipe(
                takeUntil(this.destroy$),
                filter((isNonMouseInputWarning) => !!isNonMouseInputWarning)
            )
            .subscribe(() => {
                let warningModal = getWarningModal();
                if (!warningModal) warningModal = getWarningModal();
                if (warningModal) warningModal.show();
            });
    }

    private setupHotkeys(): void {
        this.hotkey
            .getGameHotkeyByName(HotkeyEnum.ToggleMainInGame)
            .pipe(takeUntil(this.destroy$))
            .subscribe((toggleMainHotkey) => {
                this.toggleMainHotkey = toggleMainHotkey;
                this.cdr.detectChanges();
            });

        this.hotkey.onHotkeyChanged$
            .pipe(
                filter((hotkey) => hotkey.hotkeyName === HotkeyEnum.ToggleMainInGame),
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
