import { FeatureState } from "@allfather-app/app/common/feature-status";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-game-events-status-indicator",
    styleUrls: ["./game-events-status-indicator.component.scss"],
    templateUrl: "./game-events-status-indicator.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameEventsStatusIndicatorComponent {
    @Input() public allFeatureStates?: FeatureState;

    //#region Passthrough Variables
    public FeatureState = FeatureState;
    //#endregion
}
