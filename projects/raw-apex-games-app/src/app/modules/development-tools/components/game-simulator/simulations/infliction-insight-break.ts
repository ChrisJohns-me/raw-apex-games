import { v4 as uuid } from "uuid";

export const inflictionInsightBroke = (): string => `
[2022-04-27 10:01:20.004 PM] {"info":{"match_info":{"game_mode":"#PL_Ranked_Leagues"}},"feature":"match_info"}
[2022-04-27 10:01:21.004 PM] {"info":{"match_info":{"location":{"x":"-204","y":"220","z":"22"}}},"feature":"location"}
[2022-04-27 10:01:21.005 PM] {"info":{"match_info":{"roster_4":{"name":"Pharaoh>","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.006 PM] {"info":{"match_info":{"roster_34":{"name":"AntiSoCal707","isTeammate":false,"team_id":6,"platform_hw":10,"platform_sw":10,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.006 PM] {"info":{"match_info":{"roster_42":{"name":"obakeson","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.013 PM] {"info":{"match_info":{"roster_0":{"name":"Komy_slides","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.014 PM] {"info":{"match_info":{"roster_5":{"name":"doctorSKU11","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.014 PM] {"info":{"match_info":{"roster_8":{"name":"Wh1t3shade","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.014 PM] {"info":{"match_info":{"roster_11":{"name":"ArchaicSoda","isTeammate":false,"team_id":15,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.014 PM] {"info":{"match_info":{"roster_13":{"name":"KiloCode","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.014 PM] {"info":{"match_info":{"roster_17":{"name":"Gn6699 On Twitch","isTeammate":false,"team_id":21,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.015 PM] {"info":{"match_info":{"roster_23":{"name":"Leafy","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.015 PM] {"info":{"match_info":{"roster_25":{"name":"Mobulariz","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.015 PM] {"info":{"match_info":{"roster_28":{"name":"KLG InZaneyy","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.015 PM] {"info":{"match_info":{"roster_7":{"name":"OpDandude!LIVE","isTeammate":false,"team_id":12,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.015 PM] {"info":{"match_info":{"roster_30":{"name":"Smash_247","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.015 PM] {"info":{"match_info":{"roster_32":{"name":"TemperEaston","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.016 PM] {"info":{"match_info":{"roster_33":{"name":"DboomsTheGoon","isTeammate":false,"team_id":5,"platform_hw":8,"platform_sw":8,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.016 PM] {"info":{"match_info":{"roster_37":{"name":"YaakovAZ","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.016 PM] {"info":{"match_info":{"roster_45":{"name":"sai","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.016 PM] {"info":{"match_info":{"roster_47":{"name":"SMD","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.016 PM] {"info":{"match_info":{"roster_48":{"name":"BroDude","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.016 PM] {"info":{"match_info":{"roster_49":{"name":"yeejablwm","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.017 PM] {"info":{"match_info":{"roster_51":{"name":"☾✝☽","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.017 PM] {"info":{"match_info":{"roster_52":{"name":"I_Love_Chun-Li","isTeammate":false,"team_id":12,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.017 PM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"respawn"}}},"feature":"team"}
[2022-04-27 10:01:21.018 PM] {"info":{"match_info":{"roster_53":{"name":"MasterKriff","isTeammate":true,"team_id":9,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"1"}}},"feature":"roster"}
[2022-04-27 10:01:21.018 PM] {"info":{"match_info":{"roster_50":{"name":"Ira DEO","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.077 PM] {"info":{"match_info":{"roster_1":{"name":"Wizzywong14","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.078 PM] {"info":{"match_info":{"roster_12":{"name":"ascoggins38","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.078 PM] {"info":{"match_info":{"roster_18":{"name":"One Piece>","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.078 PM] {"info":{"match_info":{"roster_10":{"name":"Jacket","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.078 PM] {"info":{"match_info":{"roster_22":{"name":"BrownKobe","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.079 PM] {"info":{"match_info":{"roster_29":{"name":"KBoom71","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.079 PM] {"info":{"match_info":{"roster_35":{"name":"Tsunades Boobs","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.079 PM] {"info":{"match_info":{"roster_38":{"name":"chicky nuggies","isTeammate":false,"team_id":19,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.079 PM] {"info":{"match_info":{"roster_40":{"name":"crazyegypt15","isTeammate":false,"team_id":21,"platform_hw":10,"platform_sw":10,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.079 PM] {"info":{"match_info":{"roster_44":{"name":"pshidenori","isTeammate":false,"team_id":4,"platform_hw":8,"platform_sw":8,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.079 PM] {"info":{"match_info":{"roster_54":{"name":"GooFy","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.080 PM] {"info":{"match_info":{"roster_56":{"name":"BluSteel","isTeammate":false,"team_id":6,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.080 PM] {"info":{"match_info":{"roster_59":{"name":"FlyBinx","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.123 PM] {"info":{"match_info":{"roster_2":{"name":"JasonPAGS","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.123 PM] {"info":{"match_info":{"roster_16":{"name":"Kroleez","isTeammate":false,"team_id":21,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.123 PM] {"info":{"match_info":{"roster_20":{"name":"Average","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.123 PM] {"info":{"match_info":{"roster_21":{"name":"Fizzzzelll","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.124 PM] {"info":{"match_info":{"roster_9":{"name":"MysteryRival","isTeammate":false,"team_id":19,"platform_hw":1,"platform_sw":1,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.124 PM] {"info":{"match_info":{"teammate_1":{"name":"Akaza3k","state":"respawn"}}},"feature":"team"}
[2022-04-27 10:01:21.124 PM] {"info":{"match_info":{"roster_31":{"name":"Akaza3k","isTeammate":true,"team_id":9,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.125 PM] {"info":{"match_info":{"roster_36":{"name":"MikeMote","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.125 PM] {"info":{"match_info":{"roster_14":{"name":"sprinkle94","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.125 PM] {"info":{"match_info":{"roster_15":{"name":"Bowltrix","isTeammate":false,"team_id":15,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.126 PM] {"info":{"match_info":{"roster_43":{"name":"GamerGurl","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.126 PM] {"info":{"match_info":{"roster_41":{"name":"Entree","isTeammate":false,"team_id":13,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.126 PM] {"info":{"match_info":{"roster_55":{"name":"RG_KNUCKS","isTeammate":false,"team_id":13,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.126 PM] {"info":{"match_info":{"roster_57":{"name":"IFB-tobi","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.126 PM] {"info":{"match_info":{"roster_46":{"name":"asiannoodles","isTeammate":false,"team_id":19,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.132 PM] {"info":{"match_info":{"roster_3":{"name":"poppyV3","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.133 PM] {"info":{"match_info":{"roster_26":{"name":"Boominati Booga Boy","isTeammate":false,"team_id":13,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.134 PM] {"info":{"match_info":{"roster_24":{"name":"The925killer","isTeammate":false,"team_id":6,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.135 PM] {"info":{"match_info":{"roster_27":{"name":"Geekguy0126","isTeammate":false,"team_id":12,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.136 PM] {"info":{"match_info":{"roster_6":{"name":"xSPB RAIDERS","isTeammate":false,"team_id":2,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.137 PM] {"info":{"match_info":{"teammate_2":{"name":"OG_LOBO24","state":"respawn"}}},"feature":"team"}
[2022-04-27 10:01:21.138 PM] {"info":{"match_info":{"roster_58":{"name":"OG_LOBO24","isTeammate":true,"team_id":9,"platform_hw":1,"platform_sw":1,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.139 PM] {"info":{"match_info":{"roster_19":{"name":"Poopballs69","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:21.140 PM] {"info":{"match_info":{"roster_39":{"name":"babyjessyyy","isTeammate":false,"team_id":15,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:22.200 PM] {"info":{"match_info":{"legendSelect_0":{"playerName":"Akaza3k","legendName":"#character_valkyrie_NAME","selectionOrder":"0","lead":true}}},"feature":"team"}
[2022-04-27 10:01:22.400 PM] {"info":{"match_info":{"legendSelect_0":{"playerName":"Akaza3k","legendName":"#character_valkyrie_NAME","selectionOrder":"0","lead":false}}},"feature":"team"}
[2022-04-27 10:01:22.600 PM] {"info":{"match_info":{"legendSelect_1":{"playerName":"OG_LOBO24","legendName":"#character_gibraltar_NAME","selectionOrder":"1","lead":true}}},"feature":"team"}
[2022-04-27 10:01:22.800 PM] {"info":{"match_info":{"legendSelect_1":{"playerName":"OG_LOBO24","legendName":"#character_gibraltar_NAME","selectionOrder":"1","lead":false}}},"feature":"team"}
[2022-04-27 10:01:23.200 PM] {"info":{"match_info":{"legendSelect_2":{"playerName":"MasterKriff","legendName":"#character_bangalore_NAME","selectionOrder":"2","lead":true}}},"feature":"team"}
[2022-04-27 10:01:24.000 PM] {"info":{"match_info":{"location":{"x":"96","y":"-324","z":"32"}}},"feature":"location"}
[2022-04-27 10:01:24.400 PM] {"info":{"match_info":{"pseudo_match_id":"${uuid()}"}},"feature":"match_info"}
[2022-04-27 10:01:24.600 PM] {"info":{"match_info":{"team_info":{"team_state":"active"}}},"feature":"team"}
[2022-04-27 10:01:25.000 PM] {"name":"match_start","data":null}
[2022-04-27 10:01:25.500 PM] {"info":{"game_info":{"match_state":"active"}},"feature":"match_state"}
[2022-04-27 10:01:25.505 PM] {"info":{"match_info":{"victory":null}},"feature":"rank"}
[2022-04-27 10:01:25.510 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":20,"players":60,"damage":0,"cash":0}}},"feature":"match_info"}
[2022-04-27 10:01:25.515 PM] {"info":{"me":{"totalDamageDealt":"0"}},"feature":"damage"}
[2022-04-27 10:01:25.520 PM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2022-04-27 10:01:25.525 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-27 10:01:25.550 PM] {"info":{"me":{"inventory_0":{"name":"unknown_167","amount":"2"}}},"feature":"inventory"}
[2022-04-27 10:01:25.555 PM] {"info":{"me":{"inventory_1":{"name":"unknown_165","amount":"2"}}},"feature":"inventory"}
[2022-04-27 10:01:26.000 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-27 10:01:26.010 PM] {"info":{"match_info":{"location":{"x":"-490","y":"25","z":"234"}}},"feature":"location"}
[2022-04-27 10:01:26.020 PM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2022-04-27 10:01:26.030 PM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2022-04-27 10:01:26.040 PM] {"info":{"match_info":{"location":{"x":"-480","y":"25","z":"234"}}},"feature":"location"}
[2022-04-27 10:01:26.050 PM] {"info":{"match_info":{"location":{"x":"-460","y":"24","z":"234"}}},"feature":"location"}
[2022-04-27 10:01:26.060 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"5"}}},"feature":"me"}
[2022-04-27 10:01:26.070 PM] {"info":{"match_info":{"location":{"x":"-310","y":"18","z":"234"}}},"feature":"location"}
[2022-04-27 10:01:26.080 PM] {"info":{"match_info":{"location":{"x":"-151","y":"12","z":"234"}}},"feature":"location"}
[2022-04-27 10:01:26.090 PM] {"info":{"me":{"inventory_0":{"name":"unknown_167","amount":"2"}}},"feature":"inventory"}
[2022-04-27 10:01:26.100 PM] {"info":{"me":{"inventory_1":{"name":"unknown_165","amount":"2"}}},"feature":"inventory"}
[2022-04-27 10:01:26.110 PM] {"info":{"match_info":{"location":{"x":"-143","y":"11","z":"231"}}},"feature":"location"}
[2022-04-27 10:01:26.120 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"10"}}},"feature":"me"}
[2022-04-27 10:01:26.130 PM] {"info":{"match_info":{"location":{"x":"-138","y":"8","z":"228"}}},"feature":"location"}
[2022-04-27 10:01:26.140 PM] {"info":{"match_info":{"location":{"x":"-87","y":"-61","z":"171"}}},"feature":"location"}
[2022-04-27 10:01:26.150 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"15"}}},"feature":"me"}
[2022-04-27 10:01:26.160 PM] {"info":{"match_info":{"location":{"x":"-83","y":"-66","z":"168"}}},"feature":"location"}
[2022-04-27 10:01:26.170 PM] {"info":{"match_info":{"location":{"x":"-31","y":"-142","z":"122"}}},"feature":"location"}
[2022-04-27 10:01:26.180 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"20"}}},"feature":"me"}
[2022-04-27 10:01:26.190 PM] {"info":{"match_info":{"location":{"x":"-28","y":"-147","z":"120"}}},"feature":"location"}
[2022-04-27 10:01:26.200 PM] {"info":{"match_info":{"location":{"x":"17","y":"-226","z":"77"}}},"feature":"location"}
[2022-04-27 10:01:26.210 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"25"}}},"feature":"me"}
[2022-04-27 10:01:26.220 PM] {"info":{"match_info":{"location":{"x":"20","y":"-231","z":"75"}}},"feature":"location"}
[2022-04-27 10:01:26.230 PM] {"info":{"match_info":{"location":{"x":"55","y":"-311","z":"41"}}},"feature":"location"}
[2022-04-27 10:01:26.240 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"30"}}},"feature":"me"}
[2022-04-27 10:01:26.250 PM] {"info":{"match_info":{"location":{"x":"57","y":"-314","z":"39"}}},"feature":"location"}
[2022-04-27 10:01:26.260 PM] {"info":{"match_info":{"location":{"x":"60","y":"-314","z":"37"}}},"feature":"location"}
[2022-04-27 10:01:26.270 PM] {"info":{"match_info":{"location":{"x":"63","y":"-314","z":"35"}}},"feature":"location"}
[2022-04-27 10:01:26.280 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"80"}}},"feature":"me"}
[2022-04-27 10:01:26.290 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-27 10:01:26.300 PM] {"info":{"match_info":{"location":{"x":"65","y":"-313","z":"32"}}},"feature":"location"}
[2022-04-27 10:01:26.350 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[ZONE] Fizzzzelll","victimName":"[ABG] I_Love_Chun-Li","weaponName":null,"action":"knockdown"}}
[2022-04-27 10:01:26.310 PM] {"info":{"match_info":{"location":{"x":"65","y":"-327","z":"32"}}},"feature":"location"}
[2022-04-27 10:01:26.320 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"5"}}},"feature":"me"}
[2022-04-27 10:01:27.000 PM] {"name":"damage","data":{"targetName":"OpDandude!LIVE","damageAmount":"19.000000","armor":false,"headshot":false}}
[2022-04-27 10:01:27.500 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[ZONE] Fizzzzelll","victimName":"[ABG] I_Love_Chun-Li","weaponName":"wingman","action":"headshot_kill"}}
[2022-04-27 10:01:28.000 PM] {"name":"damage","data":{"targetName":"OpDandude!LIVE","damageAmount":"19.000000","armor":false,"headshot":false}}
[2022-04-27 10:01:28.211 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":"[OPN] OpDandude!LIVE","weaponName":"dragon","action":"knockdown"}}
[2022-04-27 10:01:28.214 PM] {"name":"knockdown","data":{"victimName":"\`1[OPN] OpDandude!LIVE\n"}}
[2022-04-27 10:01:33.000 PM] {"info":{"match_info":{"teammate_2":{"name":"OG_LOBO24","state":"knocked_out"}}},"feature":"team"}
[2022-04-27 10:01:33.001 PM] {"info":{"match_info":{"roster_58":{"name":"OG_LOBO24","isTeammate":true,"team_id":9,"platform_hw":1,"platform_sw":1,"state":"knocked_out","is_local":"0"}}},"feature":"roster"}
[2022-04-27 10:01:33.262 PM] {"name":"damage","data":{"targetName":"Geekguy0126","damageAmount":"11.000000","armor":false,"headshot":false}}
[2022-04-27 10:01:33.320 PM] {"name":"damage","data":{"targetName":"Geekguy0126","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-27 10:01:33.518 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":"[OPN] OpDandude!LIVE","weaponName":null,"action":"kill"}}
[2022-04-27 10:01:33.528 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":"[OPN] Geekguy0126","weaponName":"r301","action":"kill"}}
[2022-04-27 10:01:33.529 PM] {"name":"kill","data":{"victimName":"\`1[OPN] Geekguy0126"}}
[2022-04-27 10:01:34.002 PM] {"name":"kill","data":{"victimName":"\`1[OPN] OpDandude!LIVE"}}
`;
