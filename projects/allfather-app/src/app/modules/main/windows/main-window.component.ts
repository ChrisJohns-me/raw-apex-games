import { APP_NAME } from "@allfather-app/app/common/app";
import { fadeInOutAnimation } from "@allfather-app/app/shared/animations/fade-in-out.animation";
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
import { Modal } from "bootstrap";
import { interval, Subject } from "rxjs";
import { delayWhen, filter, takeUntil } from "rxjs/operators";
import { exhaustiveEnumSwitch } from "shared/utilities/switch";
import { BackgroundService } from "../../background/background.service";
import { ConfigLoadStatus, ConfigurationService } from "../../core/configuration.service";
import { MainPage } from "../pages/main-page";
import { MainWindowService } from "./main-window.service";

const STARTING_LOAD_DELAY = 2000;
const CAPTION_DISPLAY_CHANCE = 0.1;

@Component({
    selector: "app-main-window",
    templateUrl: "./main-window.component.html",
    styleUrls: ["./main-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInOutAnimation],
})
export class MainWindowComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("confirmExitModal") private confirmExitModal?: ElementRef;
    public MainPage = MainPage;
    public APP_NAME = APP_NAME;
    public activePage: MainPage = MainPage.Dashboard;
    public isLoading = false;
    public isAppStarting = false;
    public randomCaption = this.captionGenerator();

    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly cdr: ChangeDetectorRef,
        private readonly config: ConfigurationService,
        private readonly mainWindow: MainWindowService
    ) {}

    public ngOnInit(): void {
        this.mainWindow.isStarting$.pipe(takeUntil(this.isDestroyed$)).subscribe((isStarting) => {
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
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public goToPage(page: MainPage): void {
        this.mainWindow.goToPage(page);
    }

    public onExitAppClick(): void {
        this.backgroundService.exitApp();
    }

    private setupLoading(): void {
        this.config.loadStatus$
            .pipe(
                takeUntil(this.isDestroyed$),
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

    private setupPageRouting(): void {
        this.mainWindow.mainPage.pipe(takeUntil(this.isDestroyed$)).subscribe((page) => {
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
                takeUntil(this.isDestroyed$),
                filter((isRequestingExit) => !!isRequestingExit)
            )
            .subscribe(() => {
                console.trace(`[MainWindow] Seen an Exit Request; showing Modal`);
                if (!confirmModal) confirmModal = getConfirmModal();
                if (confirmModal) confirmModal.show();
                else this.backgroundService.exitApp();
            });
    }

    private captionGenerator(): string {
        const shouldShowNum = Math.random();
        const captionPickNum = Math.random();

        const captions = [
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
