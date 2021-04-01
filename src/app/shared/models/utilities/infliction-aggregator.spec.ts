import { TestScheduler } from "rxjs/testing";
import { MatchInflictionEvent, MatchInflictionEventAccum } from "../match/match-infliction-event";
import { InflictionAggregator } from "./infliction-aggregator";

describe("InflictionEventAggregator", () => {
    let sut: InflictionAggregator;
    let scheduler: TestScheduler;

    beforeEach(() => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(0));
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    describe("Single Victim", () => {
        it("shows a victim with damage after a damage event", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 10000,
                emitOnExpire: false,
            });

            scheduler.run(({ expectObservable, hot }) => {
                // Act
                const obs$ = hot("a", { a: createInfl("Victim1Damage", "Me", 0, 10, 0, true, false, false) });
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                expectObservable(actual).toBe("a", { a: createInflAccum("Victim1Damage", "Me", 0, 10, 0, true, false, false) });
            });
        });

        it("shows a victim after a knockdown event", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 10000,
                emitOnExpire: false,
            });

            scheduler.run(({ expectObservable, hot }) => {
                // Act
                const obs$ = hot("a", { a: createInfl("Victim1Knockdown", "Me", 0, undefined, undefined, undefined, true, false) });
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                expectObservable(actual).toBe("a", {
                    a: createInflAccum("Victim1Knockdown", "Me", 0, 0, 0, false, true, false),
                });
            });
        });

        it("shows a victim after an elimination event", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 10000,
                emitOnExpire: false,
            });

            scheduler.run(({ expectObservable, hot }) => {
                // Act
                const obs$ = hot("a", { a: createInfl("Victim1Elimination", "Me", 0, undefined, undefined, undefined, false, true) });
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                expectObservable(actual).toBe("a", { a: createInflAccum("Victim1Elimination", "Me", 0, 0, 0, false, false, true) });
            });
        });

        it("shows a victim with correct damage amounts, knockdown, elimination, and one reset event", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 5000,
                emitOnExpire: true,
            });

            scheduler.run(({ expectObservable, hot, cold }) => {
                // Act
                const timeMarble = "  TTTTTT-T-T D      T|";
                const actualMarble = "aaabbb-c-d 4999ms -|";
                const expectMarble = "ABCDEF-G-H 4999ms 0|";
                const frame = scheduler.createTime("-|");
                cold(timeMarble, { T: frame, D: frame * sut.expireAggregateMs }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });
                const actualList: { [key: string]: MatchInflictionEvent } = {
                    a: createInfl("Victim1", "Me", 0, 12, 0, true),
                    b: createInfl("Victim1", "Me", 0, 0, 8, false),
                    c: createInfl("Victim1", "Me", 0, 0, 0, false, true),
                    d: createInfl("Victim1", "Me", 0, 0, 0, false, true, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    0: createInflAccum("Victim1", undefined, undefined, 0, 0, true, false, false), // reset
                    A: createInflAccum("Victim1", "Me", 1, 12, 0, true, false, false),
                    B: createInflAccum("Victim1", "Me", 2, 24, 0, true, false, false),
                    C: createInflAccum("Victim1", "Me", 3, 36, 0, true, false, false),
                    D: createInflAccum("Victim1", "Me", 4, 36, 8, false, false, false),
                    E: createInflAccum("Victim1", "Me", 5, 36, 16, false, false, false),
                    F: createInflAccum("Victim1", "Me", 6, 36, 24, false, false, false),
                    G: createInflAccum("Victim1", "Me", 7, 36, 24, false, true, false),
                    H: createInflAccum("Victim1", "Me", 8, 36, 24, false, true, true),
                };
                expectObservable(actual).toBe(expectMarble, expectedList);
            });
        });

        it("shows a victim with correct damage amounts, knockdown, elimination events; and many resets", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 5000,
                emitOnExpire: true,
            });

            scheduler.run(({ expectObservable, hot, cold }) => {
                // Act
                const timeMarble = "  TTTTTT-T-T 4999ms D----- 5s D----TTTTTTT-T 4999ms D----- 5s D----TTTTTTT-T 4999ms D|";
                const actualMarble = "aaabbb-c-d 4999ms ------ 5s -----aaabbbc-d 4999ms ------ 5s -----aaabbbc-d 4999ms -|";
                const expectMarble = "ABCDEF-G-H 4999ms 0----- 5s -----IJKLMNO-P 4999ms 0----- 5s -----QRSTUVW-X 4999ms 0|";
                const frameDuration = scheduler.createTime("-|");
                cold(timeMarble, { T: frameDuration, D: frameDuration * sut.expireAggregateMs }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });
                const actualList: { [key: string]: MatchInflictionEvent } = {
                    a: createInfl("Victim1", "Me", 0, 12, 0, true),
                    b: createInfl("Victim1", "Me", 0, 0, 8, false),
                    c: createInfl("Victim1", "Me", 0, 0, 0, undefined, true),
                    d: createInfl("Victim1", "Me", 0, 0, 0, undefined, undefined, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    0: createInflAccum("Victim1", undefined, undefined, 0, 0, true, false, false), // reset
                    A: createInflAccum("Victim1", "Me", 1, 12, 0, true, false, false),
                    B: createInflAccum("Victim1", "Me", 2, 24, 0, true, false, false),
                    C: createInflAccum("Victim1", "Me", 3, 36, 0, true, false, false),
                    D: createInflAccum("Victim1", "Me", 4, 36, 8, false, false, false),
                    E: createInflAccum("Victim1", "Me", 5, 36, 16, false, false, false),
                    F: createInflAccum("Victim1", "Me", 6, 36, 24, false, false, false),
                    G: createInflAccum("Victim1", "Me", 7, 36, 24, false, true, false), // knock
                    H: createInflAccum("Victim1", "Me", 8, 36, 24, false, true, true), // elim
                    I: createInflAccum("Victim1", "Me", 10009, 12, 0, true, false, false),
                    J: createInflAccum("Victim1", "Me", 10010, 24, 0, true, false, false),
                    K: createInflAccum("Victim1", "Me", 10011, 36, 0, true, false, false),
                    L: createInflAccum("Victim1", "Me", 10012, 36, 8, false, false, false),
                    M: createInflAccum("Victim1", "Me", 10013, 36, 16, false, false, false),
                    N: createInflAccum("Victim1", "Me", 10014, 36, 24, false, false, false),
                    O: createInflAccum("Victim1", "Me", 10015, 36, 24, false, true, false), // knock
                    P: createInflAccum("Victim1", "Me", 10016, 36, 24, false, true, true), // elim
                    Q: createInflAccum("Victim1", "Me", 20017, 12, 0, true, false, false),
                    R: createInflAccum("Victim1", "Me", 20018, 24, 0, true, false, false),
                    S: createInflAccum("Victim1", "Me", 20019, 36, 0, true, false, false),
                    T: createInflAccum("Victim1", "Me", 20020, 36, 8, false, false, false),
                    U: createInflAccum("Victim1", "Me", 20021, 36, 16, false, false, false),
                    V: createInflAccum("Victim1", "Me", 20022, 36, 24, false, false, false),
                    W: createInflAccum("Victim1", "Me", 20023, 36, 24, false, true, false), // knock
                    X: createInflAccum("Victim1", "Me", 20024, 36, 24, false, true, true), // elim
                };
                expectObservable(actual).toBe(expectMarble, expectedList);
            });
        });
    });

    describe("Many Victims (Simple Events)", () => {
        it("shows victims with damage after many damage events", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 10000,
                emitOnExpire: false,
            });

            scheduler.run(({ expectObservable, hot }) => {
                // Act
                const actualMarble = "abcbcaba|";
                const expectMarble = "ABCDEFGH|";
                const actualList: { [key: string]: MatchInflictionEvent } = {
                    a: createInfl("Victim1", "Me", 0, 6, 0, true, false, false),
                    b: createInfl("Victim2", "Me", 0, 0, 11, false, false, false),
                    c: createInfl("Victim3", "Me", 0, 13, 0, true, false, false),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    A: createInflAccum("Victim1", "Me", 0, 6, 0, true, false, false),
                    B: createInflAccum("Victim2", "Me", 0, 0, 11, false, false, false),
                    C: createInflAccum("Victim3", "Me", 0, 13, 0, true, false, false),
                    D: createInflAccum("Victim2", "Me", 0, 0, 22, false, false, false),
                    E: createInflAccum("Victim3", "Me", 0, 26, 0, true, false, false),
                    F: createInflAccum("Victim1", "Me", 0, 12, 0, true, false, false),
                    G: createInflAccum("Victim2", "Me", 0, 0, 33, false, false, false),
                    H: createInflAccum("Victim1", "Me", 0, 18, 0, true, false, false),
                };
                expectObservable(actual).toBe(expectMarble, expectedList);
            });
        });

        it("shows victims after a mix of knockdown events", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 10000,
                emitOnExpire: false,
            });

            scheduler.run(({ expectObservable, hot }) => {
                // Act
                const actualMarble = "abcabcd|";
                const expectMarble = "ABCDEFG|";
                const actualList: { [key: string]: MatchInflictionEvent } = {
                    a: createInfl("Victim1", "Me", 0, 6, 0, true, false, false),
                    b: createInfl("Victim2", "Me", 0, 0, 11, false, false, false),
                    c: createInfl("Victim3", "Me", 0, 13, 0, true, false, false),
                    d: createInfl("Victim2", "Me", 0, 0, 0, undefined, true, false),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    A: createInflAccum("Victim1", "Me", 0, 6, 0, true, false, false),
                    B: createInflAccum("Victim2", "Me", 0, 0, 11, false, false, false),
                    C: createInflAccum("Victim3", "Me", 0, 13, 0, true, false, false),
                    D: createInflAccum("Victim1", "Me", 0, 12, 0, true, false, false),
                    E: createInflAccum("Victim2", "Me", 0, 0, 22, false, false, false),
                    F: createInflAccum("Victim3", "Me", 0, 26, 0, true, false, false),
                    G: createInflAccum("Victim2", "Me", 0, 0, 22, false, true, false),
                };
                expectObservable(actual).toBe(expectMarble, expectedList);
            });
        });

        it("shows victims after a mix of elimination events", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 10000,
                emitOnExpire: false,
            });

            scheduler.run(({ expectObservable, hot }) => {
                // Act
                const actualMarble = "abcabc-d-e|";
                const expectMarble = "ABCDEF-G-H|";
                const actualList: { [key: string]: MatchInflictionEvent } = {
                    a: createInfl("Victim1", "Me", 0, 6, 0, true, false, false),
                    b: createInfl("Victim2", "Me", 0, 0, 11, false, false, false),
                    c: createInfl("Victim3", "Me", 0, 13, 0, true, false, false),
                    d: createInfl("Victim2", "Me", 0, 0, 0, undefined, true, false),
                    e: createInfl("Victim2", "Me", 0, 0, 0, undefined, true, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    A: createInflAccum("Victim1", "Me", 0, 6, 0, true, false, false),
                    B: createInflAccum("Victim2", "Me", 0, 0, 11, false, false, false),
                    C: createInflAccum("Victim3", "Me", 0, 13, 0, true, false, false),
                    D: createInflAccum("Victim1", "Me", 0, 12, 0, true, false, false),
                    E: createInflAccum("Victim2", "Me", 0, 0, 22, false, false, false),
                    F: createInflAccum("Victim3", "Me", 0, 26, 0, true, false, false),
                    G: createInflAccum("Victim2", "Me", 0, 0, 22, false, true, false),
                    H: createInflAccum("Victim2", "Me", 0, 0, 22, false, true, true),
                };
                expectObservable(actual).toBe(expectMarble, expectedList);
            });
        });

        it("shows victims with correct damage amounts, knockdown, elimination, and one reset event per victim", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 5000,
                emitOnExpire: true,
            });

            scheduler.run(({ expectObservable, hot, cold }) => {
                // Act
                const timeMarble = "  TTTTTTT-T-T D      -T---T---T|";
                const actualMarble = "aaabbbc-d-e 4990ms ----------|";
                const expectMarble = "ABCDEFG-H-I 4990ms -0---2---1|";
                const frame = scheduler.createTime("-|");
                cold(timeMarble, { T: frame, D: frame * sut.expireAggregateMs }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });
                const actualList: { [key: string]: MatchInflictionEvent } = {
                    a: createInfl("Victim1", "Me", 0, 6, 0, true, false, false),
                    b: createInfl("Victim2", "Me", 0, 0, 11, false, false, false),
                    c: createInfl("Victim3", "Me", 0, 13, 0, true, false, false),
                    d: createInfl("Victim2", "Me", 0, 0, 0, undefined, true, false),
                    e: createInfl("Victim2", "Me", 0, 0, 0, undefined, true, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    0: createInflAccum("Victim1", undefined, undefined, 0, 0, true, false, false), // reset
                    1: createInflAccum("Victim2", undefined, undefined, 0, 0, true, false, false), // reset
                    2: createInflAccum("Victim3", undefined, undefined, 0, 0, true, false, false), // reset
                    A: createInflAccum("Victim1", "Me", 1, 6, 0, true, false, false),
                    B: createInflAccum("Victim1", "Me", 2, 12, 0, true, false, false),
                    C: createInflAccum("Victim1", "Me", 3, 18, 0, true, false, false),
                    D: createInflAccum("Victim2", "Me", 4, 0, 11, false, false, false),
                    E: createInflAccum("Victim2", "Me", 5, 0, 22, false, false, false),
                    F: createInflAccum("Victim2", "Me", 6, 0, 33, false, false, false),
                    G: createInflAccum("Victim3", "Me", 7, 13, 0, true, false, false),
                    H: createInflAccum("Victim2", "Me", 8, 0, 33, false, true, false),
                    I: createInflAccum("Victim2", "Me", 9, 0, 33, false, true, true),
                };
                expectObservable(actual).toBe(expectMarble, expectedList);
            });
        });

        it("shows victims with correct damage amounts, knockdown, elimination events; and many resets", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 5000,
                emitOnExpire: true,
            });

            scheduler.run(({ expectObservable, hot, cold }) => {
                // Act
                let timeMarble = "  TTTTT-T-T 4990ms -DT--T---T 5s D";
                let actualMarble = "aabbc-d-e 4990ms ---------- 5s -";
                let expectMarble = "ABCDE-F-G 4990ms --0--2---1 5s -";
                //
                timeMarble += "     TTTTT-T-T 4990ms -DT--T---T 5s D";
                actualMarble += "   aabbc-d-e 4990ms ---------- 5s -";
                expectMarble += "   HIJKL-M-N 4990ms --0--2---1 5s -";
                //
                timeMarble += "     TTTTT-T-T 4990ms -DT--T---T|";
                actualMarble += "   aabbc-d-e 4990ms ----------|";
                expectMarble += "   OPQRS-T-U 4990ms --0--2---1|";
                //
                const frameDuration = scheduler.createTime("-|");
                cold(timeMarble, { T: frameDuration, D: frameDuration * sut.expireAggregateMs }).subscribe((tickDuration) => {
                    jasmine.clock().tick(tickDuration);
                });
                const actualList: { [key: string]: MatchInflictionEvent } = {
                    a: createInfl("Victim1", "Me", 0, 1, 0, true, false, false),
                    b: createInfl("Victim2", "Me", 0, 0, 2, false, false, false),
                    c: createInfl("Victim3", "Me", 0, 3, 0, true, false, false),
                    d: createInfl("Victim2", "Me", 0, 0, 0, undefined, true, false),
                    e: createInfl("Victim2", "Me", 0, 0, 0, undefined, true, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    0: createInflAccum("Victim1", undefined, undefined, 0, 0, true, false, false), // reset
                    1: createInflAccum("Victim2", undefined, undefined, 0, 0, true, false, false), // reset
                    2: createInflAccum("Victim3", undefined, undefined, 0, 0, true, false, false), // reset
                    A: createInflAccum("Victim1", "Me", 1, 1, 0, true, false, false),
                    B: createInflAccum("Victim1", "Me", 2, 2, 0, true, false, false),
                    C: createInflAccum("Victim2", "Me", 3, 0, 2, false, false, false),
                    D: createInflAccum("Victim2", "Me", 4, 0, 4, false, false, false),
                    E: createInflAccum("Victim3", "Me", 5, 3, 0, true, false, false),
                    F: createInflAccum("Victim2", "Me", 6, 0, 4, false, true, false),
                    G: createInflAccum("Victim2", "Me", 7, 0, 4, false, true, true),

                    H: createInflAccum("Victim1", "Me", 10011, 1, 0, true, false, false),
                    I: createInflAccum("Victim1", "Me", 10012, 2, 0, true, false, false),
                    J: createInflAccum("Victim2", "Me", 10013, 0, 2, false, false, false),
                    K: createInflAccum("Victim2", "Me", 10014, 0, 4, false, false, false),
                    L: createInflAccum("Victim3", "Me", 10015, 3, 0, true, false, false),
                    M: createInflAccum("Victim2", "Me", 10016, 0, 4, false, true, false),
                    N: createInflAccum("Victim2", "Me", 10017, 0, 4, false, true, true),

                    O: createInflAccum("Victim1", "Me", 20021, 1, 0, true, false, false),
                    P: createInflAccum("Victim1", "Me", 20022, 2, 0, true, false, false),
                    Q: createInflAccum("Victim2", "Me", 20023, 0, 2, false, false, false),
                    R: createInflAccum("Victim2", "Me", 20024, 0, 4, false, false, false),
                    S: createInflAccum("Victim3", "Me", 20025, 3, 0, true, false, false),
                    T: createInflAccum("Victim2", "Me", 20026, 0, 4, false, true, false),
                    U: createInflAccum("Victim2", "Me", 20027, 0, 4, false, true, true),
                };
                expectObservable(actual).toBe(expectMarble, expectedList);
            });
        });
    });
});

const createInfl = (
    victim: string | undefined,
    attacker: string | undefined,
    time: number | undefined,
    shield: number | undefined = undefined,
    health: number | undefined = undefined,
    hasShield: boolean | undefined = undefined,
    knocked: boolean | undefined = undefined,
    elimination: boolean | undefined = undefined
): MatchInflictionEvent => ({
    victim: victim ? { name: victim } : undefined!,
    shieldDamage: shield,
    healthDamage: health,
    hasShield: hasShield,
    isKnockdown: knocked,
    isElimination: elimination,
    attacker: attacker ? { name: attacker } : undefined,
    timestamp: (time || time === 0) && !isNaN(time) ? new Date(time) : undefined!,
});

const createInflAccum = (
    victim: string | undefined,
    attacker: string | undefined,
    time: number | undefined,
    shieldSum: number | undefined = undefined,
    healthSum: number | undefined = undefined,
    hasShield: boolean | undefined = undefined,
    knocked: boolean | undefined = undefined,
    elimination: boolean | undefined = undefined
): MatchInflictionEventAccum => ({
    victim: victim ? { name: victim } : undefined,
    shieldDamageSum: shieldSum!,
    healthDamageSum: healthSum!,
    hasShield: hasShield!,
    isKnocked: knocked!,
    isEliminated: elimination!,
    latestAttacker: attacker ? { name: attacker } : undefined,
    latestTimestamp: (time || time === 0) && !isNaN(time) ? new Date(time) : undefined,
});
