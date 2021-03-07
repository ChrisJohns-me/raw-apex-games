import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PlayerDamageBoxComponent } from "./player-damage-box.component";

describe("PlayerDamageBoxComponent", () => {
    let component: PlayerDamageBoxComponent;
    let fixture: ComponentFixture<PlayerDamageBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerDamageBoxComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerDamageBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
