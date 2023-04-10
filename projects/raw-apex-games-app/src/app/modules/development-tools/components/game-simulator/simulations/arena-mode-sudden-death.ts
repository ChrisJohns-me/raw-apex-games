import { v4 as uuid } from "uuid";

export const arenaModeSuddenDeath = (): string =>
    matchStart +
    round1 + // Lose
    round2 + // Lose
    round3 + // Win
    round4 + // Win
    round5 + // Lose
    round6 + // Win
    round7 + // Win
    round8 + // Lose
    round9 + // Win
    matchEnd;

const matchStart = `
[2021-06-18 02:18:02.000 AM] {"info":{"match_info":{"game_mode":"#GAMEMODE_ARENAS"}},"feature":"match_info"}
[2021-06-18 02:18:02.938 AM] {"info":{"match_info":{"roster_0":{"name":"MasterKriff","isTeammate":true,"team_id":3,"platform_hw":2,"platform_sw":7,"state":"alive"}}},"feature":"roster"}
[2021-06-18 02:18:02.957 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"alive"}}},"feature":"team"}
[2021-06-18 02:18:02.987 AM] {"info":{"match_info":{"roster_1":{"name":"?.?.操你?.?","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-06-18 02:18:03.515 AM] {"info":{"match_info":{"roster_2":{"name":"PhantomNicky_","isTeammate":false,"team_id":2,"platform_hw":1,"platform_sw":1}}},"feature":"roster"}
[2021-06-18 02:18:03.943 AM] {"info":{"match_info":{"roster_3":{"name":"Phantom_Lio","isTeammate":false,"team_id":2,"platform_hw":1,"platform_sw":1}}},"feature":"roster"}
[2021-06-18 02:18:04.008 AM] {"info":{"match_info":{"teammate_1":{"name":"Decimal Duck","state":"alive"}}},"feature":"team"}
[2021-06-18 02:18:04.027 AM] {"info":{"match_info":{"roster_4":{"name":"Decimal Duck","isTeammate":true,"team_id":3,"platform_hw":2,"platform_sw":7,"state":"alive"}}},"feature":"roster"}
[2021-06-18 02:18:04.671 AM] {"info":{"match_info":{"roster_5":{"name":"ShironJackal","isTeammate":true,"team_id":3,"platform_hw":2,"platform_sw":7,"state":"alive"}}},"feature":"roster"}
[2021-06-18 02:18:04.689 AM] {"info":{"match_info":{"teammate_2":{"name":"ShironJackal","state":"alive"}}},"feature":"team"}
[2021-06-18 02:18:21.753 AM] {"info":{"match_info":{"legendSelect_0":{"playerName":"[Quak] Decimal Duck","legendName":"#character_horizon_NAME","selectionOrder":"0","lead":false}}},"feature":"team"}
[2021-06-18 02:18:29.252 AM] {"info":{"match_info":{"legendSelect_1":{"playerName":"[PeX] ShironJackal","legendName":"#character_fuse_NAME","selectionOrder":"1","lead":false}}},"feature":"team"}
[2021-06-18 02:18:30.248 AM] {"info":{"match_info":{"legendSelect_2":{"playerName":"[AllF] MasterKriff","legendName":"#character_wattson_NAME","selectionOrder":"2","lead":true}}},"feature":"team"}
[2021-06-18 02:19:00.295 AM] {"info":{"match_info":{"pseudo_match_id":"${uuid()}"}},"feature":"match_info"}
[2021-06-18 02:19:00.327 AM] {"info":{"game_info":{"match_state":"active"}},"feature":"match_state"}
[2021-06-18 02:19:00.345 AM] {"name":"match_start","data":null}
[2021-06-18 02:19:00.369 AM] {"info":{"match_info":{"team_info":{"team_state":"active"}}},"feature":"team"}
[2021-06-18 02:19:00.393 AM] {"info":{"match_info":{"location":{"x":"18","y":"-40","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:00.412 AM] {"info":{"me":{"totalDamageDealt":"0"}},"feature":"damage"}
[2021-06-18 02:19:00.433 AM] {"info":{"me":{"weapons":{"weapon0":"P2020"}}},"feature":"inventory"}
[2021-06-18 02:19:00.458 AM] {"info":{"me":{"inUse":{"inUse":"Melee"}}},"feature":"inventory"}
[2021-06-18 02:19:00.478 AM] {"info":{"me":{"inventory_0":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-06-18 02:19:00.498 AM] {"info":{"me":{"inventory_1":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-06-18 02:19:00.518 AM] {"info":{"match_info":{"victory":null}},"feature":"rank"}
[2021-06-18 02:19:00.832 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":0}}},"feature":"match_info"}`;

const round1 = `
[2021-06-18 02:19:11.343 AM] {"info":{"me":{"weapons":{"weapon0":"P2020","weapon1":"RE-45 Auto"}}},"feature":"inventory"}
[2021-06-18 02:19:13.534 AM] {"info":{"me":{"inUse":{"inUse":"P2020"}}},"feature":"inventory"}
[2021-06-18 02:19:20.796 AM] {"info":{"match_info":{"location":{"x":"18","y":"-39","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:21.774 AM] {"info":{"match_info":{"location":{"x":"17","y":"-38","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:22.265 AM] {"info":{"match_info":{"location":{"x":"17","y":"-37","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:23.268 AM] {"info":{"match_info":{"location":{"x":"17","y":"-36","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:24.271 AM] {"info":{"match_info":{"location":{"x":"17","y":"-35","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:24.583 AM] {"info":{"me":{"inUse":{"inUse":"Melee"}}},"feature":"inventory"}
[2021-06-18 02:19:24.773 AM] {"info":{"match_info":{"location":{"x":"17","y":"-34","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:25.271 AM] {"info":{"match_info":{"location":{"x":"17","y":"-33","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:25.772 AM] {"info":{"match_info":{"location":{"x":"17","y":"-31","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:25.805 AM] {"info":{"me":{"inventory_0":{"name":"130","amount":"240"}}},"feature":"inventory"}
[2021-06-18 02:19:25.829 AM] {"info":{"me":{"inventory_1":{"name":"130","amount":"60"}}},"feature":"inventory"}
[2021-06-18 02:19:25.849 AM] {"info":{"me":{"inventory_2":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-06-18 02:19:25.867 AM] {"info":{"me":{"inventory_3":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-06-18 02:19:26.262 AM] {"info":{"match_info":{"location":{"x":"17","y":"-30","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:26.766 AM] {"info":{"match_info":{"location":{"x":"17","y":"-29","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:27.269 AM] {"info":{"match_info":{"location":{"x":"17","y":"-27","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:27.766 AM] {"info":{"match_info":{"location":{"x":"18","y":"-25","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:28.263 AM] {"info":{"match_info":{"location":{"x":"18","y":"-24","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:28.764 AM] {"info":{"match_info":{"location":{"x":"18","y":"-22","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:29.265 AM] {"info":{"match_info":{"location":{"x":"18","y":"-21","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:29.771 AM] {"info":{"match_info":{"location":{"x":"19","y":"-19","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:30.265 AM] {"info":{"match_info":{"location":{"x":"19","y":"-18","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:30.772 AM] {"info":{"match_info":{"location":{"x":"19","y":"-16","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:31.262 AM] {"info":{"match_info":{"location":{"x":"19","y":"-14","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:31.771 AM] {"info":{"match_info":{"location":{"x":"19","y":"-13","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:32.265 AM] {"info":{"match_info":{"location":{"x":"20","y":"-11","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:32.764 AM] {"info":{"match_info":{"location":{"x":"20","y":"-10","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:33.265 AM] {"info":{"match_info":{"location":{"x":"21","y":"-9","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:33.770 AM] {"info":{"match_info":{"location":{"x":"21","y":"-7","z":"8"}}},"feature":"location"}
[2021-06-18 02:19:34.269 AM] {"info":{"match_info":{"location":{"x":"22","y":"-6","z":"8"}}},"feature":"location"}
[2021-06-18 02:19:34.767 AM] {"info":{"match_info":{"location":{"x":"22","y":"-4","z":"8"}}},"feature":"location"}
[2021-06-18 02:19:35.161 AM] {"info":{"me":{"inUse":{"inUse":"P2020"}}},"feature":"inventory"}
[2021-06-18 02:19:35.262 AM] {"info":{"match_info":{"location":{"x":"21","y":"-3","z":"8"}}},"feature":"location"}
[2021-06-18 02:19:35.763 AM] {"info":{"match_info":{"location":{"x":"21","y":"-2","z":"8"}}},"feature":"location"}
[2021-06-18 02:19:36.267 AM] {"info":{"match_info":{"location":{"x":"20","y":"0","z":"8"}}},"feature":"location"}
[2021-06-18 02:19:36.768 AM] {"info":{"match_info":{"location":{"x":"20","y":"1","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:37.263 AM] {"info":{"match_info":{"location":{"x":"19","y":"2","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:37.769 AM] {"info":{"match_info":{"location":{"x":"19","y":"4","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:38.266 AM] {"info":{"match_info":{"location":{"x":"19","y":"5","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:38.769 AM] {"info":{"match_info":{"location":{"x":"19","y":"6","z":"5"}}},"feature":"location"}
[2021-06-18 02:19:39.273 AM] {"info":{"match_info":{"location":{"x":"19","y":"7","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:39.771 AM] {"info":{"match_info":{"location":{"x":"19","y":"8","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:40.269 AM] {"info":{"match_info":{"location":{"x":"19","y":"7","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:40.394 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"18.000000","armor":true,"headshot":false}}
[2021-06-18 02:19:40.414 AM] {"info":{"me":{"totalDamageDealt":"18"}},"feature":"damage"}
[2021-06-18 02:19:40.538 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"18.000000","armor":true,"headshot":false}}
[2021-06-18 02:19:40.562 AM] {"info":{"me":{"totalDamageDealt":"36"}},"feature":"damage"}
[2021-06-18 02:19:40.774 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":36}}},"feature":"match_info"}
[2021-06-18 02:19:40.804 AM] {"info":{"match_info":{"location":{"x":"20","y":"8","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:42.266 AM] {"info":{"match_info":{"location":{"x":"20","y":"9","z":"6"}}},"feature":"location"}
[2021-06-18 02:19:42.774 AM] {"info":{"match_info":{"location":{"x":"20","y":"9","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:43.269 AM] {"info":{"match_info":{"location":{"x":"19","y":"10","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:43.773 AM] {"info":{"match_info":{"location":{"x":"18","y":"11","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:43.993 AM] {"info":{"me":{"inventory_1":{"name":"130","amount":"51"}}},"feature":"inventory"}
[2021-06-18 02:19:44.270 AM] {"info":{"match_info":{"location":{"x":"16","y":"11","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:44.763 AM] {"info":{"match_info":{"location":{"x":"15","y":"12","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:45.305 AM] {"info":{"me":{"inUse":{"inUse":"RE-45 Auto"}}},"feature":"inventory"}
[2021-06-18 02:19:45.731 AM] {"info":{"me":{"inventory_2":{"name":"137","amount":"1"}}},"feature":"inventory"}
[2021-06-18 02:19:45.760 AM] {"info":{"me":{"inventory_3":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-06-18 02:19:45.785 AM] {"info":{"me":{"inventory_4":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-06-18 02:19:45.819 AM] {"info":{"match_info":{"location":{"x":"15","y":"13","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:45.929 AM] {"info":{"me":{"inventory_3":{"name":"140","amount":"1"}}},"feature":"inventory"}
[2021-06-18 02:19:45.953 AM] {"info":{"me":{"inventory_5":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-06-18 02:19:45.973 AM] {"info":{"me":{"inventory_4":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-06-18 02:19:46.266 AM] {"info":{"match_info":{"location":{"x":"15","y":"14","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:47.270 AM] {"info":{"match_info":{"location":{"x":"16","y":"15","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:47.768 AM] {"info":{"match_info":{"location":{"x":"18","y":"16","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:48.767 AM] {"info":{"match_info":{"location":{"x":"19","y":"17","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:49.273 AM] {"info":{"match_info":{"location":{"x":"20","y":"18","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:49.771 AM] {"info":{"match_info":{"location":{"x":"19","y":"17","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:50.264 AM] {"info":{"match_info":{"location":{"x":"18","y":"17","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:50.771 AM] {"info":{"match_info":{"location":{"x":"17","y":"16","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:51.263 AM] {"info":{"match_info":{"location":{"x":"15","y":"15","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:51.725 AM] {"info":{"me":{"inventory_3":{"name":"140","amount":"2"}}},"feature":"inventory"}
[2021-06-18 02:19:51.767 AM] {"info":{"match_info":{"location":{"x":"15","y":"14","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:52.770 AM] {"info":{"match_info":{"location":{"x":"16","y":"14","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:53.269 AM] {"info":{"match_info":{"location":{"x":"17","y":"15","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:53.762 AM] {"info":{"match_info":{"location":{"x":"18","y":"16","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:54.269 AM] {"info":{"match_info":{"location":{"x":"19","y":"17","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:54.768 AM] {"info":{"match_info":{"location":{"x":"19","y":"18","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:55.274 AM] {"info":{"match_info":{"location":{"x":"20","y":"19","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:55.769 AM] {"info":{"match_info":{"location":{"x":"19","y":"20","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:56.264 AM] {"info":{"match_info":{"location":{"x":"19","y":"21","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:56.763 AM] {"info":{"match_info":{"location":{"x":"20","y":"21","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:56.834 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"12.000000","armor":true,"headshot":false}}
[2021-06-18 02:19:56.862 AM] {"info":{"me":{"totalDamageDealt":"48"}},"feature":"damage"}
[2021-06-18 02:19:57.255 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":48}}},"feature":"match_info"}
[2021-06-18 02:19:57.285 AM] {"info":{"match_info":{"location":{"x":"20","y":"20","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:57.484 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"11.000000","armor":true,"headshot":false}}
[2021-06-18 02:19:57.507 AM] {"info":{"me":{"totalDamageDealt":"59"}},"feature":"damage"}
[2021-06-18 02:19:57.636 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"12.000000","armor":true,"headshot":false}}
[2021-06-18 02:19:57.659 AM] {"info":{"me":{"totalDamageDealt":"71"}},"feature":"damage"}
[2021-06-18 02:19:57.749 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":71}}},"feature":"match_info"}
[2021-06-18 02:19:57.781 AM] {"info":{"match_info":{"location":{"x":"19","y":"20","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:58.273 AM] {"info":{"match_info":{"location":{"x":"18","y":"21","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:59.270 AM] {"info":{"match_info":{"location":{"x":"19","y":"21","z":"7"}}},"feature":"location"}
[2021-06-18 02:19:59.389 AM] {"info":{"me":{"inventory_1":{"name":"130","amount":"35"}}},"feature":"inventory"}
[2021-06-18 02:20:00.271 AM] {"info":{"match_info":{"location":{"x":"19","y":"20","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:01.271 AM] {"info":{"match_info":{"location":{"x":"20","y":"21","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:01.764 AM] {"info":{"match_info":{"location":{"x":"20","y":"22","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:02.201 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_tesla_trap"}}},"feature":"inventory"}
[2021-06-18 02:20:02.269 AM] {"info":{"match_info":{"location":{"x":"20","y":"23","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:02.773 AM] {"info":{"match_info":{"location":{"x":"20","y":"24","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:03.267 AM] {"info":{"match_info":{"location":{"x":"21","y":"24","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:03.768 AM] {"info":{"match_info":{"location":{"x":"22","y":"24","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:04.138 AM] {"info":{"me":{"inUse":{"inUse":"RE-45 Auto"}}},"feature":"inventory"}
[2021-06-18 02:20:04.273 AM] {"info":{"match_info":{"location":{"x":"22","y":"25","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:04.772 AM] {"info":{"match_info":{"location":{"x":"23","y":"26","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:05.769 AM] {"info":{"match_info":{"location":{"x":"24","y":"27","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:06.191 AM] {"info":{"me":{"inventory_1":{"name":"130","amount":"30"}}},"feature":"inventory"}
[2021-06-18 02:20:07.644 AM] {"info":{"me":{"inUse":{"inUse":"Health/Shield"}}},"feature":"inventory"}
[2021-06-18 02:20:08.770 AM] {"info":{"match_info":{"location":{"x":"25","y":"27","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:10.758 AM] {"name":"kill_feed","data":{"attackerName":"[Quak] Decimal Duck","victimName":"[BRO] PhantomNicky_","weaponName":"Melee","action":"Melee"}}
[2021-06-18 02:20:12.654 AM] {"name":"knocked_out","data":null}
[2021-06-18 02:20:12.693 AM] {"info":{"me":{"inUse":{"inUse":"Knockdown Shield"}}},"feature":"inventory"}
[2021-06-18 02:20:12.718 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"knockedout"}}},"feature":"team"}
[2021-06-18 02:20:12.740 AM] {"info":{"match_info":{"roster_0":{"name":"MasterKriff","isTeammate":true,"team_id":3,"platform_hw":2,"platform_sw":7,"state":"knockedout"}}},"feature":"roster"}
[2021-06-18 02:20:12.775 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Phantom_Lio","victimName":"[AllF] MasterKriff","weaponName":"p2020","action":"knockdown"}}
[2021-06-18 02:20:16.318 AM] {"info":{"match_info":{"teammate_2":{"name":"ShironJackal","state":"knockedout"}}},"feature":"team"}
[2021-06-18 02:20:16.354 AM] {"info":{"match_info":{"roster_5":{"name":"ShironJackal","isTeammate":true,"team_id":3,"platform_hw":2,"platform_sw":7,"state":"knockedout"}}},"feature":"roster"}
[2021-06-18 02:20:16.753 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] ?.?.操你?.?","victimName":"[PeX] ShironJackal","weaponName":"lstar","action":"knockdown"}}
[2021-06-18 02:20:17.770 AM] {"info":{"match_info":{"location":{"x":"25","y":"26","z":"7"}}},"feature":"location"}
[2021-06-18 02:20:23.417 AM] {"info":{"match_info":{"team_info":{"team_state":"eliminated"}}},"feature":"team"}
[2021-06-18 02:20:23.442 AM] {"info":{"match_info":{"victory":false}},"feature":"rank"}
[2021-06-18 02:20:23.474 AM] {"info":{"match_info":{"teammate_1":{"name":"Decimal Duck","state":"dead"}}},"feature":"team"}
[2021-06-18 02:20:23.503 AM] {"info":{"match_info":{"roster_4":{"name":"Decimal Duck","isTeammate":true,"team_id":3,"platform_hw":2,"platform_sw":7,"state":"dead"}}},"feature":"roster"}
[2021-06-18 02:20:23.526 AM] {"name":"death","data":null}
[2021-06-18 02:20:23.753 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Phantom_Lio","victimName":"[Quak] Decimal Duck","weaponName":"p2020","action":"kill"}}
[2021-06-18 02:20:23.777 AM] {"name":"kill_feed","data":{"attackerName":" Phantom_Lio","victimName":"[AllF] MasterKriff","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-06-18 02:20:24.258 AM] {"name":"kill_feed","data":{"attackerName":"[BRO] ?.?.操你?.?","victimName":"[PeX] ShironJackal","weaponName":"Bleed Out","action":"Bleed Out"}}`;

const round2 = `
[2021-06-18 02:20:29.795 AM] {"name":"respawn","data":null}
[2021-06-18 02:20:37.779 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2021-06-18 02:21:29.235 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"70.000000","armor":false,"headshot":false}}
[2021-06-18 02:21:29.266 AM] {"info":{"me":{"totalDamageDealt":"141"}},"feature":"damage"}
[2021-06-18 02:21:29.289 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":141}}},"feature":"match_info"}
[2021-06-18 02:21:35.252 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] PhantomNicky_","victimName":"[Quak] Decimal Duck","weaponName":"mozambique","action":"knockdown"}}
[2021-06-18 02:21:39.258 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2021-06-18 02:21:43.750 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] PhantomNicky_","victimName":"[Quak] Decimal Duck","weaponName":"r97","action":"kill"}}
[2021-06-18 02:21:46.249 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Phantom_Lio","victimName":"[PeX] ShironJackal","weaponName":"g7","action":"knockdown"}}
[2021-06-18 02:21:46.989 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"75.000000","armor":true,"headshot":true}}
[2021-06-18 02:21:47.023 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"1.000000","armor":false,"headshot":true}}
[2021-06-18 02:21:47.052 AM] {"info":{"me":{"totalDamageDealt":"216"}},"feature":"damage"}
[2021-06-18 02:21:47.076 AM] {"info":{"me":{"totalDamageDealt":"217"}},"feature":"damage"}
[2021-06-18 02:21:47.249 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":217}}},"feature":"match_info"}
[2021-06-18 02:21:52.737 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"45.000000","armor":false,"headshot":false}}
[2021-06-18 02:21:52.773 AM] {"info":{"me":{"totalDamageDealt":"262"}},"feature":"damage"}
[2021-06-18 02:21:52.797 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":262}}},"feature":"match_info"}
[2021-06-18 02:22:01.754 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] ?.?.操你?.?","victimName":"[PeX] ShironJackal","weaponName":"r97","action":"knockdown"}}
[2021-06-18 02:22:04.382 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"54.000000","armor":true,"headshot":true}}
[2021-06-18 02:22:04.405 AM] {"info":{"me":{"totalDamageDealt":"316"}},"feature":"damage"}
[2021-06-18 02:22:04.428 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"11.000000","armor":false,"headshot":true}}
[2021-06-18 02:22:04.460 AM] {"info":{"me":{"totalDamageDealt":"327"}},"feature":"damage"}
[2021-06-18 02:22:04.756 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":327}}},"feature":"match_info"}
[2021-06-18 02:22:04.836 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"1.000000","armor":true,"headshot":false}}
[2021-06-18 02:22:04.859 AM] {"info":{"me":{"totalDamageDealt":"328"}},"feature":"damage"}
[2021-06-18 02:22:04.882 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"37.000000","armor":false,"headshot":false}}
[2021-06-18 02:22:04.906 AM] {"info":{"me":{"totalDamageDealt":"365"}},"feature":"damage"}
[2021-06-18 02:22:05.260 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":365}}},"feature":"match_info"}
[2021-06-18 02:22:06.245 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"2.000000","armor":false,"headshot":false}}
[2021-06-18 02:22:06.280 AM] {"info":{"me":{"totalDamageDealt":"367"}},"feature":"damage"}
[2021-06-18 02:22:06.304 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"24.000000","armor":false,"headshot":false}}
[2021-06-18 02:22:06.333 AM] {"info":{"me":{"totalDamageDealt":"391"}},"feature":"damage"}
[2021-06-18 02:22:06.356 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":370}}},"feature":"match_info"}
[2021-06-18 02:22:06.754 AM] {"name":"knockdown","data":{"victimName":"[BRO] ?.?.操你?.?\n"}}
[2021-06-18 02:22:06.782 AM] {"name":"kill_feed","data":{"attackerName":"[AllF] MasterKriff","victimName":"[BRO] ?.?.操你?.?","weaponName":"Melee","action":"Melee"}}
[2021-06-18 02:22:10.638 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"45.000000","armor":true,"headshot":false}}
[2021-06-18 02:22:10.675 AM] {"info":{"me":{"totalDamageDealt":"436"}},"feature":"damage"}
[2021-06-18 02:22:10.752 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":415}}},"feature":"match_info"}
[2021-06-18 02:22:13.278 AM] {"name":"death","data":null}
[2021-06-18 02:22:13.755 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] PhantomNicky_","victimName":"[AllF] MasterKriff","weaponName":"mozambique","action":"headshot_kill"}}
[2021-06-18 02:22:13.789 AM] {"name":"kill_feed","data":{"attackerName":"[BRO] ?.?.操你?.?","victimName":"[PeX] ShironJackal","weaponName":"Bleed Out","action":"Bleed Out"}}`;

const round3 = `
[2021-06-18 02:22:19.602 AM] {"name":"respawn","data":null}
[2021-06-18 02:22:35.752 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2021-06-18 02:23:25.751 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":431}}},"feature":"match_info"}
[2021-06-18 02:23:57.088 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:23:57.120 AM] {"info":{"me":{"totalDamageDealt":"452"}},"feature":"damage"}
[2021-06-18 02:23:57.246 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:23:57.271 AM] {"info":{"me":{"totalDamageDealt":"468"}},"feature":"damage"}
[2021-06-18 02:23:57.295 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":463}}},"feature":"match_info"}
[2021-06-18 02:23:57.645 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:23:57.679 AM] {"info":{"me":{"totalDamageDealt":"484"}},"feature":"damage"}
[2021-06-18 02:23:57.755 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":479}}},"feature":"match_info"}
[2021-06-18 02:23:57.843 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:23:57.870 AM] {"info":{"me":{"totalDamageDealt":"500"}},"feature":"damage"}
[2021-06-18 02:23:58.254 AM] {"name":"knockdown","data":{"victimName":"[BRO] PhantomNicky_\n"}}
[2021-06-18 02:23:58.287 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] PhantomNicky_","weaponName":"devotion","action":"knockdown"}}
[2021-06-18 02:23:58.311 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":491}}},"feature":"match_info"}
[2021-06-18 02:24:06.751 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2021-06-18 02:24:08.750 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] ?.?.操你?.?","victimName":"[Quak] Decimal Duck","weaponName":"r97","action":"knockdown"}}
[2021-06-18 02:24:09.342 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:09.374 AM] {"info":{"me":{"totalDamageDealt":"514"}},"feature":"damage"}
[2021-06-18 02:24:09.435 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:09.464 AM] {"info":{"me":{"totalDamageDealt":"528"}},"feature":"damage"}
[2021-06-18 02:24:09.537 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:09.564 AM] {"info":{"me":{"totalDamageDealt":"542"}},"feature":"damage"}
[2021-06-18 02:24:09.645 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:09.670 AM] {"info":{"me":{"totalDamageDealt":"556"}},"feature":"damage"}
[2021-06-18 02:24:09.743 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:09.771 AM] {"info":{"me":{"totalDamageDealt":"570"}},"feature":"damage"}
[2021-06-18 02:24:09.805 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":561}}},"feature":"match_info"}
[2021-06-18 02:24:09.842 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:09.867 AM] {"info":{"me":{"totalDamageDealt":"584"}},"feature":"damage"}
[2021-06-18 02:24:10.252 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":575}}},"feature":"match_info"}
[2021-06-18 02:24:10.541 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:10.565 AM] {"info":{"me":{"totalDamageDealt":"598"}},"feature":"damage"}
[2021-06-18 02:24:10.753 AM] {"name":"knockdown","data":{"victimName":"[BRO] ?.?.操你?.?\n"}}
[2021-06-18 02:24:10.786 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] ?.?.操你?.?","weaponName":"devotion","action":"knockdown"}}
[2021-06-18 02:24:10.814 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":579}}},"feature":"match_info"}
[2021-06-18 02:24:14.686 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:24:14.713 AM] {"info":{"me":{"totalDamageDealt":"608"}},"feature":"damage"}
[2021-06-18 02:24:14.737 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"2.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:14.769 AM] {"info":{"me":{"totalDamageDealt":"610"}},"feature":"damage"}
[2021-06-18 02:24:14.795 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":591}}},"feature":"match_info"}
[2021-06-18 02:24:14.835 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"12.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:14.860 AM] {"info":{"me":{"totalDamageDealt":"622"}},"feature":"damage"}
[2021-06-18 02:24:15.093 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:15.120 AM] {"info":{"me":{"totalDamageDealt":"638"}},"feature":"damage"}
[2021-06-18 02:24:15.190 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:15.216 AM] {"info":{"me":{"totalDamageDealt":"654"}},"feature":"damage"}
[2021-06-18 02:24:15.256 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":635}}},"feature":"match_info"}
[2021-06-18 02:24:15.742 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:15.776 AM] {"info":{"me":{"totalDamageDealt":"670"}},"feature":"damage"}
[2021-06-18 02:24:15.800 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":651}}},"feature":"match_info"}
[2021-06-18 02:24:16.139 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"12.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:16.172 AM] {"info":{"me":{"totalDamageDealt":"682"}},"feature":"damage"}
[2021-06-18 02:24:16.204 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:16.229 AM] {"info":{"me":{"totalDamageDealt":"698"}},"feature":"damage"}
[2021-06-18 02:24:16.262 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":679}}},"feature":"match_info"}
[2021-06-18 02:24:16.296 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:16.324 AM] {"info":{"me":{"totalDamageDealt":"714"}},"feature":"damage"}
[2021-06-18 02:24:16.758 AM] {"name":"knockdown","data":{"victimName":"Phantom_Lio\n"}}
[2021-06-18 02:24:16.791 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":" Phantom_Lio","weaponName":"devotion","action":"knockdown"}}
[2021-06-18 02:24:16.815 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"damage":689}}},"feature":"match_info"}
[2021-06-18 02:24:17.904 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:17.939 AM] {"info":{"me":{"totalDamageDealt":"721"}},"feature":"damage"}
[2021-06-18 02:24:17.970 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:17.997 AM] {"info":{"me":{"totalDamageDealt":"728"}},"feature":"damage"}
[2021-06-18 02:24:18.029 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:24:18.061 AM] {"info":{"me":{"totalDamageDealt":"735"}},"feature":"damage"}
[2021-06-18 02:24:18.252 AM] {"name":"kill","data":{"victimName":"[BRO] PhantomNicky_"}}
[2021-06-18 02:24:18.280 AM] {"name":"kill","data":{"victimName":"[BRO] ?.?.操你?.?"}}
[2021-06-18 02:24:18.305 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] PhantomNicky_","weaponName":"eva8","action":"kill"}}
[2021-06-18 02:24:18.332 AM] {"name":"kill_feed","data":{"attackerName":"[AllF] MasterKriff","victimName":"[BRO] ?.?.操你?.?","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-06-18 02:24:18.366 AM] {"info":{"match_info":{"tabs":{"kills":2,"assists":0,"damage":709}}},"feature":"match_info"}
[2021-06-18 02:24:18.759 AM] {"name":"kill","data":{"victimName":"Phantom_Lio"}}
[2021-06-18 02:24:18.789 AM] {"name":"kill_feed","data":{"attackerName":"[AllF] MasterKriff","victimName":" Phantom_Lio","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-06-18 02:24:18.814 AM] {"info":{"match_info":{"tabs":{"kills":3,"assists":0,"damage":709}}},"feature":"match_info"}
[2021-06-18 02:24:22.359 AM] {"name":"death","data":null}`;

const round4 = `
[2021-06-18 02:24:24.324 AM] {"name":"respawn","data":null}
[2021-06-18 02:24:34.249 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2021-06-18 02:25:18.341 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:18.377 AM] {"info":{"me":{"totalDamageDealt":"742"}},"feature":"damage"}
[2021-06-18 02:25:18.401 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:18.426 AM] {"info":{"me":{"totalDamageDealt":"749"}},"feature":"damage"}
[2021-06-18 02:25:18.453 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:18.480 AM] {"info":{"me":{"totalDamageDealt":"756"}},"feature":"damage"}
[2021-06-18 02:25:18.506 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:18.532 AM] {"info":{"me":{"totalDamageDealt":"763"}},"feature":"damage"}
[2021-06-18 02:25:18.557 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:18.593 AM] {"info":{"me":{"totalDamageDealt":"770"}},"feature":"damage"}
[2021-06-18 02:25:18.748 AM] {"info":{"match_info":{"tabs":{"kills":3,"assists":0,"damage":744}}},"feature":"match_info"}
[2021-06-18 02:25:18.792 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:18.824 AM] {"info":{"me":{"totalDamageDealt":"777"}},"feature":"damage"}
[2021-06-18 02:25:18.850 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:18.877 AM] {"info":{"me":{"totalDamageDealt":"784"}},"feature":"damage"}
[2021-06-18 02:25:19.195 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:19.222 AM] {"info":{"me":{"totalDamageDealt":"791"}},"feature":"damage"}
[2021-06-18 02:25:19.248 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:19.274 AM] {"info":{"me":{"totalDamageDealt":"798"}},"feature":"damage"}
[2021-06-18 02:25:19.309 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:19.338 AM] {"info":{"me":{"totalDamageDealt":"805"}},"feature":"damage"}
[2021-06-18 02:25:19.363 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:19.388 AM] {"info":{"me":{"totalDamageDealt":"812"}},"feature":"damage"}
[2021-06-18 02:25:19.412 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:19.438 AM] {"info":{"me":{"totalDamageDealt":"819"}},"feature":"damage"}
[2021-06-18 02:25:19.463 AM] {"info":{"match_info":{"tabs":{"kills":3,"assists":0,"damage":793}}},"feature":"match_info"}
[2021-06-18 02:25:19.596 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:19.627 AM] {"info":{"me":{"totalDamageDealt":"826"}},"feature":"damage"}
[2021-06-18 02:25:19.652 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:19.678 AM] {"info":{"me":{"totalDamageDealt":"833"}},"feature":"damage"}
[2021-06-18 02:25:19.714 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"2.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:19.741 AM] {"info":{"me":{"totalDamageDealt":"835"}},"feature":"damage"}
[2021-06-18 02:25:19.769 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"5.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:19.797 AM] {"info":{"me":{"totalDamageDealt":"840"}},"feature":"damage"}
[2021-06-18 02:25:19.823 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:19.851 AM] {"info":{"me":{"totalDamageDealt":"847"}},"feature":"damage"}
[2021-06-18 02:25:19.875 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:19.902 AM] {"info":{"me":{"totalDamageDealt":"854"}},"feature":"damage"}
[2021-06-18 02:25:19.940 AM] {"info":{"match_info":{"tabs":{"kills":3,"assists":0,"damage":828}}},"feature":"match_info"}
[2021-06-18 02:25:20.441 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"9.000000","armor":false,"headshot":true}}
[2021-06-18 02:25:20.482 AM] {"info":{"me":{"totalDamageDealt":"863"}},"feature":"damage"}
[2021-06-18 02:25:20.513 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:20.541 AM] {"info":{"me":{"totalDamageDealt":"870"}},"feature":"damage"}
[2021-06-18 02:25:20.567 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:20.611 AM] {"info":{"me":{"totalDamageDealt":"877"}},"feature":"damage"}
[2021-06-18 02:25:20.643 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:20.676 AM] {"info":{"me":{"totalDamageDealt":"884"}},"feature":"damage"}
[2021-06-18 02:25:20.710 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:20.736 AM] {"info":{"me":{"totalDamageDealt":"891"}},"feature":"damage"}
[2021-06-18 02:25:20.774 AM] {"info":{"match_info":{"tabs":{"kills":3,"assists":0,"damage":865}}},"feature":"match_info"}
[2021-06-18 02:25:20.844 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:20.874 AM] {"info":{"me":{"totalDamageDealt":"898"}},"feature":"damage"}
[2021-06-18 02:25:20.903 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"9.000000","armor":false,"headshot":true}}
[2021-06-18 02:25:20.930 AM] {"info":{"me":{"totalDamageDealt":"907"}},"feature":"damage"}
[2021-06-18 02:25:20.957 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:20.981 AM] {"info":{"me":{"totalDamageDealt":"914"}},"feature":"damage"}
[2021-06-18 02:25:21.009 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:21.035 AM] {"info":{"me":{"totalDamageDealt":"921"}},"feature":"damage"}
[2021-06-18 02:25:21.060 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:21.097 AM] {"info":{"me":{"totalDamageDealt":"928"}},"feature":"damage"}
[2021-06-18 02:25:21.126 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:21.155 AM] {"info":{"me":{"totalDamageDealt":"935"}},"feature":"damage"}
[2021-06-18 02:25:21.257 AM] {"name":"knockdown","data":{"victimName":"[BRO] PhantomNicky_\n"}}
[2021-06-18 02:25:21.288 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] PhantomNicky_","weaponName":"eva8","action":"knockdown"}}
[2021-06-18 02:25:21.316 AM] {"info":{"match_info":{"tabs":{"kills":3,"assists":0,"damage":909}}},"feature":"match_info"}
[2021-06-18 02:25:22.341 AM] {"info":{"me":{"totalDamageDealt":"947"}},"feature":"damage"}
[2021-06-18 02:25:22.371 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"12.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:22.588 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:22.617 AM] {"info":{"me":{"totalDamageDealt":"963"}},"feature":"damage"}
[2021-06-18 02:25:22.685 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:22.714 AM] {"info":{"me":{"totalDamageDealt":"979"}},"feature":"damage"}
[2021-06-18 02:25:22.756 AM] {"info":{"match_info":{"tabs":{"kills":3,"assists":0,"damage":953}}},"feature":"match_info"}
[2021-06-18 02:25:22.797 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:22.826 AM] {"info":{"me":{"totalDamageDealt":"995"}},"feature":"damage"}
[2021-06-18 02:25:23.137 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:23.165 AM] {"info":{"me":{"totalDamageDealt":"1011"}},"feature":"damage"}
[2021-06-18 02:25:23.256 AM] {"info":{"match_info":{"tabs":{"kills":3,"assists":0,"damage":985}}},"feature":"match_info"}
[2021-06-18 02:25:24.237 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:24.276 AM] {"info":{"me":{"totalDamageDealt":"1027"}},"feature":"damage"}
[2021-06-18 02:25:24.303 AM] {"info":{"match_info":{"tabs":{"kills":3,"assists":0,"damage":1001}}},"feature":"match_info"}
[2021-06-18 02:25:24.344 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:24.372 AM] {"info":{"me":{"totalDamageDealt":"1043"}},"feature":"damage"}
[2021-06-18 02:25:24.753 AM] {"name":"kill","data":{"victimName":"[BRO] PhantomNicky_"}}
[2021-06-18 02:25:24.785 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] PhantomNicky_","weaponName":"devotion","action":"kill"}}
[2021-06-18 02:25:24.818 AM] {"info":{"match_info":{"tabs":{"kills":4,"assists":0,"damage":1009}}},"feature":"match_info"}
[2021-06-18 02:25:27.757 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2021-06-18 02:25:32.542 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:32.577 AM] {"info":{"me":{"totalDamageDealt":"1057"}},"feature":"damage"}
[2021-06-18 02:25:32.755 AM] {"info":{"match_info":{"tabs":{"kills":4,"assists":0,"damage":1039}}},"feature":"match_info"}
[2021-06-18 02:25:45.639 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"20.000000","armor":true,"headshot":true}}
[2021-06-18 02:25:45.678 AM] {"info":{"me":{"totalDamageDealt":"1077"}},"feature":"damage"}
[2021-06-18 02:25:45.757 AM] {"info":{"match_info":{"tabs":{"kills":4,"assists":0,"damage":1059}}},"feature":"match_info"}
[2021-06-18 02:25:45.987 AM] {"info":{"me":{"totalDamageDealt":"1091"}},"feature":"damage"}
[2021-06-18 02:25:46.016 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:46.086 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:46.117 AM] {"info":{"me":{"totalDamageDealt":"1105"}},"feature":"damage"}
[2021-06-18 02:25:46.259 AM] {"info":{"match_info":{"tabs":{"kills":4,"assists":0,"damage":1087}}},"feature":"match_info"}
[2021-06-18 02:25:46.297 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:46.331 AM] {"info":{"me":{"totalDamageDealt":"1119"}},"feature":"damage"}
[2021-06-18 02:25:46.687 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:25:46.715 AM] {"info":{"me":{"totalDamageDealt":"1133"}},"feature":"damage"}
[2021-06-18 02:25:46.752 AM] {"info":{"match_info":{"tabs":{"kills":4,"assists":0,"damage":1115}}},"feature":"match_info"}
[2021-06-18 02:25:46.893 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:46.922 AM] {"info":{"me":{"totalDamageDealt":"1143"}},"feature":"damage"}
[2021-06-18 02:25:46.961 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:46.989 AM] {"info":{"me":{"totalDamageDealt":"1153"}},"feature":"damage"}
[2021-06-18 02:25:47.043 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:47.072 AM] {"info":{"me":{"totalDamageDealt":"1163"}},"feature":"damage"}
[2021-06-18 02:25:47.110 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:47.140 AM] {"info":{"me":{"totalDamageDealt":"1177"}},"feature":"damage"}
[2021-06-18 02:25:47.179 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:47.211 AM] {"info":{"me":{"totalDamageDealt":"1191"}},"feature":"damage"}
[2021-06-18 02:25:47.251 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:47.280 AM] {"info":{"me":{"totalDamageDealt":"1205"}},"feature":"damage"}
[2021-06-18 02:25:47.310 AM] {"info":{"match_info":{"tabs":{"kills":4,"assists":0,"damage":1187}}},"feature":"match_info"}
[2021-06-18 02:25:47.349 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:47.378 AM] {"info":{"me":{"totalDamageDealt":"1219"}},"feature":"damage"}
[2021-06-18 02:25:47.754 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] ?.?.操你?.?","weaponName":"devotion","action":"knockdown"}}
[2021-06-18 02:25:47.783 AM] {"name":"knockdown","data":{"victimName":"[BRO] ?.?.操你?.?\n"}}
[2021-06-18 02:25:47.814 AM] {"info":{"match_info":{"tabs":{"kills":4,"assists":0,"damage":1188}}},"feature":"match_info"}
[2021-06-18 02:25:51.143 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:51.188 AM] {"info":{"me":{"totalDamageDealt":"1226"}},"feature":"damage"}
[2021-06-18 02:25:51.215 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:51.245 AM] {"info":{"me":{"totalDamageDealt":"1233"}},"feature":"damage"}
[2021-06-18 02:25:51.271 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:51.299 AM] {"info":{"me":{"totalDamageDealt":"1240"}},"feature":"damage"}
[2021-06-18 02:25:51.327 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:51.353 AM] {"info":{"me":{"totalDamageDealt":"1247"}},"feature":"damage"}
[2021-06-18 02:25:51.380 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:51.414 AM] {"info":{"me":{"totalDamageDealt":"1254"}},"feature":"damage"}
[2021-06-18 02:25:51.442 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:51.471 AM] {"info":{"me":{"totalDamageDealt":"1261"}},"feature":"damage"}
[2021-06-18 02:25:51.499 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:51.525 AM] {"info":{"me":{"totalDamageDealt":"1268"}},"feature":"damage"}
[2021-06-18 02:25:51.553 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:25:51.583 AM] {"info":{"me":{"totalDamageDealt":"1275"}},"feature":"damage"}
[2021-06-18 02:25:51.616 AM] {"info":{"match_info":{"tabs":{"kills":4,"assists":0,"damage":1244}}},"feature":"match_info"}
[2021-06-18 02:25:53.049 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"24.000000","armor":false,"headshot":true}}
[2021-06-18 02:25:53.089 AM] {"info":{"me":{"totalDamageDealt":"1299"}},"feature":"damage"}
[2021-06-18 02:25:53.250 AM] {"name":"kill","data":{"victimName":"[BRO] ?.?.操你?.?"}}
[2021-06-18 02:25:53.279 AM] {"name":"kill","data":{"victimName":"Phantom_Lio"}}
[2021-06-18 02:25:53.309 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":" Phantom_Lio","weaponName":"devotion","action":"headshot_kill"}}
[2021-06-18 02:25:53.338 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Quak] Decimal Duck","victimName":"[BRO] ?.?.操你?.?","weaponName":"r301","action":"kill"}}
[2021-06-18 02:25:53.375 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1265}}},"feature":"match_info"}
[2021-06-18 02:25:56.960 AM] {"name":"death","data":null}`;

const round5 = `
[2021-06-18 02:25:58.984 AM] {"name":"respawn","data":null}
[2021-06-18 02:26:07.750 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2021-06-18 02:27:15.755 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2021-06-18 02:27:18.751 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] ?.?.操你?.?","victimName":"[PeX] ShironJackal","weaponName":"sentinel","action":"knockdown"}}
[2021-06-18 02:27:22.289 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:22.331 AM] {"info":{"me":{"totalDamageDealt":"1315"}},"feature":"damage"}
[2021-06-18 02:27:22.748 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1281}}},"feature":"match_info"}
[2021-06-18 02:27:23.298 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:23.337 AM] {"info":{"me":{"totalDamageDealt":"1331"}},"feature":"damage"}
[2021-06-18 02:27:23.539 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:23.569 AM] {"info":{"me":{"totalDamageDealt":"1347"}},"feature":"damage"}
[2021-06-18 02:27:23.754 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1313}}},"feature":"match_info"}
[2021-06-18 02:27:23.794 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:23.823 AM] {"info":{"me":{"totalDamageDealt":"1363"}},"feature":"damage"}
[2021-06-18 02:27:24.249 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1329}}},"feature":"match_info"}
[2021-06-18 02:27:27.947 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"1.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:27.990 AM] {"info":{"me":{"totalDamageDealt":"1364"}},"feature":"damage"}
[2021-06-18 02:27:28.093 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:28.126 AM] {"info":{"me":{"totalDamageDealt":"1374"}},"feature":"damage"}
[2021-06-18 02:27:28.195 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:28.231 AM] {"info":{"me":{"totalDamageDealt":"1388"}},"feature":"damage"}
[2021-06-18 02:27:28.269 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1369}}},"feature":"match_info"}
[2021-06-18 02:27:28.753 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Quak] Decimal Duck","victimName":"[BRO] ?.?.操你?.?","weaponName":"r301","action":"knockdown"}}
[2021-06-18 02:27:31.254 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] PhantomNicky_","victimName":"[Quak] Decimal Duck","weaponName":"mozambique","action":"knockdown"}}
[2021-06-18 02:27:38.255 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] PhantomNicky_","victimName":"[PeX] ShironJackal","weaponName":"mozambique","action":"knockdown"}}
[2021-06-18 02:27:38.543 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:38.579 AM] {"info":{"me":{"totalDamageDealt":"1395"}},"feature":"damage"}
[2021-06-18 02:27:38.614 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:38.649 AM] {"info":{"me":{"totalDamageDealt":"1402"}},"feature":"damage"}
[2021-06-18 02:27:38.751 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1383}}},"feature":"match_info"}
[2021-06-18 02:27:38.993 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.029 AM] {"info":{"me":{"totalDamageDealt":"1409"}},"feature":"damage"}
[2021-06-18 02:27:39.058 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.109 AM] {"info":{"me":{"totalDamageDealt":"1423"}},"feature":"damage"}
[2021-06-18 02:27:39.145 AM] {"info":{"me":{"totalDamageDealt":"1416"}},"feature":"damage"}
[2021-06-18 02:27:39.181 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.254 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1404}}},"feature":"match_info"}
[2021-06-18 02:27:39.498 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.531 AM] {"info":{"me":{"totalDamageDealt":"1430"}},"feature":"damage"}
[2021-06-18 02:27:39.563 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.590 AM] {"info":{"me":{"totalDamageDealt":"1437"}},"feature":"damage"}
[2021-06-18 02:27:39.617 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.647 AM] {"info":{"me":{"totalDamageDealt":"1444"}},"feature":"damage"}
[2021-06-18 02:27:39.676 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.715 AM] {"info":{"me":{"totalDamageDealt":"1451"}},"feature":"damage"}
[2021-06-18 02:27:39.745 AM] {"info":{"me":{"totalDamageDealt":"1458"}},"feature":"damage"}
[2021-06-18 02:27:39.777 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.816 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.848 AM] {"info":{"me":{"totalDamageDealt":"1465"}},"feature":"damage"}
[2021-06-18 02:27:39.878 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.911 AM] {"info":{"me":{"totalDamageDealt":"1472"}},"feature":"damage"}
[2021-06-18 02:27:39.942 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:39.971 AM] {"info":{"me":{"totalDamageDealt":"1479"}},"feature":"damage"}
[2021-06-18 02:27:40.001 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:40.033 AM] {"info":{"me":{"totalDamageDealt":"1486"}},"feature":"damage"}
[2021-06-18 02:27:40.078 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1467}}},"feature":"match_info"}
[2021-06-18 02:27:40.112 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"2.000000","armor":true,"headshot":false}}
[2021-06-18 02:27:40.151 AM] {"info":{"me":{"totalDamageDealt":"1488"}},"feature":"damage"}
[2021-06-18 02:27:40.191 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"5.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.223 AM] {"info":{"me":{"totalDamageDealt":"1493"}},"feature":"damage"}
[2021-06-18 02:27:40.259 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.290 AM] {"info":{"me":{"totalDamageDealt":"1500"}},"feature":"damage"}
[2021-06-18 02:27:40.326 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.357 AM] {"info":{"me":{"totalDamageDealt":"1507"}},"feature":"damage"}
[2021-06-18 02:27:40.386 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.417 AM] {"info":{"me":{"totalDamageDealt":"1514"}},"feature":"damage"}
[2021-06-18 02:27:40.446 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.476 AM] {"info":{"me":{"totalDamageDealt":"1521"}},"feature":"damage"}
[2021-06-18 02:27:40.506 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.535 AM] {"info":{"me":{"totalDamageDealt":"1528"}},"feature":"damage"}
[2021-06-18 02:27:40.577 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.608 AM] {"info":{"me":{"totalDamageDealt":"1535"}},"feature":"damage"}
[2021-06-18 02:27:40.637 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.668 AM] {"info":{"me":{"totalDamageDealt":"1542"}},"feature":"damage"}
[2021-06-18 02:27:40.700 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.733 AM] {"info":{"me":{"totalDamageDealt":"1549"}},"feature":"damage"}
[2021-06-18 02:27:40.765 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1530}}},"feature":"match_info"}
[2021-06-18 02:27:40.799 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.831 AM] {"info":{"me":{"totalDamageDealt":"1556"}},"feature":"damage"}
[2021-06-18 02:27:40.862 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.902 AM] {"info":{"me":{"totalDamageDealt":"1563"}},"feature":"damage"}
[2021-06-18 02:27:40.943 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:40.973 AM] {"info":{"me":{"totalDamageDealt":"1570"}},"feature":"damage"}
[2021-06-18 02:27:41.013 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:41.045 AM] {"info":{"me":{"totalDamageDealt":"1577"}},"feature":"damage"}
[2021-06-18 02:27:41.083 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:27:41.115 AM] {"info":{"me":{"totalDamageDealt":"1584"}},"feature":"damage"}
[2021-06-18 02:27:41.154 AM] {"name":"death","data":null}
[2021-06-18 02:27:41.186 AM] {"name":"kill_feed","data":{"attackerName":"[BRO] PhantomNicky_","victimName":"[AllF] MasterKriff","weaponName":"Melee","action":"Melee"}}
[2021-06-18 02:27:41.252 AM] {"name":"kill_feed","data":{"attackerName":"[BRO] PhantomNicky_","victimName":"[PeX] ShironJackal","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-06-18 02:27:41.292 AM] {"name":"kill_feed","data":{"attackerName":"[BRO] PhantomNicky_","victimName":"[Quak] Decimal Duck","weaponName":"Bleed Out","action":"Bleed Out"}}`;

const round6 = `
[2021-06-18 02:27:47.000 AM] {"name":"respawn","data":null}
[2021-06-18 02:27:47.248 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1565}}},"feature":"match_info"}
[2021-06-18 02:27:53.252 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2021-06-18 02:28:35.255 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2021-06-18 02:28:41.398 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:28:41.447 AM] {"info":{"me":{"totalDamageDealt":"1598"}},"feature":"damage"}
[2021-06-18 02:28:41.493 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:28:41.535 AM] {"info":{"me":{"totalDamageDealt":"1612"}},"feature":"damage"}
[2021-06-18 02:28:41.592 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:28:41.625 AM] {"info":{"me":{"totalDamageDealt":"1626"}},"feature":"damage"}
[2021-06-18 02:28:41.752 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1607}}},"feature":"match_info"}
[2021-06-18 02:28:43.350 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:28:43.400 AM] {"info":{"me":{"totalDamageDealt":"1636"}},"feature":"damage"}
[2021-06-18 02:28:43.754 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1617}}},"feature":"match_info"}
[2021-06-18 02:28:59.341 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":true,"headshot":false}}
[2021-06-18 02:28:59.386 AM] {"info":{"me":{"totalDamageDealt":"1652"}},"feature":"damage"}
[2021-06-18 02:28:59.500 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:28:59.534 AM] {"info":{"me":{"totalDamageDealt":"1666"}},"feature":"damage"}
[2021-06-18 02:28:59.563 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"2.000000","armor":false,"headshot":false}}
[2021-06-18 02:28:59.593 AM] {"info":{"me":{"totalDamageDealt":"1668"}},"feature":"damage"}
[2021-06-18 02:28:59.643 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:28:59.679 AM] {"info":{"me":{"totalDamageDealt":"1684"}},"feature":"damage"}
[2021-06-18 02:28:59.746 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:28:59.779 AM] {"info":{"me":{"totalDamageDealt":"1700"}},"feature":"damage"}
[2021-06-18 02:28:59.824 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1681}}},"feature":"match_info"}
[2021-06-18 02:29:00.043 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:00.077 AM] {"info":{"me":{"totalDamageDealt":"1716"}},"feature":"damage"}
[2021-06-18 02:29:00.146 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:00.183 AM] {"info":{"me":{"totalDamageDealt":"1732"}},"feature":"damage"}
[2021-06-18 02:29:00.241 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"12.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:00.276 AM] {"info":{"me":{"totalDamageDealt":"1744"}},"feature":"damage"}
[2021-06-18 02:29:00.320 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] PhantomNicky_","victimName":"[Quak] Decimal Duck","weaponName":"mozambique","action":"knockdown"}}
[2021-06-18 02:29:00.355 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1725}}},"feature":"match_info"}
[2021-06-18 02:29:00.386 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"12.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:00.418 AM] {"info":{"me":{"totalDamageDealt":"1756"}},"feature":"damage"}
[2021-06-18 02:29:00.459 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:00.491 AM] {"info":{"me":{"totalDamageDealt":"1772"}},"feature":"damage"}
[2021-06-18 02:29:00.752 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":" Phantom_Lio","weaponName":"devotion","action":"knockdown"}}
[2021-06-18 02:29:00.785 AM] {"name":"knockdown","data":{"victimName":"Phantom_Lio\n"}}
[2021-06-18 02:29:00.821 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1747}}},"feature":"match_info"}
[2021-06-18 02:29:03.795 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"9.000000","armor":true,"headshot":true}}
[2021-06-18 02:29:03.843 AM] {"info":{"me":{"totalDamageDealt":"1781"}},"feature":"damage"}
[2021-06-18 02:29:03.875 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:03.908 AM] {"info":{"me":{"totalDamageDealt":"1788"}},"feature":"damage"}
[2021-06-18 02:29:03.940 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"9.000000","armor":true,"headshot":true}}
[2021-06-18 02:29:03.973 AM] {"info":{"me":{"totalDamageDealt":"1797"}},"feature":"damage"}
[2021-06-18 02:29:04.259 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1772}}},"feature":"match_info"}
[2021-06-18 02:29:04.946 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:04.993 AM] {"info":{"me":{"totalDamageDealt":"1804"}},"feature":"damage"}
[2021-06-18 02:29:05.027 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:05.061 AM] {"info":{"me":{"totalDamageDealt":"1811"}},"feature":"damage"}
[2021-06-18 02:29:05.092 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:05.125 AM] {"info":{"me":{"totalDamageDealt":"1818"}},"feature":"damage"}
[2021-06-18 02:29:05.157 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:05.190 AM] {"info":{"me":{"totalDamageDealt":"1825"}},"feature":"damage"}
[2021-06-18 02:29:05.223 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:05.266 AM] {"info":{"me":{"totalDamageDealt":"1832"}},"feature":"damage"}
[2021-06-18 02:29:05.299 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:05.331 AM] {"info":{"me":{"totalDamageDealt":"1839"}},"feature":"damage"}
[2021-06-18 02:29:05.364 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:05.396 AM] {"info":{"me":{"totalDamageDealt":"1846"}},"feature":"damage"}
[2021-06-18 02:29:05.429 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1821}}},"feature":"match_info"}
[2021-06-18 02:29:05.901 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:05.951 AM] {"info":{"me":{"totalDamageDealt":"1853"}},"feature":"damage"}
[2021-06-18 02:29:05.985 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:06.020 AM] {"info":{"me":{"totalDamageDealt":"1860"}},"feature":"damage"}
[2021-06-18 02:29:06.054 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:06.087 AM] {"info":{"me":{"totalDamageDealt":"1867"}},"feature":"damage"}
[2021-06-18 02:29:06.122 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:06.166 AM] {"info":{"me":{"totalDamageDealt":"1874"}},"feature":"damage"}
[2021-06-18 02:29:06.199 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:06.232 AM] {"info":{"me":{"totalDamageDealt":"1881"}},"feature":"damage"}
[2021-06-18 02:29:06.266 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:06.299 AM] {"info":{"me":{"totalDamageDealt":"1888"}},"feature":"damage"}
[2021-06-18 02:29:06.333 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:06.367 AM] {"info":{"me":{"totalDamageDealt":"1895"}},"feature":"damage"}
[2021-06-18 02:29:06.400 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:06.437 AM] {"info":{"me":{"totalDamageDealt":"1902"}},"feature":"damage"}
[2021-06-18 02:29:06.471 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:06.523 AM] {"info":{"me":{"totalDamageDealt":"1909"}},"feature":"damage"}
[2021-06-18 02:29:06.557 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":0,"damage":1884}}},"feature":"match_info"}
[2021-06-18 02:29:07.755 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PeX] ShironJackal","victimName":"[BRO] PhantomNicky_","weaponName":"flatline","action":"knockdown"}}
[2021-06-18 02:29:19.752 AM] {"name":"assist","data":{"victimName":"PhantomNicky_","type":"elimination"}}
[2021-06-18 02:29:19.798 AM] {"name":"kill_feed","data":{"attackerName":"[PeX] ShironJackal","victimName":"[BRO] PhantomNicky_","weaponName":"Finisher","action":"Finisher"}}
[2021-06-18 02:29:19.843 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":1,"damage":1884}}},"feature":"match_info"}
[2021-06-18 02:29:26.498 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:26.542 AM] {"info":{"me":{"totalDamageDealt":"1923"}},"feature":"damage"}
[2021-06-18 02:29:26.753 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":1,"damage":1898}}},"feature":"match_info"}
[2021-06-18 02:29:26.798 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:26.831 AM] {"info":{"me":{"totalDamageDealt":"1937"}},"feature":"damage"}
[2021-06-18 02:29:27.253 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":1,"damage":1912}}},"feature":"match_info"}
[2021-06-18 02:29:27.997 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:28.049 AM] {"info":{"me":{"totalDamageDealt":"1947"}},"feature":"damage"}
[2021-06-18 02:29:28.086 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:28.124 AM] {"info":{"me":{"totalDamageDealt":"1957"}},"feature":"damage"}
[2021-06-18 02:29:28.170 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:28.205 AM] {"info":{"me":{"totalDamageDealt":"1971"}},"feature":"damage"}
[2021-06-18 02:29:28.255 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":1,"damage":1946}}},"feature":"match_info"}
[2021-06-18 02:29:28.346 AM] {"info":{"me":{"totalDamageDealt":"1985"}},"feature":"damage"}
[2021-06-18 02:29:28.381 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:28.425 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:28.458 AM] {"info":{"me":{"totalDamageDealt":"1995"}},"feature":"damage"}
[2021-06-18 02:29:28.502 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:28.540 AM] {"info":{"me":{"totalDamageDealt":"2005"}},"feature":"damage"}
[2021-06-18 02:29:28.703 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":true,"headshot":false}}
[2021-06-18 02:29:28.747 AM] {"info":{"me":{"totalDamageDealt":"2011"}},"feature":"damage"}
[2021-06-18 02:29:28.782 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"8.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:28.819 AM] {"info":{"me":{"totalDamageDealt":"2019"}},"feature":"damage"}
[2021-06-18 02:29:28.876 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":1,"damage":1994}}},"feature":"match_info"}
[2021-06-18 02:29:28.912 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:28.945 AM] {"info":{"me":{"totalDamageDealt":"2033"}},"feature":"damage"}
[2021-06-18 02:29:29.256 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":1,"damage":2008}}},"feature":"match_info"}
[2021-06-18 02:29:33.247 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.297 AM] {"info":{"me":{"totalDamageDealt":"2039"}},"feature":"damage"}
[2021-06-18 02:29:33.334 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.369 AM] {"info":{"me":{"totalDamageDealt":"2045"}},"feature":"damage"}
[2021-06-18 02:29:33.403 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.437 AM] {"info":{"me":{"totalDamageDealt":"2051"}},"feature":"damage"}
[2021-06-18 02:29:33.472 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.521 AM] {"info":{"me":{"totalDamageDealt":"2057"}},"feature":"damage"}
[2021-06-18 02:29:33.555 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.591 AM] {"info":{"me":{"totalDamageDealt":"2063"}},"feature":"damage"}
[2021-06-18 02:29:33.627 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.662 AM] {"info":{"me":{"totalDamageDealt":"2069"}},"feature":"damage"}
[2021-06-18 02:29:33.697 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.731 AM] {"info":{"me":{"totalDamageDealt":"2075"}},"feature":"damage"}
[2021-06-18 02:29:33.767 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.802 AM] {"info":{"me":{"totalDamageDealt":"2081"}},"feature":"damage"}
[2021-06-18 02:29:33.847 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.882 AM] {"info":{"me":{"totalDamageDealt":"2087"}},"feature":"damage"}
[2021-06-18 02:29:33.917 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":1,"damage":2062}}},"feature":"match_info"}
[2021-06-18 02:29:33.953 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:33.987 AM] {"info":{"me":{"totalDamageDealt":"2093"}},"feature":"damage"}
[2021-06-18 02:29:34.024 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:34.074 AM] {"info":{"me":{"totalDamageDealt":"2099"}},"feature":"damage"}
[2021-06-18 02:29:34.111 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:34.146 AM] {"info":{"me":{"totalDamageDealt":"2105"}},"feature":"damage"}
[2021-06-18 02:29:34.180 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":1,"damage":2080}}},"feature":"match_info"}
[2021-06-18 02:29:34.449 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:29:34.486 AM] {"info":{"me":{"totalDamageDealt":"2111"}},"feature":"damage"}
[2021-06-18 02:29:34.758 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] ?.?.操你?.?","weaponName":"eva8","action":"knockdown"}}
[2021-06-18 02:29:34.796 AM] {"name":"knockdown","data":{"victimName":"[BRO] ?.?.操你?.?\n"}}
[2021-06-18 02:29:34.832 AM] {"info":{"match_info":{"tabs":{"kills":6,"assists":1,"damage":2086}}},"feature":"match_info"}
[2021-06-18 02:29:42.258 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Quak] Decimal Duck","victimName":" Phantom_Lio","weaponName":"r301","action":"kill"}}
[2021-06-18 02:29:42.306 AM] {"name":"kill_feed","data":{"attackerName":"[AllF] MasterKriff","victimName":"[BRO] ?.?.操你?.?","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-06-18 02:29:42.343 AM] {"name":"kill","data":{"victimName":"[BRO] ?.?.操你?.?"}}
[2021-06-18 02:29:42.379 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2086}}},"feature":"match_info"}
[2021-06-18 02:29:46.058 AM] {"name":"death","data":null}`;

const round7 = `
[2021-06-18 02:29:48.034 AM] {"name":"respawn","data":null}
[2021-06-18 02:30:01.752 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2021-06-18 02:30:35.255 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2021-06-18 02:30:57.996 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:30:58.048 AM] {"info":{"me":{"totalDamageDealt":"2125"}},"feature":"damage"}
[2021-06-18 02:30:58.149 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:30:58.186 AM] {"info":{"me":{"totalDamageDealt":"2135"}},"feature":"damage"}
[2021-06-18 02:30:58.258 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2110}}},"feature":"match_info"}
[2021-06-18 02:30:58.499 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:30:58.541 AM] {"info":{"me":{"totalDamageDealt":"2145"}},"feature":"damage"}
[2021-06-18 02:30:58.596 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:30:58.631 AM] {"info":{"me":{"totalDamageDealt":"2155"}},"feature":"damage"}
[2021-06-18 02:30:58.697 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:30:58.733 AM] {"info":{"me":{"totalDamageDealt":"2165"}},"feature":"damage"}
[2021-06-18 02:30:58.779 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2140}}},"feature":"match_info"}
[2021-06-18 02:30:58.943 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-06-18 02:30:58.980 AM] {"info":{"me":{"totalDamageDealt":"2179"}},"feature":"damage"}
[2021-06-18 02:30:59.043 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"1.000000","armor":true,"headshot":false}}
[2021-06-18 02:30:59.082 AM] {"info":{"me":{"totalDamageDealt":"2180"}},"feature":"damage"}
[2021-06-18 02:30:59.121 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"13.000000","armor":false,"headshot":false}}
[2021-06-18 02:30:59.158 AM] {"info":{"me":{"totalDamageDealt":"2193"}},"feature":"damage"}
[2021-06-18 02:30:59.250 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2168}}},"feature":"match_info"}
[2021-06-18 02:30:59.291 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":false,"headshot":false}}
[2021-06-18 02:30:59.329 AM] {"info":{"me":{"totalDamageDealt":"2203"}},"feature":"damage"}
[2021-06-18 02:30:59.447 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":false,"headshot":false}}
[2021-06-18 02:30:59.487 AM] {"info":{"me":{"totalDamageDealt":"2213"}},"feature":"damage"}
[2021-06-18 02:30:59.534 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":false,"headshot":false}}
[2021-06-18 02:30:59.575 AM] {"info":{"me":{"totalDamageDealt":"2223"}},"feature":"damage"}
[2021-06-18 02:30:59.749 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2198}}},"feature":"match_info"}
[2021-06-18 02:31:13.249 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:13.300 AM] {"info":{"me":{"totalDamageDealt":"2230"}},"feature":"damage"}
[2021-06-18 02:31:13.339 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:13.376 AM] {"info":{"me":{"totalDamageDealt":"2237"}},"feature":"damage"}
[2021-06-18 02:31:13.413 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:13.448 AM] {"info":{"me":{"totalDamageDealt":"2244"}},"feature":"damage"}
[2021-06-18 02:31:13.483 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:13.534 AM] {"info":{"me":{"totalDamageDealt":"2251"}},"feature":"damage"}
[2021-06-18 02:31:13.570 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:13.609 AM] {"info":{"me":{"totalDamageDealt":"2258"}},"feature":"damage"}
[2021-06-18 02:31:13.647 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:13.683 AM] {"info":{"me":{"totalDamageDealt":"2265"}},"feature":"damage"}
[2021-06-18 02:31:13.722 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:13.759 AM] {"info":{"me":{"totalDamageDealt":"2272"}},"feature":"damage"}
[2021-06-18 02:31:13.811 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:13.848 AM] {"info":{"me":{"totalDamageDealt":"2279"}},"feature":"damage"}
[2021-06-18 02:31:13.882 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"9.000000","armor":true,"headshot":true}}
[2021-06-18 02:31:13.916 AM] {"info":{"me":{"totalDamageDealt":"2288"}},"feature":"damage"}
[2021-06-18 02:31:13.957 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:13.993 AM] {"info":{"me":{"totalDamageDealt":"2295"}},"feature":"damage"}
[2021-06-18 02:31:14.041 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:14.078 AM] {"info":{"me":{"totalDamageDealt":"2302"}},"feature":"damage"}
[2021-06-18 02:31:14.117 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:14.154 AM] {"info":{"me":{"totalDamageDealt":"2309"}},"feature":"damage"}
[2021-06-18 02:31:14.189 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:14.223 AM] {"info":{"me":{"totalDamageDealt":"2316"}},"feature":"damage"}
[2021-06-18 02:31:14.262 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:14.300 AM] {"info":{"me":{"totalDamageDealt":"2323"}},"feature":"damage"}
[2021-06-18 02:31:14.340 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"1.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:14.386 AM] {"info":{"me":{"totalDamageDealt":"2324"}},"feature":"damage"}
[2021-06-18 02:31:14.424 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:14.459 AM] {"info":{"me":{"totalDamageDealt":"2330"}},"feature":"damage"}
[2021-06-18 02:31:14.500 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:14.541 AM] {"info":{"me":{"totalDamageDealt":"2337"}},"feature":"damage"}
[2021-06-18 02:31:14.581 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2312}}},"feature":"match_info"}
[2021-06-18 02:31:14.633 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:14.673 AM] {"info":{"me":{"totalDamageDealt":"2344"}},"feature":"damage"}
[2021-06-18 02:31:14.708 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:14.744 AM] {"info":{"me":{"totalDamageDealt":"2351"}},"feature":"damage"}
[2021-06-18 02:31:14.781 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:14.818 AM] {"info":{"me":{"totalDamageDealt":"2358"}},"feature":"damage"}
[2021-06-18 02:31:14.867 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2333}}},"feature":"match_info"}
[2021-06-18 02:31:15.055 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"1.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:15.100 AM] {"info":{"me":{"totalDamageDealt":"2359"}},"feature":"damage"}
[2021-06-18 02:31:15.138 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"6.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:15.189 AM] {"info":{"me":{"totalDamageDealt":"2365"}},"feature":"damage"}
[2021-06-18 02:31:15.227 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:15.264 AM] {"info":{"me":{"totalDamageDealt":"2372"}},"feature":"damage"}
[2021-06-18 02:31:15.316 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] PhantomNicky_","weaponName":"eva8","action":"knockdown"}}
[2021-06-18 02:31:15.358 AM] {"name":"knockdown","data":{"victimName":"[BRO] PhantomNicky_\n"}}
[2021-06-18 02:31:15.394 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2346}}},"feature":"match_info"}
[2021-06-18 02:31:17.999 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:18.049 AM] {"info":{"me":{"totalDamageDealt":"2388"}},"feature":"damage"}
[2021-06-18 02:31:18.149 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:18.185 AM] {"info":{"me":{"totalDamageDealt":"2404"}},"feature":"damage"}
[2021-06-18 02:31:18.255 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2378}}},"feature":"match_info"}
[2021-06-18 02:31:18.396 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:18.435 AM] {"info":{"me":{"totalDamageDealt":"2420"}},"feature":"damage"}
[2021-06-18 02:31:18.498 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:18.535 AM] {"info":{"me":{"totalDamageDealt":"2436"}},"feature":"damage"}
[2021-06-18 02:31:18.753 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2410}}},"feature":"match_info"}
[2021-06-18 02:31:19.791 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:19.846 AM] {"info":{"me":{"totalDamageDealt":"2452"}},"feature":"damage"}
[2021-06-18 02:31:20.260 AM] {"info":{"match_info":{"tabs":{"kills":7,"assists":1,"damage":2426}}},"feature":"match_info"}
[2021-06-18 02:31:20.892 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:20.947 AM] {"info":{"me":{"totalDamageDealt":"2468"}},"feature":"damage"}
[2021-06-18 02:31:21.054 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"16.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:21.094 AM] {"info":{"me":{"totalDamageDealt":"2484"}},"feature":"damage"}
[2021-06-18 02:31:21.254 AM] {"name":"kill","data":{"victimName":"[BRO] PhantomNicky_"}}
[2021-06-18 02:31:21.306 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] PhantomNicky_","weaponName":"devotion","action":"kill"}}
[2021-06-18 02:31:21.349 AM] {"info":{"match_info":{"tabs":{"kills":8,"assists":1,"damage":2446}}},"feature":"match_info"}
[2021-06-18 02:31:22.500 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"13.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:22.543 AM] {"info":{"me":{"totalDamageDealt":"2497"}},"feature":"damage"}
[2021-06-18 02:31:22.752 AM] {"info":{"match_info":{"tabs":{"kills":8,"assists":1,"damage":2459}}},"feature":"match_info"}
[2021-06-18 02:31:29.257 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRO] ?.?.操你?.?","victimName":"[Quak] Decimal Duck","weaponName":"devotion","action":"knockdown"}}
[2021-06-18 02:31:32.300 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"5.000000","armor":true,"headshot":false}}
[2021-06-18 02:31:32.351 AM] {"info":{"me":{"totalDamageDealt":"2502"}},"feature":"damage"}
[2021-06-18 02:31:32.392 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"9.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:32.429 AM] {"info":{"me":{"totalDamageDealt":"2511"}},"feature":"damage"}
[2021-06-18 02:31:32.476 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:32.514 AM] {"info":{"me":{"totalDamageDealt":"2521"}},"feature":"damage"}
[2021-06-18 02:31:32.593 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:32.636 AM] {"info":{"me":{"totalDamageDealt":"2531"}},"feature":"damage"}
[2021-06-18 02:31:32.694 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:32.731 AM] {"info":{"me":{"totalDamageDealt":"2545"}},"feature":"damage"}
[2021-06-18 02:31:32.781 AM] {"info":{"match_info":{"tabs":{"kills":8,"assists":1,"damage":2507}}},"feature":"match_info"}
[2021-06-18 02:31:32.819 AM] {"info":{"me":{"totalDamageDealt":"2559"}},"feature":"damage"}
[2021-06-18 02:31:32.855 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:31:33.259 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] ?.?.操你?.?","weaponName":"devotion","action":"knockdown"}}
[2021-06-18 02:31:33.299 AM] {"name":"knockdown","data":{"victimName":"[BRO] ?.?.操你?.?\n"}}
[2021-06-18 02:31:33.348 AM] {"info":{"match_info":{"tabs":{"kills":8,"assists":1,"damage":2521}}},"feature":"match_info"}
[2021-06-18 02:31:38.751 AM] {"name":"kill_feed","data":{"attackerName":"[AllF] MasterKriff","victimName":"[BRO] ?.?.操你?.?","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-06-18 02:31:38.796 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PeX] ShironJackal","victimName":" Phantom_Lio","weaponName":"eva8","action":"headshot_kill"}}
[2021-06-18 02:31:38.847 AM] {"name":"kill","data":{"victimName":"[BRO] ?.?.操你?.?"}}
[2021-06-18 02:31:38.885 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":1,"damage":2521}}},"feature":"match_info"}
[2021-06-18 02:31:42.563 AM] {"name":"death","data":null}`;

const round8 = `
[2021-06-18 02:31:44.536 AM] {"name":"respawn","data":null}
[2021-06-18 02:32:00.252 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2021-06-18 02:32:31.450 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"10.000000","armor":true,"headshot":false}}
[2021-06-18 02:32:31.507 AM] {"info":{"me":{"totalDamageDealt":"2569"}},"feature":"damage"}
[2021-06-18 02:32:31.752 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":1,"damage":2531}}},"feature":"match_info"}
[2021-06-18 02:32:57.002 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":true,"headshot":false}}
[2021-06-18 02:32:57.058 AM] {"info":{"me":{"totalDamageDealt":"2585"}},"feature":"damage"}
[2021-06-18 02:32:57.155 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":true,"headshot":false}}
[2021-06-18 02:32:57.199 AM] {"info":{"me":{"totalDamageDealt":"2601"}},"feature":"damage"}
[2021-06-18 02:32:57.254 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":1,"damage":2563}}},"feature":"match_info"}
[2021-06-18 02:32:57.452 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":true,"headshot":false}}
[2021-06-18 02:32:57.497 AM] {"info":{"me":{"totalDamageDealt":"2617"}},"feature":"damage"}
[2021-06-18 02:32:57.550 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"16.000000","armor":true,"headshot":false}}
[2021-06-18 02:32:57.593 AM] {"info":{"me":{"totalDamageDealt":"2633"}},"feature":"damage"}
[2021-06-18 02:32:57.755 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Quak] Decimal Duck","victimName":"[BRO] PhantomNicky_","weaponName":"flatline","action":"knockdown"}}
[2021-06-18 02:32:57.802 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":1,"damage":2595}}},"feature":"match_info"}
[2021-06-18 02:32:58.255 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Phantom_Lio","victimName":"[AllF] MasterKriff","weaponName":"volt","action":"knockdown"}}
[2021-06-18 02:33:01.253 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Phantom_Lio","victimName":"[PeX] ShironJackal","weaponName":"volt","action":"knockdown"}}
[2021-06-18 02:33:13.250 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Phantom_Lio","victimName":"[Quak] Decimal Duck","weaponName":"volt","action":"kill"}}
[2021-06-18 02:33:13.318 AM] {"name":"death","data":null}
[2021-06-18 02:33:13.749 AM] {"name":"kill_feed","data":{"attackerName":" Phantom_Lio","victimName":"[AllF] MasterKriff","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-06-18 02:33:13.800 AM] {"name":"kill_feed","data":{"attackerName":" Phantom_Lio","victimName":"[PeX] ShironJackal","weaponName":"Bleed Out","action":"Bleed Out"}}`;

const round9 = `
[2021-06-18 02:33:19.505 AM] {"name":"respawn","data":null}
[2021-06-18 02:34:06.263 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2021-06-18 02:34:30.449 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"24.000000","armor":true,"headshot":true}}
[2021-06-18 02:34:30.510 AM] {"info":{"me":{"totalDamageDealt":"2657"}},"feature":"damage"}
[2021-06-18 02:34:30.753 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":1,"damage":2619}}},"feature":"match_info"}
[2021-06-18 02:34:56.657 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:34:56.719 AM] {"info":{"me":{"totalDamageDealt":"2671"}},"feature":"damage"}
[2021-06-18 02:34:56.776 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":1,"damage":2633}}},"feature":"match_info"}
[2021-06-18 02:34:56.842 AM] {"name":"damage","data":{"targetName":"?.?.操你?.?","damageAmount":"14.000000","armor":false,"headshot":false}}
[2021-06-18 02:34:56.883 AM] {"info":{"me":{"totalDamageDealt":"2685"}},"feature":"damage"}
[2021-06-18 02:34:57.250 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":1,"damage":2647}}},"feature":"match_info"}
[2021-06-18 02:35:01.751 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PeX] ShironJackal","victimName":"[BRO] ?.?.操你?.?","weaponName":"eva8","action":"knockdown"}}
[2021-06-18 02:35:08.757 AM] {"name":"kill_feed","data":{"attackerName":"[PeX] ShironJackal","victimName":"[BRO] ?.?.操你?.?","weaponName":"Finisher","action":"Finisher"}}
[2021-06-18 02:35:08.812 AM] {"name":"assist","data":{"victimName":"?.?.操你?.?","type":"elimination"}}
[2021-06-18 02:35:08.854 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":2,"damage":2647}}},"feature":"match_info"}
[2021-06-18 02:35:20.101 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"12.000000","armor":false,"headshot":false}}
[2021-06-18 02:35:20.157 AM] {"info":{"me":{"totalDamageDealt":"2697"}},"feature":"damage"}
[2021-06-18 02:35:20.198 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"12.000000","armor":false,"headshot":false}}
[2021-06-18 02:35:20.240 AM] {"info":{"me":{"totalDamageDealt":"2709"}},"feature":"damage"}
[2021-06-18 02:35:20.294 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":2,"damage":2671}}},"feature":"match_info"}
[2021-06-18 02:35:20.405 AM] {"name":"damage","data":{"targetName":"PhantomNicky_","damageAmount":"12.000000","armor":false,"headshot":false}}
[2021-06-18 02:35:20.448 AM] {"info":{"me":{"totalDamageDealt":"2721"}},"feature":"damage"}
[2021-06-18 02:35:20.762 AM] {"name":"knockdown","data":{"victimName":"[BRO] PhantomNicky_\n"}}
[2021-06-18 02:35:20.810 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":"[BRO] PhantomNicky_","weaponName":"devotion","action":"knockdown"}}
[2021-06-18 02:35:20.852 AM] {"info":{"match_info":{"tabs":{"kills":9,"assists":2,"damage":2681}}},"feature":"match_info"}
[2021-06-18 02:35:25.250 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PeX] ShironJackal","victimName":"[BRO] PhantomNicky_","weaponName":"rui/ordnance_icons/grenade_arc","action":"kill"}}
[2021-06-18 02:35:25.303 AM] {"name":"kill","data":{"victimName":"[BRO] PhantomNicky_"}}
[2021-06-18 02:35:25.343 AM] {"info":{"match_info":{"tabs":{"kills":10,"assists":2,"damage":2681}}},"feature":"match_info"}
[2021-06-18 02:35:33.653 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"7.000000","armor":false,"headshot":false}}
[2021-06-18 02:35:33.694 AM] {"info":{"me":{"totalDamageDealt":"2728"}},"feature":"damage"}
[2021-06-18 02:35:33.754 AM] {"info":{"match_info":{"tabs":{"kills":10,"assists":2,"damage":2688}}},"feature":"match_info"}
[2021-06-18 02:35:34.163 AM] {"name":"damage","data":{"targetName":"Phantom_Lio","damageAmount":"9.000000","armor":false,"headshot":true}}
[2021-06-18 02:35:34.218 AM] {"info":{"me":{"totalDamageDealt":"2737"}},"feature":"damage"}
[2021-06-18 02:35:34.274 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[AllF] MasterKriff","victimName":" Phantom_Lio","weaponName":"eva8","action":"headshot_kill"}}
[2021-06-18 02:35:34.318 AM] {"name":"kill","data":{"victimName":"Phantom_Lio"}}
[2021-06-18 02:35:34.359 AM] {"info":{"match_info":{"tabs":{"kills":11,"assists":2,"damage":2689}}},"feature":"match_info"}`;

const matchEnd = `
[2021-06-18 02:35:58.961 AM] {"name":"match_end","data":null}
[2021-06-18 02:35:59.003 AM] {"info":{"match_info":{"pseudo_match_id":null}},"feature":"match_info"}
[2021-06-18 02:35:59.058 AM] {"info":{"match_info":{"team_info":{"team_state":null}}},"feature":"team"}
[2021-06-18 02:35:59.097 AM] {"info":{"game_info":{"match_state":"inactive"}},"feature":"match_state"}
[2021-06-18 02:35:59.149 AM] {"info":{"match_info":{"teammate_0":null}},"feature":"team"}
[2021-06-18 02:35:59.195 AM] {"info":{"match_info":{"roster_0":null}},"feature":"roster"}
[2021-06-18 02:35:59.241 AM] {"info":{"match_info":{"roster_1":null}},"feature":"roster"}
[2021-06-18 02:35:59.280 AM] {"info":{"match_info":{"roster_3":null}},"feature":"roster"}
[2021-06-18 02:35:59.337 AM] {"info":{"match_info":{"teammate_1":null}},"feature":"team"}
[2021-06-18 02:35:59.373 AM] {"info":{"match_info":{"roster_4":null}},"feature":"roster"}
[2021-06-18 02:35:59.409 AM] {"info":{"match_info":{"teammate_2":null}},"feature":"team"}
[2021-06-18 02:35:59.445 AM] {"info":{"match_info":{"roster_5":null}},"feature":"roster"}
[2021-06-18 02:35:59.479 AM] {"info":{"match_info":{"roster_2":null}},"feature":"roster"}
[2021-06-18 02:35:59.515 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2021-06-18 02:35:59.552 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2021-06-18 02:35:59.599 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2021-06-18 02:35:59.634 AM] {"info":{"me":{"inventory_3":null}},"feature":"inventory"}
[2021-06-18 02:35:59.670 AM] {"info":{"me":{"inventory_4":null}},"feature":"inventory"}
[2021-06-18 02:35:59.706 AM] {"info":{"me":{"inventory_5":null}},"feature":"inventory"}
[2021-06-18 02:36:00.965 AM] {"info":{"match_info":{"legendSelect_0":null}},"feature":"team"}
[2021-06-18 02:36:01.018 AM] {"info":{"match_info":{"legendSelect_2":null}},"feature":"team"}
[2021-06-18 02:36:01.067 AM] {"info":{"match_info":{"tabs":null}},"feature":"match_info"}
[2021-06-18 02:36:01.117 AM] {"info":{"match_info":{"legendSelect_1":null}},"feature":"team"}
`;
