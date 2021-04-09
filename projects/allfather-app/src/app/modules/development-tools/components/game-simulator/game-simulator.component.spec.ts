import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MockMatchRosterService } from "@allfather-app/app/modules/core/mocks/services/mock-match-roster.service";
import { MockPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-player.service";
import { OWGameEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "@allfather-app/app/modules/core/overwolf-data-provider";
import { OverwolfExposedDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, Subject } from "rxjs";
import { GameSimulatorComponent } from "./game-simulator.component";

class MockOverwolfExposedDataService {
    public rawGameInfo$ = new BehaviorSubject<Optional<OWRunningGameInfo>>(undefined);
    public rawInfoUpdates$ = new Subject<OWInfoUpdates2Event>();
    public rawNewGameEvent$ = new Subject<OWGameEvent>();

    public injectOnGameInfo(gameInfo: OWRunningGameInfo): void {
        // ...
    }
    public injectOnInfoUpdates2(infoUpdate: overwolf.games.events.InfoUpdates2Event): void {
        // ...
    }
    public injectOnNewGameEvents(newGameEvent: overwolf.games.events.GameEvent): void {
        // ...
    }
}

describe("GameSimulatorComponent", () => {
    let component: GameSimulatorComponent;
    let fixture: ComponentFixture<GameSimulatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameSimulatorComponent],
            providers: [
                { provide: ChangeDetectorRef, useClass: MockOverwolfExposedDataService },
                { provide: OverwolfExposedDataService, useClass: MockOverwolfExposedDataService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameSimulatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
