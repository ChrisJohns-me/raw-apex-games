import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "@shared/shared.module";
import { DateFnsModule } from "ngx-date-fns";
import { GameEventsStatusIndicatorComponent } from "./components/game-events-status-indicator/game-events-status-indicator.component";
import { MatchListingComponent } from "./components/match-listing/match-listing.component";
import { BootstrapCSSInjectorComponent } from "./components/ui-container/bootstrap-css-injector/bootstrap-css-injector.component";
import { UIContainerComponent } from "./components/ui-container/ui-container.component";
import { FullHeightDirective } from "./directives/full-height.directive";

const DIRECTIVES = [FullHeightDirective];
// const PIPES = [];
const COMPONENTS = [BootstrapCSSInjectorComponent, MatchListingComponent, GameEventsStatusIndicatorComponent, UIContainerComponent];
// const THIRDPARTYMODULES = [];

@NgModule({
    declarations: [...COMPONENTS, ...DIRECTIVES],
    imports: [BrowserAnimationsModule, CommonModule, DateFnsModule, SharedModule],
    exports: [...COMPONENTS, ...DIRECTIVES, CommonModule],
})
export class AllfatherSharedModule {}
