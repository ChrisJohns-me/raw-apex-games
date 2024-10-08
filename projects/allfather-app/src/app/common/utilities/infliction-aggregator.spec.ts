import { TestScheduler } from "rxjs/testing";
import { MatchInflictionEvent, MatchInflictionEventAccum } from "../match/infliction-event";
import { InflictionAggregator } from "./infliction-aggregator";

describe("InflictionAggregator", () => {
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
                const obs$ = hot("a", { a: createInfliction("Victim1Damage", "Me", 0, 10, 0, true, false, false) });
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                expectObservable(actual).toBe("a", { a: createInflictionAccum("Victim1Damage", "Me", 0, 10, 0, true, false, false) });
            });
        });

        /**
         * Initial damage event shows "armor=false", if the damageAmount is 50 or greater
         * @overwolfQuirk
         */
        it("assumes initial HEALTH damage event of greater than 50 is to damage to shield", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 10000,
                emitOnExpire: false,
            });

            scheduler.run(({ expectObservable, hot }) => {
                // Act
                const obs$ = hot("a", { a: createInfliction("Victim1Damage", "Me", 0, 0, 50, false, false, false) });
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                expectObservable(actual).toBe("a", { a: createInflictionAccum("Victim1Damage", "Me", 0, 50, 0, true, false, false) });
            });
        });

        it("does not assume initial HEALTH damage event of less than 50 is to damage to shield", () => {
            // Arrange
            sut = new InflictionAggregator({
                expireAggregateMs: 10000,
                emitOnExpire: false,
            });

            scheduler.run(({ expectObservable, hot }) => {
                // Act
                const obs$ = hot("a", { a: createInfliction("Victim1Damage", "Me", 0, 0, 49, false, false, false) });
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                expectObservable(actual).toBe("a", { a: createInflictionAccum("Victim1Damage", "Me", 0, 0, 49, false, false, false) });
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
                const obs$ = hot("a", { a: createInfliction("Victim1Knockdown", "Me", 0, undefined, undefined, undefined, true, false) });
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                expectObservable(actual).toBe("a", {
                    a: createInflictionAccum("Victim1Knockdown", "Me", 0, 0, 0, false, true, false),
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
                const obs$ = hot("a", { a: createInfliction("Victim1Elimination", "Me", 0, undefined, undefined, undefined, false, true) });
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                expectObservable(actual).toBe("a", { a: createInflictionAccum("Victim1Elimination", "Me", 0, 0, 0, false, false, true) });
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
                    a: createInfliction("Victim1", "Me", 0, 12, 0, true),
                    b: createInfliction("Victim1", "Me", 0, 0, 8, false),
                    c: createInfliction("Victim1", "Me", 0, 0, 0, false, true),
                    d: createInfliction("Victim1", "Me", 0, 0, 0, false, true, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    0: createInflictionAccum("Victim1", undefined, undefined, 0, 0, true, false, false), // reset
                    A: createInflictionAccum("Victim1", "Me", 1, 12, 0, true, false, false),
                    B: createInflictionAccum("Victim1", "Me", 2, 24, 0, true, false, false),
                    C: createInflictionAccum("Victim1", "Me", 3, 36, 0, true, false, false),
                    D: createInflictionAccum("Victim1", "Me", 4, 36, 8, false, false, false),
                    E: createInflictionAccum("Victim1", "Me", 5, 36, 16, false, false, false),
                    F: createInflictionAccum("Victim1", "Me", 6, 36, 24, false, false, false),
                    G: createInflictionAccum("Victim1", "Me", 7, 36, 24, false, true, false),
                    H: createInflictionAccum("Victim1", "Me", 8, 36, 24, false, true, true),
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
                    a: createInfliction("Victim1", "Me", 0, 12, 0, true),
                    b: createInfliction("Victim1", "Me", 0, 0, 8, false),
                    c: createInfliction("Victim1", "Me", 0, 0, 0, undefined, true),
                    d: createInfliction("Victim1", "Me", 0, 0, 0, undefined, undefined, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    0: createInflictionAccum("Victim1", undefined, undefined, 0, 0, true, false, false), // reset
                    A: createInflictionAccum("Victim1", "Me", 1, 12, 0, true, false, false),
                    B: createInflictionAccum("Victim1", "Me", 2, 24, 0, true, false, false),
                    C: createInflictionAccum("Victim1", "Me", 3, 36, 0, true, false, false),
                    D: createInflictionAccum("Victim1", "Me", 4, 36, 8, false, false, false),
                    E: createInflictionAccum("Victim1", "Me", 5, 36, 16, false, false, false),
                    F: createInflictionAccum("Victim1", "Me", 6, 36, 24, false, false, false),
                    G: createInflictionAccum("Victim1", "Me", 7, 36, 24, false, true, false), // knock
                    H: createInflictionAccum("Victim1", "Me", 8, 36, 24, false, true, true), // elim
                    I: createInflictionAccum("Victim1", "Me", 10009, 12, 0, true, false, false),
                    J: createInflictionAccum("Victim1", "Me", 10010, 24, 0, true, false, false),
                    K: createInflictionAccum("Victim1", "Me", 10011, 36, 0, true, false, false),
                    L: createInflictionAccum("Victim1", "Me", 10012, 36, 8, false, false, false),
                    M: createInflictionAccum("Victim1", "Me", 10013, 36, 16, false, false, false),
                    N: createInflictionAccum("Victim1", "Me", 10014, 36, 24, false, false, false),
                    O: createInflictionAccum("Victim1", "Me", 10015, 36, 24, false, true, false), // knock
                    P: createInflictionAccum("Victim1", "Me", 10016, 36, 24, false, true, true), // elim
                    Q: createInflictionAccum("Victim1", "Me", 20017, 12, 0, true, false, false),
                    R: createInflictionAccum("Victim1", "Me", 20018, 24, 0, true, false, false),
                    S: createInflictionAccum("Victim1", "Me", 20019, 36, 0, true, false, false),
                    T: createInflictionAccum("Victim1", "Me", 20020, 36, 8, false, false, false),
                    U: createInflictionAccum("Victim1", "Me", 20021, 36, 16, false, false, false),
                    V: createInflictionAccum("Victim1", "Me", 20022, 36, 24, false, false, false),
                    W: createInflictionAccum("Victim1", "Me", 20023, 36, 24, false, true, false), // knock
                    X: createInflictionAccum("Victim1", "Me", 20024, 36, 24, false, true, true), // elim
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
                    a: createInfliction("Victim1", "Me", 0, 6, 0, true, false, false),
                    b: createInfliction("Victim2", "Me", 0, 0, 11, false, false, false),
                    c: createInfliction("Victim3", "Me", 0, 13, 0, true, false, false),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    A: createInflictionAccum("Victim1", "Me", 0, 6, 0, true, false, false),
                    B: createInflictionAccum("Victim2", "Me", 0, 0, 11, false, false, false),
                    C: createInflictionAccum("Victim3", "Me", 0, 13, 0, true, false, false),
                    D: createInflictionAccum("Victim2", "Me", 0, 0, 22, false, false, false),
                    E: createInflictionAccum("Victim3", "Me", 0, 26, 0, true, false, false),
                    F: createInflictionAccum("Victim1", "Me", 0, 12, 0, true, false, false),
                    G: createInflictionAccum("Victim2", "Me", 0, 0, 33, false, false, false),
                    H: createInflictionAccum("Victim1", "Me", 0, 18, 0, true, false, false),
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
                    a: createInfliction("Victim1", "Me", 0, 6, 0, true, false, false),
                    b: createInfliction("Victim2", "Me", 0, 0, 11, false, false, false),
                    c: createInfliction("Victim3", "Me", 0, 13, 0, true, false, false),
                    d: createInfliction("Victim2", "Me", 0, 0, 0, undefined, true, false),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    A: createInflictionAccum("Victim1", "Me", 0, 6, 0, true, false, false),
                    B: createInflictionAccum("Victim2", "Me", 0, 0, 11, false, false, false),
                    C: createInflictionAccum("Victim3", "Me", 0, 13, 0, true, false, false),
                    D: createInflictionAccum("Victim1", "Me", 0, 12, 0, true, false, false),
                    E: createInflictionAccum("Victim2", "Me", 0, 0, 22, false, false, false),
                    F: createInflictionAccum("Victim3", "Me", 0, 26, 0, true, false, false),
                    G: createInflictionAccum("Victim2", "Me", 0, 0, 22, false, true, false),
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
                    a: createInfliction("Victim1", "Me", 0, 6, 0, true, false, false),
                    b: createInfliction("Victim2", "Me", 0, 0, 11, false, false, false),
                    c: createInfliction("Victim3", "Me", 0, 13, 0, true, false, false),
                    d: createInfliction("Victim2", "Me", 0, 0, 0, undefined, true, false),
                    e: createInfliction("Victim2", "Me", 0, 0, 0, undefined, true, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    A: createInflictionAccum("Victim1", "Me", 0, 6, 0, true, false, false),
                    B: createInflictionAccum("Victim2", "Me", 0, 0, 11, false, false, false),
                    C: createInflictionAccum("Victim3", "Me", 0, 13, 0, true, false, false),
                    D: createInflictionAccum("Victim1", "Me", 0, 12, 0, true, false, false),
                    E: createInflictionAccum("Victim2", "Me", 0, 0, 22, false, false, false),
                    F: createInflictionAccum("Victim3", "Me", 0, 26, 0, true, false, false),
                    G: createInflictionAccum("Victim2", "Me", 0, 0, 22, false, true, false),
                    H: createInflictionAccum("Victim2", "Me", 0, 0, 22, false, true, true),
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
                    a: createInfliction("Victim1", "Me", 0, 6, 0, true, false, false),
                    b: createInfliction("Victim2", "Me", 0, 0, 11, false, false, false),
                    c: createInfliction("Victim3", "Me", 0, 13, 0, true, false, false),
                    d: createInfliction("Victim2", "Me", 0, 0, 0, undefined, true, false),
                    e: createInfliction("Victim2", "Me", 0, 0, 0, undefined, true, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    0: createInflictionAccum("Victim1", undefined, undefined, 0, 0, true, false, false), // reset
                    1: createInflictionAccum("Victim2", undefined, undefined, 0, 0, true, false, false), // reset
                    2: createInflictionAccum("Victim3", undefined, undefined, 0, 0, true, false, false), // reset
                    A: createInflictionAccum("Victim1", "Me", 1, 6, 0, true, false, false),
                    B: createInflictionAccum("Victim1", "Me", 2, 12, 0, true, false, false),
                    C: createInflictionAccum("Victim1", "Me", 3, 18, 0, true, false, false),
                    D: createInflictionAccum("Victim2", "Me", 4, 0, 11, false, false, false),
                    E: createInflictionAccum("Victim2", "Me", 5, 0, 22, false, false, false),
                    F: createInflictionAccum("Victim2", "Me", 6, 0, 33, false, false, false),
                    G: createInflictionAccum("Victim3", "Me", 7, 13, 0, true, false, false),
                    H: createInflictionAccum("Victim2", "Me", 8, 0, 33, false, true, false),
                    I: createInflictionAccum("Victim2", "Me", 9, 0, 33, false, true, true),
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
                    a: createInfliction("Victim1", "Me", 0, 1, 0, true, false, false),
                    b: createInfliction("Victim2", "Me", 0, 0, 2, false, false, false),
                    c: createInfliction("Victim3", "Me", 0, 3, 0, true, false, false),
                    d: createInfliction("Victim2", "Me", 0, 0, 0, undefined, true, false),
                    e: createInfliction("Victim2", "Me", 0, 0, 0, undefined, true, true),
                };
                const obs$ = hot(actualMarble, actualList);
                const actual = sut.getInflictionAggregate$([obs$]);

                // Assert
                const expectedList: { [key: string]: MatchInflictionEventAccum } = {
                    0: createInflictionAccum("Victim1", undefined, undefined, 0, 0, true, false, false), // reset
                    1: createInflictionAccum("Victim2", undefined, undefined, 0, 0, true, false, false), // reset
                    2: createInflictionAccum("Victim3", undefined, undefined, 0, 0, true, false, false), // reset
                    A: createInflictionAccum("Victim1", "Me", 1, 1, 0, true, false, false),
                    B: createInflictionAccum("Victim1", "Me", 2, 2, 0, true, false, false),
                    C: createInflictionAccum("Victim2", "Me", 3, 0, 2, false, false, false),
                    D: createInflictionAccum("Victim2", "Me", 4, 0, 4, false, false, false),
                    E: createInflictionAccum("Victim3", "Me", 5, 3, 0, true, false, false),
                    F: createInflictionAccum("Victim2", "Me", 6, 0, 4, false, true, false),
                    G: createInflictionAccum("Victim2", "Me", 7, 0, 4, false, true, true),

                    H: createInflictionAccum("Victim1", "Me", 10011, 1, 0, true, false, false),
                    I: createInflictionAccum("Victim1", "Me", 10012, 2, 0, true, false, false),
                    J: createInflictionAccum("Victim2", "Me", 10013, 0, 2, false, false, false),
                    K: createInflictionAccum("Victim2", "Me", 10014, 0, 4, false, false, false),
                    L: createInflictionAccum("Victim3", "Me", 10015, 3, 0, true, false, false),
                    M: createInflictionAccum("Victim2", "Me", 10016, 0, 4, false, true, false),
                    N: createInflictionAccum("Victim2", "Me", 10017, 0, 4, false, true, true),

                    O: createInflictionAccum("Victim1", "Me", 20021, 1, 0, true, false, false),
                    P: createInflictionAccum("Victim1", "Me", 20022, 2, 0, true, false, false),
                    Q: createInflictionAccum("Victim2", "Me", 20023, 0, 2, false, false, false),
                    R: createInflictionAccum("Victim2", "Me", 20024, 0, 4, false, false, false),
                    S: createInflictionAccum("Victim3", "Me", 20025, 3, 0, true, false, false),
                    T: createInflictionAccum("Victim2", "Me", 20026, 0, 4, false, true, false),
                    U: createInflictionAccum("Victim2", "Me", 20027, 0, 4, false, true, true),
                };
                expectObservable(actual).toBe(expectMarble, expectedList);
            });
        });
    });
});

export const createInfliction = (
    victim: string | undefined,
    attacker: string | undefined,
    time: number | undefined,
    shield: number | undefined = undefined,
    health: number | undefined = undefined,
    hasShield: boolean | undefined = undefined,
    knocked: boolean | undefined = undefined,
    elimination: boolean | undefined = undefined
): MatchInflictionEvent => ({
    victim: victim ? { name: victim, isMe: false } : undefined!,
    shieldDamage: shield,
    healthDamage: health,
    hasShield: hasShield,
    isKnockdown: knocked,
    isElimination: elimination,
    attacker: attacker ? { name: attacker, isMe: false } : undefined,
    timestamp: (time || time === 0) && !isNaN(time) ? new Date(time) : undefined!,
});

export const createInflictionAccum = (
    victim: string | undefined,
    attacker: string | undefined,
    time: number | undefined,
    shieldSum: number | undefined = undefined,
    healthSum: number | undefined = undefined,
    hasShield: boolean | undefined = undefined,
    knocked: boolean | undefined = undefined,
    elimination: boolean | undefined = undefined
): MatchInflictionEventAccum => ({
    victim: victim ? { name: victim, isMe: false } : undefined,
    shieldDamageSum: shieldSum!,
    healthDamageSum: healthSum!,
    hasShield: hasShield!,
    isKnocked: knocked!,
    isEliminated: elimination!,
    latestAttacker: attacker ? { name: attacker, isMe: false } : undefined,
    latestTimestamp: (time || time === 0) && !isNaN(time) ? new Date(time) : undefined,
});
