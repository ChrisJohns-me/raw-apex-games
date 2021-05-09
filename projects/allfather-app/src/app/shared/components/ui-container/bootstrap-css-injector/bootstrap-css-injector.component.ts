import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

/**
 * @classdesc Injects BootstrapCSS into the root DOM
 * @summary Used avoid unnecessarily load unused CSS (for styling desktop UI).
 *          Once the component is loaded, the CSS remains in the DOM, even if the component is destroyed.
 */
@Component({
    selector: "app-bootstrap-css-injector",
    template: ``,
    styleUrls: ["./bootstrap.scss"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BootstrapCSSInjectorComponent {
    constructor() {
        console.debug(`[${this.constructor.name}] Injecting Bootstrap JS/CSS...`);
    }
}
