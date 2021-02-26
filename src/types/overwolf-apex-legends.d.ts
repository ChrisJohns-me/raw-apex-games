declare namespace overwolf.gep.ApexLegends {
    type ApexLegendsPlayerState = "alive" | "dead" | "knockedout";

    /**
     * All available game events. When a new event is triggered, it's one of these keys.
     */
    interface ApexLegendsGameEventDamage {
        targetName: string;
        damageAmount: string | number;
        armor: boolean;
        headshot: boolean;
    }

    interface ApexLegendsGameEventKillFeed {
        local_player_name: string;
        attackerName: string;
        victimName: string;
        weaponName: string;
        action: "kill" | "knockdown" | "assist" | "Bleed Out" | "Melee";
    }

    interface ApexLegendsGameEventKnockdown {
        victimName: string;
    }

    interface ApexLegendsEventData {
        match_start: string;
        kill_feed: string | ApexLegendsGameEventKillFeed;
        damage: string | ApexLegendsGameEventDamage;
        death: string;
        knocked_out: string | ApexLegendsGameEventKnockdown;
        healed_from_ko: string;
        respawn: string;
        match_end: string;
    }

    // --------------------------------------------------------------------------

    /**
     * All available game info updates. When a new info update is triggered, it's one of these keys.
     */
    enum ApexLegendsGameMode {
        Training = "#PL_TRAINING",
        FiringRange = "#PL_FIRINGRANGE",
        Duos = "#PL_DUO",
        Trio = "#PL_TRIO",
        Ranked = "#PL_Ranked_Leagues",
        ShadowRoyale = "#PL_SHADOWROYALE_MODE",
        DuosLockedAndLoaded = "#PL_TRIO_ACETAKEOVER_LTM",
        TriosLockedAndLoaded = "#PL_TRIO_ACETAKEOVER_LTM",
    }

    enum ApexLegendsLegend {
        Bangalore = "#character_bangalore_NAME",
        Bloodhound = "#character_bloodhound_NAME",
        Caustic = "#character_caustic_NAME",
        Crypto = "#character_crypto_NAME",
        Fuse = "#character_fuse_NAME",
        Gibraltar = "#character_gibraltar_NAME",
        Horizon = "#character_horizon_NAME",
        Lifeline = "#character_lifeline_NAME",
        Loba = "#character_loba_NAME",
        Mirage = "#character_mirage_NAME",
        Octane = "#character_octane_NAME",
        Pathfinder = "#character_pathfinder_NAME",
        Rampart = "#character_rampart_NAME",
        Revenant = "#character_revenant_NAME",
        Wattson = "#character_wattson_NAME",
        Wraith = "#character_wraith_NAME",
    }

    interface ApexLegendsMatchInfoMeUltimateCooldown {
        ultimate_cooldown: string | number;
    }

    interface ApexLegendsMatchInfoMeInventory {
        name: string;
        amount: string | number;
    }

    interface ApexLegendsMatchInfoMeWeapons {
        weapon0: string;
        weapon2: string;
    }

    interface ApexLegendsMatchInfoMeInUse {
        inUse: string;
    }

    interface ApexLegendsMatchInfoMe {
        name?: string;
        totalDamageDealt?: number; // This value may be incorrect!
        ultimate_cooldown?: string | ApexLegendsMatchInfoMeUltimateCooldown;
        inUse?: string | ApexLegendsMatchInfoMeInUse;
        weapons?: string | ApexLegendsMatchInfoMeWeapons;
        inventory_0?: string | ApexLegendsMatchInfoMeInventory;
    }

    interface ApexLegendsMatchInfoTabs {
        kills: number;
        spectators: number;
        teams: number;
        players: number;
        damage: number;
        cash: number;
    }

    interface ApexLegendsMatchInfoLegendSelect {
        playerName: string;
        legendName: ApexLegendsLegend;
        selectionOrder: string | number;
        lead: boolean;
    }

    interface ApexLegendsMatchInfoLocation {
        x: string | number;
        y: string | number;
        z: string | number;
    }

    interface ApexLegendsMatchInfoTeammate {
        name: string;
        state: ApexLegendsPlayerState;
    }

    interface ApexLegendsMatchInfoRoster {
        name: string;
        isTeammate: boolean;
        team_id: number;
        platform_hw: number;
        platform_sw: number;
        state: ApexLegendsPlayerState;
    }

    interface ApexLegendsMatchInfoMatchSummary {
        rank: string | number; // Position active player's squad reached
        teams: string | number; // TODO: Remaining teams? Or starting teams?
        squadKills: string | number;
    }

    interface ApexLegendsMatchInfo {
        pseudo_match_id?: string;
        game_mode?: ApexLegendsGameMode;
        tabs?: ApexLegendsMatchInfoTabs;
        team_info?: "active" | "eliminated";
        match_summary?: string | ApexLegendsMatchInfoMatchSummary;
        location?: string | ApexLegendsMatchInfoLocation;
        victory?: boolean;
        legendSelect_0?: string | ApexLegendsMatchInfoLegendSelect;
        legendSelect_1?: string | ApexLegendsMatchInfoLegendSelect;
        legendSelect_2?: string | ApexLegendsMatchInfoLegendSelect;
        teammate_0?: string | ApexLegendsMatchInfoTeammate;
        teammate_1?: string | ApexLegendsMatchInfoTeammate;
        teammate_2?: string | ApexLegendsMatchInfoTeammate;
        roster_0?: string | ApexLegendsMatchInfoRoster;
    }

    interface ApexLegendsGameInfo {
        name?: string; // Local player name
        match_state?: "active" | "inactive";
    }

    enum ApexLegendsGameInfoKey {
        Death = "death",
        Kill = "kill",
        MatchState = "match_state",
        Me = "me",
        Revive = "revive",
        Team = "team",
        Roster = "roster",
        KillFeed = "kill_feed",
        Rank = "rank",
        MatchSummary = "match_summary",
        Location = "location",
        MatchInfo = "match_info",
        Phase = "phase",
        Victory = "victory",
        Damage = "damage",
        Inventory = "inventory",
    }

    interface ApexLegendsInfoUpdates extends overwolf.games.events.InfoUpdate2 {
        match_info?: ApexLegendsMatchInfo;
        game_info?: ApexLegendsGameInfo;
        me?: ApexLegendsMatchInfoMe;
    }

    // --------------------------------------------------------------------------

    /**
     * Intended to be used with overwolf.games.events.onInfoUpdates2.addListener
     */
    type ApexLegendsGameEvent2Info = overwolf.games.events.InfoUpdates2Event<
        ApexLegendsGameInfoKey | string,
        ApexLegendsInfoUpdates
    >;

    /**
     * Intended to be used with overwolf.games.events.onNewEvents.addListener
     */
    interface ApexLegendsGameEventData {
        name: keyof ApexLegendsEventData;
        data: string | ApexLegendsGameEventKillFeed | ApexLegendsGameEventDamage | ApexLegendsGameEventKnockdown;
    }
    interface ApexLegendsNewGameEvents {
        events: ApexLegendsGameEventData[];
    }
}
