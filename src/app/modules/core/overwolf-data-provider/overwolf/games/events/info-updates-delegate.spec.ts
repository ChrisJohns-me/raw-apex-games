import { InfoUpdatesDelegate } from "@core/overwolf-data-provider";

type InfoUpdates2Event = overwolf.games.events.InfoUpdates2Event;

describe("InfoUpdatesDelegate", () => {
    let sut: InfoUpdatesDelegate;

    // InfoUpdates are required to at least contain the "info" and "feature" properties
    it("filters data not conforming to expected structure", () => {
        // Arrange
        let called = 0;
        sut = new InfoUpdatesDelegate();

        // Act
        const goodEvent: InfoUpdates2Event = { info: { match_info: { me: '{"name":"Me"}' } }, feature: "roster" };
        const badEvent = { badObj: {}, feature: "bad" };

        sut.infoUpdates$.subscribe((actual) => {
            called++;
            const expected = { info: { match_info: { me: { name: "Me" } } }, feature: "roster" };
            expect(actual).toEqual(expected as any);
        });
        sut.onInfoUpdates2(goodEvent as any);
        sut.onInfoUpdates2(badEvent as any);

        // Assert
        expect(called).toBe(1);
    });
});
