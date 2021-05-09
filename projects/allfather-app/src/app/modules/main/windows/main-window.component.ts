import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Modal } from "bootstrap";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { BackgroundService } from "../../background/background.service";

@Component({
    selector: "app-main-window",
    templateUrl: "./main-window.component.html",
    styleUrls: ["./main-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainWindowComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("confirmExitModal") private confirmExitModal?: ElementRef;

    private isDestroyed$ = new Subject<void>();

    constructor(private readonly backgroundService: BackgroundService) {}

    public ngOnInit(): void {}

    public ngAfterViewInit(): void {
        this.setupRequestingExit();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public onExitAppClick(): void {
        this.backgroundService.exitApp();
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
