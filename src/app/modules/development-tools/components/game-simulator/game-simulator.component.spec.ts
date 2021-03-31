import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OWGameEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "@core/overwolf-data-provider";
import { OverwolfExposedDataService } from "@core/overwolf-exposed-data.service";
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
            providers: [{ provide: OverwolfExposedDataService, useClass: MockOverwolfExposedDataService }],
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
