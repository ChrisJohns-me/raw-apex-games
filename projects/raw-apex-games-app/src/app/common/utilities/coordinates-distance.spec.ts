import { MatchMapCoordinates } from "../match/map/map-coordinates";
import { coordinatesDistance } from "./coordinates-distance";

describe("CoordinatesDistance", () => {
    it("calculates the total distance of a list of 3d coordinates (x only)", () => {
        // Arrange
        const coordinates: MatchMapCoordinates[] = [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 2, y: 0, z: 0 },
            { x: 3, y: 0, z: 0 },
        ];

        // Act
        const result = coordinatesDistance(coordinates);

        // Assert
        expect(result).toBe(3);
    });

    it("calculates the total distance of a list of 3d coordinates (y only)", () => {
        // Arrange
        const coordinates: MatchMapCoordinates[] = [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: 2, z: 0 },
            { x: 0, y: 3, z: 0 },
        ];

        // Act
        const result = coordinatesDistance(coordinates);

        // Assert
        expect(result).toBe(3);
    });

    it("calculates the total distance of a list of 3d coordinates (x, y)", () => {
        // Arrange
        const coordinates: MatchMapCoordinates[] = [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 1, z: 0 },
            { x: 2, y: 2, z: 0 },
            { x: 3, y: 3, z: 0 },
        ];

        // Act
        const result = coordinatesDistance(coordinates);

        // Assert
        expect(result).toBeCloseTo(4, 0);
    });

    it("calculates the total distance of a list of 2d coordinates (x, y, z)", () => {
        // Arrange
        const coordinates: MatchMapCoordinates[] = [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 1, z: 1 },
            { x: 2, y: 2, z: 2 },
            { x: 3, y: 3, z: 3 },
        ];

        // Act
        const result = coordinatesDistance(coordinates);

        // Assert
        expect(result).toBeCloseTo(5, 0);
    });
});
