/**
 * Represents Apex Legends types from Overwolf's API, after JSON being parsed.
 */
declare namespace overwolf.gep.ApexLegends {
    type PlayerState = "alive" | "dead" | "knockedout";

    interface GameEventDamage {
        targetName: string;
        damageAmount: number;
        armor: boolean;
        headshot: boolean;
    }

    interface GameEventKillFeed {
        local_player_name: string;
        attackerName: string;
        victimName: string;
        weaponName: string;
        // "Caustic Gas" ~= "knockdown"
        // "Melee" = "knockdown" or "kill"
        // "Bleed Out" = "kill"
        // "committedsuicide" need to add (need casing and spacing)
        action: "kill" | "knockdown" | "assist" | "Bleed Out" | "Melee" | "Caustic Gas" | "headshot_kill" | "Finisher";
    }

    interface GameEventKnockdown {
        victimName: string;
    }

    interface GameEventKill {
        victimName: string;
    }

    interface EventData {
        damage: GameEventDamage;
        death: string;
        healed_from_ko: string;
        kill_feed: GameEventKillFeed;
        kill: GameEventKill;
        knockdown: string;
        knocked_out: GameEventKnockdown;
        match_end: string;
        match_start: string;
        respawn: string;
    }

    // --------------------------------------------------------------------------

    interface MatchInfoMeUltimateCooldown {
        ultimate_cooldown: number;
    }

    interface MatchInfoMeInventory {
        name: string;
        amount: number;
    }

    interface MatchInfoMeWeapons {
        weapon0: string;
        weapon1: string;
    }

    interface MatchInfoMeInUse {
        inUse: string;
    }

    interface MatchInfoMe {
        name?: string;
        totalDamageDealt?: number; // This value may be incorrect!
        ultimate_cooldown?: MatchInfoMeUltimateCooldown;
        inUse?: MatchInfoMeInUse;
        weapons?: MatchInfoMeWeapons;
        // Not sure if there's a simpler way of defining these...
        inventory_0?: MatchInfoMeInventory;
        inventory_1?: MatchInfoMeInventory;
        inventory_2?: MatchInfoMeInventory;
        inventory_3?: MatchInfoMeInventory;
        inventory_4?: MatchInfoMeInventory;
        inventory_5?: MatchInfoMeInventory;
        inventory_6?: MatchInfoMeInventory;
        inventory_7?: MatchInfoMeInventory;
        inventory_8?: MatchInfoMeInventory;
        inventory_9?: MatchInfoMeInventory;
        inventory_10?: MatchInfoMeInventory;
        inventory_11?: MatchInfoMeInventory;
        inventory_12?: MatchInfoMeInventory;
        inventory_13?: MatchInfoMeInventory;
        inventory_14?: MatchInfoMeInventory;
        inventory_15?: MatchInfoMeInventory;
        inventory_16?: MatchInfoMeInventory;
        inventory_17?: MatchInfoMeInventory;
        inventory_18?: MatchInfoMeInventory;
        inventory_19?: MatchInfoMeInventory;
        inventory_20?: MatchInfoMeInventory;
        inventory_21?: MatchInfoMeInventory;
        inventory_22?: MatchInfoMeInventory;
        inventory_23?: MatchInfoMeInventory;
        inventory_24?: MatchInfoMeInventory;
        inventory_25?: MatchInfoMeInventory;
        inventory_26?: MatchInfoMeInventory;
        inventory_27?: MatchInfoMeInventory;
        inventory_28?: MatchInfoMeInventory;
        inventory_29?: MatchInfoMeInventory;
        inventory_30?: MatchInfoMeInventory;
    }

    interface MatchInfoTabs {
        kills: number;
        assists: number;
        spectators: number;
        teams: number;
        players: number;
        damage: number;
        cash: number;
    }

    interface MatchInfoLegendSelect {
        playerName: string;
        legendName: string; // ex. "#character_bangalore_NAME"
        selectionOrder: number;
        lead: boolean;
    }

    interface MatchInfoLocation {
        x: number;
        y: number;
        z: number;
    }

    interface MatchInfoTeammate {
        name: string;
        state: PlayerState;
    }

    interface MatchInfoRoster {
        name: string;
        isTeammate: boolean;
        team_id: number;
        platform_hw: number;
        platform_sw: number;
        state?: PlayerState;
    }

    interface MatchInfoTeamInfo {
        team_state?: "active" | "eliminated";
    }

    interface MatchInfoMatchSummary {
        rank: number; // Position active player's squad reached
        teams: number; // Remaining teams
        squadKills: number;
    }

    interface MatchInfo {
        pseudo_match_id?: string;
        game_mode?: string; // ex. "#PL_FIRINGRANGE"
        tabs?: MatchInfoTabs;
        team_info?: MatchInfoTeamInfo;
        match_summary?: MatchInfoMatchSummary;
        location?: MatchInfoLocation;
        victory?: boolean;
        legendSelect_0?: MatchInfoLegendSelect;
        legendSelect_1?: MatchInfoLegendSelect;
        legendSelect_2?: MatchInfoLegendSelect;
        teammate_0?: MatchInfoTeammate;
        teammate_1?: MatchInfoTeammate;
        teammate_2?: MatchInfoTeammate;
        // Not sure if there's a simpler way of defining these...
        roster_0?: MatchInfoRoster;
        roster_1?: MatchInfoRoster;
        roster_2?: MatchInfoRoster;
        roster_3?: MatchInfoRoster;
        roster_4?: MatchInfoRoster;
        roster_5?: MatchInfoRoster;
        roster_6?: MatchInfoRoster;
        roster_7?: MatchInfoRoster;
        roster_8?: MatchInfoRoster;
        roster_9?: MatchInfoRoster;
        roster_10?: MatchInfoRoster;
        roster_11?: MatchInfoRoster;
        roster_12?: MatchInfoRoster;
        roster_13?: MatchInfoRoster;
        roster_14?: MatchInfoRoster;
        roster_15?: MatchInfoRoster;
        roster_16?: MatchInfoRoster;
        roster_17?: MatchInfoRoster;
        roster_18?: MatchInfoRoster;
        roster_19?: MatchInfoRoster;
        roster_20?: MatchInfoRoster;
        roster_21?: MatchInfoRoster;
        roster_22?: MatchInfoRoster;
        roster_23?: MatchInfoRoster;
        roster_24?: MatchInfoRoster;
        roster_25?: MatchInfoRoster;
        roster_26?: MatchInfoRoster;
        roster_27?: MatchInfoRoster;
        roster_28?: MatchInfoRoster;
        roster_29?: MatchInfoRoster;
        roster_30?: MatchInfoRoster;
        roster_31?: MatchInfoRoster;
        roster_32?: MatchInfoRoster;
        roster_33?: MatchInfoRoster;
        roster_34?: MatchInfoRoster;
        roster_35?: MatchInfoRoster;
        roster_36?: MatchInfoRoster;
        roster_37?: MatchInfoRoster;
        roster_38?: MatchInfoRoster;
        roster_39?: MatchInfoRoster;
        roster_40?: MatchInfoRoster;
        roster_41?: MatchInfoRoster;
        roster_42?: MatchInfoRoster;
        roster_43?: MatchInfoRoster;
        roster_44?: MatchInfoRoster;
        roster_45?: MatchInfoRoster;
        roster_46?: MatchInfoRoster;
        roster_47?: MatchInfoRoster;
        roster_48?: MatchInfoRoster;
        roster_49?: MatchInfoRoster;
        roster_50?: MatchInfoRoster;
        roster_51?: MatchInfoRoster;
        roster_52?: MatchInfoRoster;
        roster_53?: MatchInfoRoster;
        roster_54?: MatchInfoRoster;
        roster_55?: MatchInfoRoster;
        roster_56?: MatchInfoRoster;
        roster_57?: MatchInfoRoster;
        roster_58?: MatchInfoRoster;
        roster_59?: MatchInfoRoster;
        roster_60?: MatchInfoRoster;
        roster_61?: MatchInfoRoster;
        roster_62?: MatchInfoRoster;
        roster_63?: MatchInfoRoster;
        roster_64?: MatchInfoRoster;
        roster_65?: MatchInfoRoster;
        roster_66?: MatchInfoRoster;
        roster_67?: MatchInfoRoster;
        roster_68?: MatchInfoRoster;
        roster_69?: MatchInfoRoster;
        roster_70?: MatchInfoRoster;
        roster_71?: MatchInfoRoster;
        roster_72?: MatchInfoRoster;
        roster_73?: MatchInfoRoster;
        roster_74?: MatchInfoRoster;
        roster_75?: MatchInfoRoster;
        roster_76?: MatchInfoRoster;
        roster_77?: MatchInfoRoster;
        roster_78?: MatchInfoRoster;
        roster_79?: MatchInfoRoster;
        roster_80?: MatchInfoRoster;
        roster_81?: MatchInfoRoster;
        roster_82?: MatchInfoRoster;
        roster_83?: MatchInfoRoster;
        roster_84?: MatchInfoRoster;
        roster_85?: MatchInfoRoster;
        roster_86?: MatchInfoRoster;
        roster_87?: MatchInfoRoster;
        roster_88?: MatchInfoRoster;
        roster_89?: MatchInfoRoster;
        roster_90?: MatchInfoRoster;
        roster_91?: MatchInfoRoster;
        roster_92?: MatchInfoRoster;
        roster_93?: MatchInfoRoster;
        roster_94?: MatchInfoRoster;
        roster_95?: MatchInfoRoster;
        roster_96?: MatchInfoRoster;
        roster_97?: MatchInfoRoster;
        roster_98?: MatchInfoRoster;
        roster_99?: MatchInfoRoster;
    }

    interface GameInfo {
        match_state?: "active" | "inactive";
    }

    enum GameInfoKey {
        Damage = "damage",
        Death = "death",
        Inventory = "inventory",
        Kill = "kill",
        KillFeed = "kill_feed",
        Location = "location",
        MatchInfo = "match_info",
        MatchState = "match_state",
        MatchSummary = "match_summary",
        Me = "me",
        Rank = "rank",
        Revive = "revive",
        Roster = "roster",
        Team = "team",
        Victory = "victory",
    }

    interface InfoUpdates2 extends overwolf.games.events.InfoUpdate2 {
        match_info?: MatchInfo;
        game_info?: GameInfo;
        me?: MatchInfoMe;
    }

    // TODO: Fix this to actually work with overwolf's declarations.
    /**
     * Intended to be used with overwolf.games.events.onInfoUpdates2.addListener
     */
    type InfoUpdates2Event = overwolf.games.events.InfoUpdates2Event<
        overwolf.gep.ApexLegends.GameInfoKey,
        overwolf.gep.ApexLegends.InfoUpdates2
    >;

    /**
     * Intended to be used with overwolf.games.events.onNewEvents.addListener
     */
    interface GameEvent {
        name: keyof overwolf.gep.ApexLegends.EventData;
        data:
            | string
            | null
            | overwolf.gep.ApexLegends.GameEventKillFeed
            | overwolf.gep.ApexLegends.GameEventDamage
            | overwolf.gep.ApexLegends.GameEventKnockdown
            | overwolf.gep.ApexLegends.GameEventKill;
    }
    interface NewGameEvents {
        events: GameEvent[];
    }
}
