import { SharedModule } from "#shared/angular/shared.module.js";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GameEventsStatusIndicatorComponent } from "./components/game-events-status-indicator/game-events-status-indicator.component.js";
import { GameModesDropdownFilterComponent } from "./components/game-modes-dropdown-filter/game-modes-dropdown-filter.component.js";
import { LegendsDropdownFilterComponent } from "./components/legends-dropdown-filter/legends-dropdown-filter.component.js";
import { MapHeatmapComponent } from "./components/map-heatmap/map-heatmap.component.js";
import { MapsDropdownFilterComponent } from "./components/maps-dropdown-filter/maps-dropdown-filter.component.js";
import { MatchListingComponent } from "./components/match-listing/match-listing.component.js";
import { BootstrapCSSInjectorComponent } from "./components/ui-container/bootstrap-css-injector/bootstrap-css-injector.component.js";
import { UIContainerComponent } from "./components/ui-container/ui-container.component.js";
import { WelcomeContentComponent } from "./components/welcome-content/welcome-content.component.js";
import { FullHeightDirective } from "./directives/full-height.directive.js";
import { HrefDirective } from "./directives/href.directive.js";

const DIRECTIVES = [FullHeightDirective, HrefDirective];
// const PIPES = [];
const COMPONENTS = [
    BootstrapCSSInjectorComponent,
    GameEventsStatusIndicatorComponent,
    GameModesDropdownFilterComponent,
    LegendsDropdownFilterComponent,
    MapHeatmapComponent,
    MapsDropdownFilterComponent,
    MatchListingComponent,
    UIContainerComponent,
    WelcomeContentComponent,
];
// const THIRDPARTYMODULES = [];

@NgModule({
    declarations: [...COMPONENTS, ...DIRECTIVES],
    imports: [BrowserAnimationsModule, CommonModule, ReactiveFormsModule, SharedModule],
    exports: [...COMPONENTS, ...DIRECTIVES, CommonModule],
})
export class RawApexGamesSharedModule {}
