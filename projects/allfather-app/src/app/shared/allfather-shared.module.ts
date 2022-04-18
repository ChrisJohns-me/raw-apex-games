import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "@shared/shared.module";
import { DateFnsModule } from "ngx-date-fns";
import { GameEventsStatusIndicatorComponent } from "./components/game-events-status-indicator/game-events-status-indicator.component";
import { GameModesDropdownFilterComponent } from "./components/game-modes-dropdown-filter/game-modes-dropdown-filter.component";
import { LegendsDropdownFilterComponent } from "./components/legends-dropdown-filter/legends-dropdown-filter.component";
import { MapsDropdownFilterComponent } from "./components/maps-dropdown-filter/maps-dropdown-filter.component";
import { MatchListingComponent } from "./components/match-listing/match-listing.component";
import { BootstrapCSSInjectorComponent } from "./components/ui-container/bootstrap-css-injector/bootstrap-css-injector.component";
import { UIContainerComponent } from "./components/ui-container/ui-container.component";
import { FullHeightDirective } from "./directives/full-height.directive";
import { HrefDirective } from "./directives/href.directive";

const DIRECTIVES = [FullHeightDirective, HrefDirective];
// const PIPES = [];
const COMPONENTS = [
    BootstrapCSSInjectorComponent,
    GameEventsStatusIndicatorComponent,
    GameModesDropdownFilterComponent,
    LegendsDropdownFilterComponent,
    MapsDropdownFilterComponent,
    MatchListingComponent,
    UIContainerComponent,
];
// const THIRDPARTYMODULES = [];

@NgModule({
    declarations: [...COMPONENTS, ...DIRECTIVES],
    imports: [BrowserAnimationsModule, CommonModule, DateFnsModule, ReactiveFormsModule, SharedModule],
    exports: [...COMPONENTS, ...DIRECTIVES, CommonModule],
})
export class AllfatherSharedModule {}
