// describe("Win Game Scenario", () => {
//     let sut: MatchTimerWindowComponent;
//     let fixture: ComponentFixture<MatchTimerWindowComponent>;
//     let scheduler: TestScheduler;
//     let matchService: MatchService;

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             declarations: [MatchTimerWindowComponent, MockUIContainerComponent],
//             providers: [
//                 { provide: ChangeDetectorRef, useValue: {} },
//                 { provide: MatchService, useClass: MockMatchService },
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         scheduler = new TestScheduler((actual, expected) => {
//             expect(actual).toEqual(expected);
//         });
//         scheduler.maxFrames = 5000;
//         fixture = TestBed.createComponent(MatchTimerWindowComponent);
//         sut = fixture.componentInstance;
//         matchService = TestBed.inject(MatchService);
//         fixture.detectChanges(); // ngOnInit
//     });
// });
