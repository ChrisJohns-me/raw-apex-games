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
import { Subject } from "rxjs";
import { delay, filter, takeUntil } from "rxjs/operators";
import { exhaustiveEnumSwitch } from "shared/utilities/switch";
import { BackgroundService } from "../../background/background.service";
import { ConfigLoadStatus, ConfigurationService } from "../../core/configuration.service";
import { MainPage } from "../pages/main-page";
import { MainWindowService } from "./main-window.service";

const LOADING_DELAY = 2000;

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
    public isLoading = true;

    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly cdr: ChangeDetectorRef,
        private readonly config: ConfigurationService,
        private readonly mainWindow: MainWindowService
    ) {}

    public ngOnInit(): void {}

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
        this.config.loadStatus$.pipe(takeUntil(this.isDestroyed$), delay(LOADING_DELAY)).subscribe((configLoadStatus) => {
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
        this.confirmExitModal?.nativeElement.addEventListener("hidden.bs.modal", () => this.backgroundService.cancelExit());
        let confirmModal = getConfirmModal();
        this.backgroundService.isRequestingExit$
            .pipe(
                takeUntil(this.isDestroyed$),
                filter((isRequestingExit) => !!isRequestingExit)
            )
            .subscribe(() => {
                if (!confirmModal) confirmModal = getConfirmModal();
                if (confirmModal) confirmModal.show();
                else this.backgroundService.exitApp();
            });
    }
}
