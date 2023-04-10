import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { AcademyVideoCategory, AcademyVideoCategoryList } from "@raw-apex-games-app/app/common/academy-videos/academy-videos";
import { GoogleAnalyticsService } from "@raw-apex-games-app/app/modules/core/google-analytics.service";
import { Modal } from "bootstrap";
import { isEmpty } from "common/utilities";
import { Subject } from "rxjs";

@Component({
    selector: "app-academy-page",
    templateUrl: "./academy-page.component.html",
    styleUrls: ["./academy-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcademyPageComponent implements OnDestroy {
    @ViewChild("academyVideoModal") private academyVideoModal?: ElementRef;
    public academyVideoCategories: AcademyVideoCategory[] = AcademyVideoCategoryList;
    public youTubeVideoUrl = "";

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly googleAnalytics: GoogleAnalyticsService) {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onYouTubeVideoClick(videoId: string): void {
        this.googleAnalytics.sendEvent("Academy", "Video Click", videoId);
        if (isEmpty(videoId)) return;
        this.youTubeVideoUrl = composeEmbededYouTubeVideoUrl(videoId);
        this.academyVideoModal?.nativeElement.addEventListener("hidden.bs.modal", () => {
            this.youTubeVideoUrl = "";
            this.refreshUI();
        });
        const academyVideoModal = new Modal(this.academyVideoModal?.nativeElement);
        academyVideoModal.handleUpdate();
        academyVideoModal.show();
        this.refreshUI();
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}

function composeEmbededYouTubeVideoUrl(videoId: string): string {
    const params = new URLSearchParams({ autoplay: "1" });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
