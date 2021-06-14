import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { hexToCSSFilter } from "shared/utilities/color";
import { AimingReticle } from "./aiming-reticles";

@Component({
    selector: "app-aiming-reticle",
    templateUrl: "./aiming-reticle.component.html",
    styleUrls: ["./aiming-reticle.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AimingReticleComponent {
    @Input() public set aimingReticle(value: AimingReticle) {
        this.cssColorFilter = hexToCSSFilter(value.hexColor);
        this.filename = value.filename;
        this.alpha = value.alpha;
        this.width = `${value.sizePercent * 100}%`;
        this.height = `${value.sizePercent * 100}%`;
    }

    public filename?: string;
    public cssColorFilter?: string;
    public alpha?: number;
    public width?: string;
    public height?: string;
}
