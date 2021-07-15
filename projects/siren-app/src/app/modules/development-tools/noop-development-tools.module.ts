import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";

/**
 * The purpose of this module is to replace the
 *   real DevelopmentToolsModule in production.
 */

@Component({
    selector: "app-development-tools-window",
    template: `<p class="noop">Hey, hmm. Impressive, you're good... Contact us, maybe join our team ;)</p>`,
    styles: [
        `
            .noop {
                height: 100%;
                margin: none;
                background-color: white;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class NoopDevelopmentToolsWindowComponent {}

@NgModule({
    declarations: [NoopDevelopmentToolsWindowComponent],
    imports: [SharedAppModule, SirenSharedModule],
    exports: [NoopDevelopmentToolsWindowComponent],
})
export class NoopDevelopmentToolsModule {}
