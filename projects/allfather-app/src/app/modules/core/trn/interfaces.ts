export type TRNPlatformTypes = "origin" | "psn" | "xbl" | "steam" | "switch";
export type TRNBulkPlayerListRequest = Array<{ nickname: string; platform: TRNPlatformTypes }>;

export interface TRNPlayerData {
    playerId: string;
    username: string;
    rankScore: number;
    label: string;
    image: string;
    needsRefresh: boolean;
    level: number;
}
export function isTRNPlayerData(player: any): player is TRNPlayerData {
    return (
        "playerId" in player &&
        "username" in player &&
        "rankScore" in player &&
        "label" in player &&
        "image" in player &&
        "needsRefresh" in player &&
        "level" in player
    );
}

// // TODO:

// interface Data {
//     platformInfo: PlatformInfo;
//     userInfo: UserInfo;
//     metadata: Metadata;
// }

// interface PlatformInfo {
//     platformSlug: string;
//     platformUserId: string;
//     platformUserHandle: string;
//     platformUserIdentifier: string;
//     avatarUrl: string;
//     additionalParameters: string;
// }

// interface UserInfo {
//     userId: boolean;
//     isPremium: boolean;
//     isVerified: boolean;
//     isInfluencer: boolean;
//     isPartner: boolean;
//     countryCode: string;
//     customAvatarUrl: string;
//     customHeroUrl: string;
//     socialAccounts: PlatformInfo[];
//     pageviews: number;
//     isSuspicious: boolean;
// }

// interface Metadata {
//     currentSeason: number;
//     activeLegend: string;
//     activeLegendName: string;
//     activeLegendStats: string;
// }

// interface Segments {
//     type: string;
//     attributes: string;
//     metadata: {
//         name: string;
//     };
//     expiryDate: string;
//     stats: {
//         level:
//     }
// }

// {
//     "data": {
//         "platformInfo": {
//             "platformSlug": "origin",
//             "platformUserId": "MasterKriff",
//             "platformUserHandle": "MasterKriff",
//             "platformUserIdentifier": "MasterKriff",
//             "avatarUrl": "https://trackercdn.com/cdn/user-avatars/4312419.png?v=637463885977476324",
//             "additionalParameters": null
//         },
//         "userInfo": {
//             "userId": null,
//             "isPremium": true,
//             "isVerified": false,
//             "isInfluencer": false,
//             "isPartner": false,
//             "countryCode": "US",
//             "customAvatarUrl": "https://trackercdn.com/cdn/user-avatars/4312419.png?v=637463885977476324",
//             "customHeroUrl": null,
//             "socialAccounts": [
//                 {
//                     "platformSlug": "twitch",
//                     "platformUserHandle": "masterkriff",
//                     "platformUserIdentifier": "masterkriff"
//                 }
//             ],
//             "pageviews": 304,
//             "isSuspicious": null
//         },
//         "metadata": {
//             "currentSeason": 2,
//             "activeLegend": "legend_10",
//             "activeLegendName": "Wattson",
//             "activeLegendStats": null
//         },
//         "segments": [
//             {
//                 "type": "overview",
//                 "attributes": {},
//                 "metadata": {
//                     "name": "Lifetime"
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "level": {
//                         "rank": null,
//                         "percentile": 74.0,
//                         "displayName": "Level",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 192.0,
//                         "displayValue": "192",
//                         "displayType": "Unspecified"
//                     },
//                     "kills": {
//                         "rank": null,
//                         "percentile": 86.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 1582.0,
//                         "displayValue": "1,582",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 81.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 613061.0,
//                         "displayValue": "613,061",
//                         "displayType": "Unspecified"
//                     },
//                     "rankScore": {
//                         "rank": null,
//                         "percentile": null,
//                         "displayName": "Rank Score",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {
//                             "iconUrl": "https://trackercdn.com/cdn/apex.tracker.gg/ranks/gold2.png",
//                             "rankName": "Gold 2"
//                         },
//                         "value": 3946.0,
//                         "displayValue": "3,946",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_5"
//                 },
//                 "metadata": {
//                     "name": "Bloodhound",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/bloodhound-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/bloodhound-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/bloodhound-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 44.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 47.0,
//                         "displayValue": "47",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 17.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 23979.0,
//                         "displayValue": "23,979",
//                         "displayType": "Unspecified"
//                     },
//                     "eyeEnemiesScanned": {
//                         "rank": null,
//                         "percentile": 40.0,
//                         "displayName": "Eye: Enemies Scanned",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 566.0,
//                         "displayValue": "566",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_6"
//                 },
//                 "metadata": {
//                     "name": "Gibraltar",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/gibraltar-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/gibraltar-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/gibraltar-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 57.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 51.0,
//                         "displayValue": "51",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 21.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 17714.0,
//                         "displayValue": "17,714",
//                         "displayType": "Unspecified"
//                     },
//                     "domeDamageBlocked": {
//                         "rank": null,
//                         "percentile": 20.0,
//                         "displayName": "Dome: Damage Blocked",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 6757.0,
//                         "displayValue": "6,757",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_9"
//                 },
//                 "metadata": {
//                     "name": "Octane",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/octane-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/octane-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/octane-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 88.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 669.0,
//                         "displayValue": "669",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": 38274,
//                         "percentile": 79.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 263153.0,
//                         "displayValue": "263,153",
//                         "displayType": "Unspecified"
//                     },
//                     "stimDistanceTravelled": {
//                         "rank": null,
//                         "percentile": 94.0,
//                         "displayName": "Stim Distance Travelled",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 353729.0,
//                         "displayValue": "353,729",
//                         "displayType": "Unspecified"
//                     },
//                     "passiveHealthRegenerated": {
//                         "rank": null,
//                         "percentile": 49.0,
//                         "displayName": "Passive Health Regenerated",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 18241.0,
//                         "displayValue": "18,241",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_12"
//                 },
//                 "metadata": {
//                     "name": "Revenant",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/revenant-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/revenant-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/revenant-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 16.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 7.0,
//                         "displayValue": "7",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 4.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 4411.0,
//                         "displayValue": "4,411",
//                         "displayType": "Unspecified"
//                     },
//                     "silencedTargets": {
//                         "rank": null,
//                         "percentile": 12.0,
//                         "displayName": "Silenced Targets",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 21.0,
//                         "displayValue": "21",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_8"
//                 },
//                 "metadata": {
//                     "name": "Pathfinder",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/pathfinder-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/pathfinder-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/pathfinder-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 75.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 338.0,
//                         "displayValue": "338",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 49.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 131654.0,
//                         "displayValue": "131,654",
//                         "displayType": "Unspecified"
//                     },
//                     "grappleTravelDistance": {
//                         "rank": null,
//                         "percentile": 44.0,
//                         "displayName": "Grapple: Travel Distance",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 34694.0,
//                         "displayValue": "34,694",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_3"
//                 },
//                 "metadata": {
//                     "name": "Caustic",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/caustic-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/caustic-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/caustic-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 30.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 38.0,
//                         "displayValue": "38",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 11.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 15393.0,
//                         "displayValue": "15,393",
//                         "displayType": "Unspecified"
//                     },
//                     "noxGasDamageDealt": {
//                         "rank": null,
//                         "percentile": 15.0,
//                         "displayName": "NOX: Gas Damage Dealt",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 1798.0,
//                         "displayValue": "1,798",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_15"
//                 },
//                 "metadata": {
//                     "name": "Horizon",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/horizon-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/horizon-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/horizon-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 30.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 21.0,
//                         "displayValue": "21",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 5.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 8268.0,
//                         "displayValue": "8,268",
//                         "displayType": "Unspecified"
//                     },
//                     "ultimateEnemyDamage": {
//                         "rank": null,
//                         "percentile": 7.0,
//                         "displayName": "Ultimate Enemy Damage",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 174.0,
//                         "displayValue": "174",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_2"
//                 },
//                 "metadata": {
//                     "name": "Bangalore",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/bangalore-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/bangalore-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/bangalore-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 54.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 72.0,
//                         "displayValue": "72",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 18.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 28504.0,
//                         "displayValue": "28,504",
//                         "displayType": "Unspecified"
//                     },
//                     "creepingBarrageDamage": {
//                         "rank": null,
//                         "percentile": 41.0,
//                         "displayName": "Creeping Barrage: Damage",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 3677.0,
//                         "displayValue": "3,677",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_7"
//                 },
//                 "metadata": {
//                     "name": "Lifeline",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/lifeline-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/lifeline-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/lifeline-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 40.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 33.0,
//                         "displayValue": "33",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 6.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 13297.0,
//                         "displayValue": "13,297",
//                         "displayType": "Unspecified"
//                     },
//                     "docDroneHealing": {
//                         "rank": null,
//                         "percentile": 15.0,
//                         "displayName": "D.O.C. Drone: Healing",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 3177.0,
//                         "displayValue": "3,177",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_13"
//                 },
//                 "metadata": {
//                     "name": "Loba",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/loba-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/loba-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/loba-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 40.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 21.0,
//                         "displayValue": "21",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 10.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 7846.0,
//                         "displayValue": "7,846",
//                         "displayType": "Unspecified"
//                     },
//                     "tacticalMetersTeleported": {
//                         "rank": null,
//                         "percentile": 6.0,
//                         "displayName": "Tactical Meters Teleported",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 820.0,
//                         "displayValue": "820",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_11"
//                 },
//                 "metadata": {
//                     "name": "Crypto",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/crypto-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/crypto-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/crypto-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 54.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 47.0,
//                         "displayValue": "47",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": 45699,
//                         "percentile": 23.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 18455.0,
//                         "displayValue": "18,455",
//                         "displayType": "Unspecified"
//                     },
//                     "ultimateShieldDamage": {
//                         "rank": null,
//                         "percentile": 33.0,
//                         "displayName": "Ultimate Shield Damage",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 3377.0,
//                         "displayValue": "3,377",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_14"
//                 },
//                 "metadata": {
//                     "name": "Rampart",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/rampart-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/rampart-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/rampart-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 84.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 52.0,
//                         "displayValue": "52",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": 6040,
//                         "percentile": 49.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 19472.0,
//                         "displayValue": "19,472",
//                         "displayType": "Unspecified"
//                     },
//                     "tacticalDamageBlocked": {
//                         "rank": null,
//                         "percentile": 56.0,
//                         "displayName": "Tactical Damage Blocked",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 32207.0,
//                         "displayValue": "32,207",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_10"
//                 },
//                 "metadata": {
//                     "name": "Wattson",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/wattson-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/wattson-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/wattson-concept-bg-small.jpg",
//                     "isActive": true
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 58.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 91.0,
//                         "displayValue": "91",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": 43064,
//                         "percentile": 32.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 37060.0,
//                         "displayValue": "37,060",
//                         "displayType": "Unspecified"
//                     },
//                     "friendlyShieldsCharged": {
//                         "rank": null,
//                         "percentile": 31.0,
//                         "displayName": "Friendly Shields Charged",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 2563.0,
//                         "displayValue": "2,563",
//                         "displayType": "Unspecified"
//                     },
//                     "enemyOrdinanceIntercepted": {
//                         "rank": null,
//                         "percentile": 45.0,
//                         "displayName": "Enemy Ordinance Intercepted",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 71.0,
//                         "displayValue": "71",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_16"
//                 },
//                 "metadata": {
//                     "name": "Fuse",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/fuse-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/fuse-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/fuse-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": 26562,
//                         "percentile": 44.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 19.0,
//                         "displayValue": "19",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_4"
//                 },
//                 "metadata": {
//                     "name": "Mirage",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/mirage-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/mirage-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/mirage-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 24.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 23.0,
//                         "displayValue": "23",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 5.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 7014.0,
//                         "displayValue": "7,014",
//                         "displayType": "Unspecified"
//                     },
//                     "decoysCreated": {
//                         "rank": null,
//                         "percentile": 10.0,
//                         "displayName": "Decoys Created",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 231.0,
//                         "displayValue": "231",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             },
//             {
//                 "type": "legend",
//                 "attributes": {
//                     "id": "legend_1"
//                 },
//                 "metadata": {
//                     "name": "Wraith",
//                     "imageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/wraith-tile.png",
//                     "tallImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/wraith-tall.png",
//                     "bgImageUrl": "https://trackercdn.com/cdn/apex.tracker.gg/legends/wraith-concept-bg-small.jpg",
//                     "isActive": false
//                 },
//                 "expiryDate": "2021-04-12T15:28:05.5669823+00:00",
//                 "stats": {
//                     "kills": {
//                         "rank": null,
//                         "percentile": 35.0,
//                         "displayName": "Kills",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 53.0,
//                         "displayValue": "53",
//                         "displayType": "Unspecified"
//                     },
//                     "damage": {
//                         "rank": null,
//                         "percentile": 4.0,
//                         "displayName": "Damage",
//                         "displayCategory": "Combat",
//                         "category": null,
//                         "metadata": {},
//                         "value": 16841.0,
//                         "displayValue": "16,841",
//                         "displayType": "Unspecified"
//                     },
//                     "phaseWalkTime": {
//                         "rank": null,
//                         "percentile": 9.0,
//                         "displayName": "Phase Walk: Time",
//                         "displayCategory": "Game",
//                         "category": null,
//                         "metadata": {},
//                         "value": 176.0,
//                         "displayValue": "176",
//                         "displayType": "Unspecified"
//                     }
//                 }
//             }
//         ],
//         "availableSegments": [
//             {
//                 "type": "legend",
//                 "attributes": {},
//                 "metadata": {}
//             }
//         ],
//         "expiryDate": "2021-04-12T15:28:05.5669823+00:00"
//     }
// }
