import { v4 as uuid } from "uuid";

export const s12Control = (): string => `
[2022-04-02 10:02:57.633 AM] {"info":{"match_info":{"game_mode":"#CONTROL_NAME"}},"feature":"match_info"}
[2022-04-02 10:02:58.642 AM] {"info":{"match_info":{"location":{"x":"-15","y":"-21","z":"-57"}}},"feature":"location"}
[2022-04-02 10:02:58.646 AM] {"info":{"match_info":{"roster_0":{"name":"DomFoundDead","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.681 AM] {"info":{"match_info":{"roster_1":{"name":"Per Aspera Ad Astra","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.683 AM] {"info":{"match_info":{"roster_2":{"name":"H3llsGat313","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.685 AM] {"info":{"match_info":{"roster_3":{"name":"Pekoh246","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.687 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:02:58.689 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:02:58.691 AM] {"info":{"match_info":{"roster_5":{"name":"turtle","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.691 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:02:58.693 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.695 AM] {"info":{"match_info":{"roster_8":{"name":"EGOCELL","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.697 AM] {"info":{"match_info":{"roster_9":{"name":"Ace_Anomaly","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.698 AM] {"info":{"match_info":{"roster_7":{"name":"Hugatreedamnit","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.699 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:02:58.700 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:58.701 AM] {"info":{"match_info":{"roster_11":{"name":"Diisrupt","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:59.358 AM] {"info":{"match_info":{"roster_12":{"name":"mokumoku_kun","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:59.559 AM] {"info":{"match_info":{"roster_13":{"name":"Blake Gottardy","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:59.899 AM] {"info":{"match_info":{"roster_14":{"name":"SOP GOD","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:59.900 AM] {"info":{"match_info":{"roster_15":{"name":"Frameworks","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:59.910 AM] {"info":{"match_info":{"roster_16":{"name":"MasterChiefSelf","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:02:59.930 AM] {"info":{"match_info":{"roster_17":{"name":"doridoridoridori","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:03:01.287 AM] {"info":{"match_info":{"legendSelect_0":{"playerName":"[HPE] ImYourFavy","legendName":"#character_pathfinder_NAME","selectionOrder":"0","lead":true}}},"feature":"team"}
[2022-04-02 10:03:07.919 AM] {"info":{"match_info":{"legendSelect_0":{"playerName":"[HPE] ImYourFavy","legendName":"#character_pathfinder_NAME","selectionOrder":"0","lead":false}}},"feature":"team"}
[2022-04-02 10:03:07.922 AM] {"info":{"match_info":{"legendSelect_1":{"playerName":"MasterKriff","legendName":"#character_crypto_NAME","selectionOrder":"1","lead":true}}},"feature":"team"}
[2022-04-02 10:03:15.295 AM] {"info":{"match_info":{"legendSelect_1":{"playerName":"MasterKriff","legendName":"#character_crypto_NAME","selectionOrder":"1","lead":false}}},"feature":"team"}
[2022-04-02 10:03:15.297 AM] {"info":{"match_info":{"legendSelect_2":{"playerName":"Scott Santiago","legendName":"#character_wraith_NAME","selectionOrder":"2","lead":true}}},"feature":"team"}
[2022-04-02 10:03:33.259 AM] {"info":{"match_info":{"pseudo_match_id":"${uuid()}"}},"feature":"match_info"}
[2022-04-02 10:03:33.265 AM] {"info":{"match_info":{"team_info":{"team_state":"active"}}},"feature":"team"}
[2022-04-02 10:03:33.267 AM] {"name":"match_start","data":null}
[2022-04-02 10:03:33.268 AM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2022-04-02 10:03:33.269 AM] {"info":{"me":{"inUse":{"inUse":null}}},"feature":"inventory"}
[2022-04-02 10:03:33.270 AM] {"info":{"match_info":{"victory":null}},"feature":"rank"}
[2022-04-02 10:03:33.271 AM] {"info":{"me":{"totalDamageDealt":"0"}},"feature":"damage"}
[2022-04-02 10:03:33.272 AM] {"info":{"game_info":{"match_state":"active"}},"feature":"match_state"}
[2022-04-02 10:03:33.637 AM] {"info":{"match_info":{"location":{"x":"-15","y":"-21","z":"-58"}}},"feature":"location"}
[2022-04-02 10:03:53.289 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:03:53.497 AM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:03:53.499 AM] {"info":{"me":{"inventory_0":{"name":"unknown_164","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:03:53.502 AM] {"info":{"me":{"inventory_1":{"name":"unknown_165","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:03:53.504 AM] {"info":{"me":{"inventory_2":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:03:53.640 AM] {"info":{"match_info":{"location":{"x":"24","y":"79","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:53.773 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:03:54.132 AM] {"info":{"match_info":{"location":{"x":"24","y":"78","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:54.227 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"75"}}},"feature":"me"}
[2022-04-02 10:03:54.549 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:03:54.634 AM] {"info":{"match_info":{"location":{"x":"23","y":"78","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:55.133 AM] {"info":{"match_info":{"location":{"x":"22","y":"77","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:55.639 AM] {"info":{"match_info":{"location":{"x":"20","y":"76","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:56.134 AM] {"info":{"match_info":{"location":{"x":"19","y":"75","z":"-50"}}},"feature":"location"}
[2022-04-02 10:03:56.632 AM] {"info":{"match_info":{"location":{"x":"18","y":"74","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:57.134 AM] {"info":{"match_info":{"location":{"x":"16","y":"73","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:57.633 AM] {"info":{"match_info":{"location":{"x":"15","y":"72","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:58.133 AM] {"info":{"match_info":{"location":{"x":"15","y":"71","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:58.632 AM] {"info":{"match_info":{"location":{"x":"14","y":"69","z":"-51"}}},"feature":"location"}
[2022-04-02 10:03:59.135 AM] {"info":{"match_info":{"location":{"x":"13","y":"68","z":"-52"}}},"feature":"location"}
[2022-04-02 10:03:59.635 AM] {"info":{"match_info":{"location":{"x":"12","y":"66","z":"-52"}}},"feature":"location"}
[2022-04-02 10:04:00.132 AM] {"info":{"match_info":{"location":{"x":"11","y":"64","z":"-53"}}},"feature":"location"}
[2022-04-02 10:04:00.632 AM] {"info":{"match_info":{"location":{"x":"10","y":"63","z":"-53"}}},"feature":"location"}
[2022-04-02 10:04:03.633 AM] {"info":{"match_info":{"location":{"x":"10","y":"62","z":"-53"}}},"feature":"location"}
[2022-04-02 10:04:04.132 AM] {"info":{"match_info":{"location":{"x":"9","y":"61","z":"-53"}}},"feature":"location"}
[2022-04-02 10:04:04.637 AM] {"info":{"match_info":{"location":{"x":"9","y":"59","z":"-54"}}},"feature":"location"}
[2022-04-02 10:04:05.134 AM] {"info":{"match_info":{"location":{"x":"8","y":"57","z":"-55"}}},"feature":"location"}
[2022-04-02 10:04:05.635 AM] {"info":{"match_info":{"location":{"x":"7","y":"55","z":"-55"}}},"feature":"location"}
[2022-04-02 10:04:06.134 AM] {"info":{"match_info":{"location":{"x":"5","y":"54","z":"-55"}}},"feature":"location"}
[2022-04-02 10:04:06.632 AM] {"info":{"match_info":{"location":{"x":"4","y":"53","z":"-56"}}},"feature":"location"}
[2022-04-02 10:04:07.136 AM] {"info":{"match_info":{"location":{"x":"2","y":"52","z":"-56"}}},"feature":"location"}
[2022-04-02 10:04:07.634 AM] {"info":{"match_info":{"location":{"x":"2","y":"51","z":"-56"}}},"feature":"location"}
[2022-04-02 10:04:08.133 AM] {"info":{"match_info":{"location":{"x":"3","y":"50","z":"-55"}}},"feature":"location"}
[2022-04-02 10:04:08.633 AM] {"info":{"match_info":{"location":{"x":"4","y":"50","z":"-55"}}},"feature":"location"}
[2022-04-02 10:04:11.136 AM] {"info":{"match_info":{"location":{"x":"4","y":"48","z":"-55"}}},"feature":"location"}
[2022-04-02 10:04:11.472 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:04:11.636 AM] {"info":{"match_info":{"location":{"x":"2","y":"46","z":"-55"}}},"feature":"location"}
[2022-04-02 10:04:12.108 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:04:12.198 AM] {"info":{"match_info":{"location":{"x":"0","y":"42","z":"-55"}}},"feature":"location"}
[2022-04-02 10:04:12.699 AM] {"info":{"match_info":{"location":{"x":"-1","y":"37","z":"-56"}}},"feature":"location"}
[2022-04-02 10:04:13.197 AM] {"info":{"match_info":{"location":{"x":"-3","y":"32","z":"-56"}}},"feature":"location"}
[2022-04-02 10:04:13.207 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:04:13.697 AM] {"info":{"match_info":{"location":{"x":"-8","y":"24","z":"-55"}}},"feature":"location"}
[2022-04-02 10:04:14.199 AM] {"info":{"match_info":{"location":{"x":"-12","y":"17","z":"-56"}}},"feature":"location"}
[2022-04-02 10:04:14.697 AM] {"info":{"match_info":{"location":{"x":"-15","y":"11","z":"-57"}}},"feature":"location"}
[2022-04-02 10:04:15.199 AM] {"info":{"match_info":{"location":{"x":"-19","y":"5","z":"-59"}}},"feature":"location"}
[2022-04-02 10:04:15.699 AM] {"info":{"match_info":{"location":{"x":"-23","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:16.197 AM] {"info":{"match_info":{"location":{"x":"-28","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:16.699 AM] {"info":{"match_info":{"location":{"x":"-31","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:17.005 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:04:17.699 AM] {"info":{"match_info":{"location":{"x":"-31","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:18.197 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:18.697 AM] {"info":{"match_info":{"location":{"x":"-31","y":"-3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:19.195 AM] {"info":{"match_info":{"location":{"x":"-32","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:19.699 AM] {"info":{"match_info":{"location":{"x":"-33","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:20.196 AM] {"info":{"match_info":{"location":{"x":"-34","y":"-6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:20.699 AM] {"info":{"match_info":{"location":{"x":"-36","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:21.195 AM] {"info":{"match_info":{"location":{"x":"-37","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:21.385 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:04:21.696 AM] {"info":{"match_info":{"location":{"x":"-38","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:22.198 AM] {"info":{"match_info":{"location":{"x":"-39","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:22.696 AM] {"info":{"match_info":{"location":{"x":"-40","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:22.936 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:04:23.198 AM] {"info":{"match_info":{"location":{"x":"-40","y":"-12","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:23.699 AM] {"info":{"match_info":{"location":{"x":"-40","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:24.695 AM] {"info":{"match_info":{"location":{"x":"-41","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:25.201 AM] {"info":{"match_info":{"location":{"x":"-41","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:25.698 AM] {"info":{"match_info":{"location":{"x":"-41","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:26.144 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:04:26.195 AM] {"info":{"match_info":{"location":{"x":"-40","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:26.697 AM] {"info":{"match_info":{"location":{"x":"-38","y":"-12","z":"-60"}}},"feature":"location"}
[2022-04-02 10:04:27.198 AM] {"info":{"match_info":{"location":{"x":"-37","y":"-13","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:27.699 AM] {"info":{"match_info":{"location":{"x":"-36","y":"-14","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:28.197 AM] {"info":{"match_info":{"location":{"x":"-36","y":"-15","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:28.698 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-16","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:29.199 AM] {"info":{"match_info":{"location":{"x":"-34","y":"-18","z":"-61"}}},"feature":"location"}
[2022-04-02 10:04:29.695 AM] {"info":{"match_info":{"location":{"x":"-34","y":"-19","z":"-62"}}},"feature":"location"}
[2022-04-02 10:04:29.952 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:04:30.199 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Scott Santiago","victimName":"[sus] Ace_Anomaly","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:04:30.201 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-20","z":"-62"}}},"feature":"location"}
[2022-04-02 10:04:30.696 AM] {"info":{"match_info":{"location":{"x":"-36","y":"-19","z":"-62"}}},"feature":"location"}
[2022-04-02 10:04:31.262 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:04:31.699 AM] {"info":{"match_info":{"location":{"x":"-37","y":"-18","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:32.196 AM] {"info":{"match_info":{"location":{"x":"-39","y":"-17","z":"-62"}}},"feature":"location"}
[2022-04-02 10:04:32.696 AM] {"info":{"match_info":{"location":{"x":"-41","y":"-16","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:32.887 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:04:33.197 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-17","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:33.419 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:04:33.433 AM] {"info":{"me":{"totalDamageDealt":"13"}},"feature":"damage"}
[2022-04-02 10:04:33.472 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:04:33.474 AM] {"info":{"me":{"totalDamageDealt":"26"}},"feature":"damage"}
[2022-04-02 10:04:33.696 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-16","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:34.068 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"17.000000","armor":true,"headshot":true}}
[2022-04-02 10:04:34.071 AM] {"info":{"me":{"totalDamageDealt":"43"}},"feature":"damage"}
[2022-04-02 10:04:34.120 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:04:34.122 AM] {"info":{"me":{"totalDamageDealt":"56"}},"feature":"damage"}
[2022-04-02 10:04:34.172 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:04:34.174 AM] {"info":{"me":{"totalDamageDealt":"69"}},"feature":"damage"}
[2022-04-02 10:04:34.274 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"6.000000","armor":true,"headshot":false}}
[2022-04-02 10:04:34.276 AM] {"info":{"me":{"totalDamageDealt":"75"}},"feature":"damage"}
[2022-04-02 10:04:34.277 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"7.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:34.278 AM] {"info":{"me":{"totalDamageDealt":"82"}},"feature":"damage"}
[2022-04-02 10:04:34.319 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:34.320 AM] {"info":{"me":{"totalDamageDealt":"95"}},"feature":"damage"}
[2022-04-02 10:04:34.367 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:34.371 AM] {"info":{"me":{"totalDamageDealt":"108"}},"feature":"damage"}
[2022-04-02 10:04:34.470 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:34.472 AM] {"info":{"me":{"totalDamageDealt":"121"}},"feature":"damage"}
[2022-04-02 10:04:34.769 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:34.771 AM] {"info":{"me":{"totalDamageDealt":"134"}},"feature":"damage"}
[2022-04-02 10:04:35.200 AM] {"info":{"match_info":{"location":{"x":"-41","y":"-17","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:35.340 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:04:35.696 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] turtle","victimName":"[PN15] Diisrupt","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:04:35.900 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"death"}}},"feature":"team"}
[2022-04-02 10:04:35.902 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:04:36.201 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" SOP GOD","victimName":" Scott Santiago","weaponName":"car","action":"kill"}}
[2022-04-02 10:04:36.578 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"9.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:36.581 AM] {"info":{"me":{"totalDamageDealt":"143"}},"feature":"damage"}
[2022-04-02 10:04:36.582 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"10.000000","armor":false,"headshot":true}}
[2022-04-02 10:04:36.583 AM] {"info":{"me":{"totalDamageDealt":"153"}},"feature":"damage"}
[2022-04-02 10:04:36.586 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"9.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:36.588 AM] {"info":{"me":{"totalDamageDealt":"162"}},"feature":"damage"}
[2022-04-02 10:04:36.590 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2022-04-02 10:04:36.698 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":" EGOCELL","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:04:36.701 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-17","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:37.197 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-16","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:37.695 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-17","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:38.195 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-18","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:38.244 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:04:38.699 AM] {"info":{"match_info":{"location":{"x":"-44","y":"-18","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:39.195 AM] {"info":{"match_info":{"location":{"x":"-44","y":"-19","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:39.699 AM] {"info":{"match_info":{"location":{"x":"-45","y":"-18","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:40.142 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:04:40.196 AM] {"info":{"match_info":{"location":{"x":"-46","y":"-18","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:40.696 AM] {"info":{"match_info":{"location":{"x":"-48","y":"-18","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:41.197 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-17","z":"-62"}}},"feature":"location"}
[2022-04-02 10:04:41.508 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:04:41.698 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-17","z":"-62"}}},"feature":"location"}
[2022-04-02 10:04:41.933 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:04:45.229 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:04:47.571 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:04:47.574 AM] {"info":{"me":{"totalDamageDealt":"175"}},"feature":"damage"}
[2022-04-02 10:04:47.676 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:04:47.678 AM] {"info":{"me":{"totalDamageDealt":"188"}},"feature":"damage"}
[2022-04-02 10:04:47.700 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" SOP GOD","victimName":"[STB] Per Aspera Ad Astra","weaponName":"car","action":"kill"}}
[2022-04-02 10:04:47.726 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"6.000000","armor":true,"headshot":false}}
[2022-04-02 10:04:47.729 AM] {"info":{"me":{"totalDamageDealt":"194"}},"feature":"damage"}
[2022-04-02 10:04:47.730 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"7.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:47.731 AM] {"info":{"me":{"totalDamageDealt":"201"}},"feature":"damage"}
[2022-04-02 10:04:47.929 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:47.930 AM] {"info":{"me":{"totalDamageDealt":"211"}},"feature":"damage"}
[2022-04-02 10:04:47.968 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:47.970 AM] {"info":{"me":{"totalDamageDealt":"221"}},"feature":"damage"}
[2022-04-02 10:04:48.076 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:48.080 AM] {"info":{"me":{"totalDamageDealt":"234"}},"feature":"damage"}
[2022-04-02 10:04:48.125 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:48.127 AM] {"info":{"me":{"totalDamageDealt":"247"}},"feature":"damage"}
[2022-04-02 10:04:48.173 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:48.175 AM] {"info":{"me":{"totalDamageDealt":"260"}},"feature":"damage"}
[2022-04-02 10:04:48.196 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-16","z":"-62"}}},"feature":"location"}
[2022-04-02 10:04:48.371 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:48.374 AM] {"info":{"me":{"totalDamageDealt":"273"}},"feature":"damage"}
[2022-04-02 10:04:48.419 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:48.422 AM] {"info":{"me":{"totalDamageDealt":"286"}},"feature":"damage"}
[2022-04-02 10:04:48.696 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-17","z":"-62"}}},"feature":"location"}
[2022-04-02 10:04:49.196 AM] {"info":{"match_info":{"location":{"x":"-48","y":"-17","z":"-63"}}},"feature":"location"}
[2022-04-02 10:04:49.544 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:04:49.921 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"7.000000","armor":false,"headshot":false}}
[2022-04-02 10:04:49.924 AM] {"info":{"me":{"totalDamageDealt":"293"}},"feature":"damage"}
[2022-04-02 10:04:50.200 AM] {"info":{"match_info":{"location":{"x":"-48","y":"-17","z":"-62"}}},"feature":"location"}
[2022-04-02 10:04:51.203 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" mokumoku_kun","victimName":" SOP GOD","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:04:51.647 AM] {"name":"death","data":null}
[2022-04-02 10:04:51.650 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"death"}}},"feature":"team"}
[2022-04-02 10:04:51.652 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:05:00.895 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:05:00.899 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:05:00.902 AM] {"info":{"match_info":{"team_info":{"team_state":"eliminated"}}},"feature":"team"}
[2022-04-02 10:05:00.904 AM] {"info":{"match_info":{"victory":false}},"feature":"rank"}
[2022-04-02 10:05:05.210 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:05:05.212 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:05:17.221 AM] {"name":"respawn","data":null}
[2022-04-02 10:05:17.226 AM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2022-04-02 10:05:17.230 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:05:17.232 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:05:17.235 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:05:17.236 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2022-04-02 10:05:17.238 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2022-04-02 10:05:17.240 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2022-04-02 10:05:17.241 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:05:17.243 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:05:17.246 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-02 10:05:17.248 AM] {"info":{"match_info":{"location":{"x":"-23","y":"-17","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:17.335 AM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:05:17.342 AM] {"info":{"me":{"inventory_0":{"name":"unknown_164","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:05:17.345 AM] {"info":{"me":{"inventory_1":{"name":"unknown_165","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:05:17.347 AM] {"info":{"me":{"inventory_2":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:05:17.652 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:05:18.113 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:05:18.128 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"5"}}},"feature":"me"}
[2022-04-02 10:05:18.225 AM] {"info":{"match_info":{"location":{"x":"-23","y":"-16","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:18.247 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":"[STB] Per Aspera Ad Astra","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:05:18.726 AM] {"info":{"match_info":{"location":{"x":"-23","y":"-15","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:19.229 AM] {"info":{"match_info":{"location":{"x":"-24","y":"-13","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:19.729 AM] {"info":{"match_info":{"location":{"x":"-25","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:20.230 AM] {"info":{"match_info":{"location":{"x":"-26","y":"-10","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:20.727 AM] {"info":{"match_info":{"location":{"x":"-27","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:21.226 AM] {"info":{"match_info":{"location":{"x":"-28","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:21.725 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:22.230 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-11","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:22.572 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:05:22.727 AM] {"info":{"match_info":{"location":{"x":"-31","y":"-12","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:23.023 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"9.000000","armor":true,"headshot":false}}
[2022-04-02 10:05:23.027 AM] {"info":{"me":{"totalDamageDealt":"302"}},"feature":"damage"}
[2022-04-02 10:05:23.325 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:05:23.329 AM] {"info":{"me":{"totalDamageDealt":"313"}},"feature":"damage"}
[2022-04-02 10:05:23.422 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:05:23.425 AM] {"info":{"me":{"totalDamageDealt":"324"}},"feature":"damage"}
[2022-04-02 10:05:23.669 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:05:23.673 AM] {"info":{"me":{"totalDamageDealt":"335"}},"feature":"damage"}
[2022-04-02 10:05:23.728 AM] {"info":{"match_info":{"location":{"x":"-32","y":"-13","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:24.022 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:05:24.025 AM] {"info":{"me":{"totalDamageDealt":"346"}},"feature":"damage"}
[2022-04-02 10:05:24.121 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"1.000000","armor":true,"headshot":false}}
[2022-04-02 10:05:24.125 AM] {"info":{"me":{"totalDamageDealt":"347"}},"feature":"damage"}
[2022-04-02 10:05:24.127 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:05:24.129 AM] {"info":{"me":{"totalDamageDealt":"357"}},"feature":"damage"}
[2022-04-02 10:05:24.169 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":false,"headshot":false}}
[2022-04-02 10:05:24.172 AM] {"info":{"me":{"totalDamageDealt":"368"}},"feature":"damage"}
[2022-04-02 10:05:24.227 AM] {"info":{"match_info":{"location":{"x":"-33","y":"-13","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:24.727 AM] {"info":{"match_info":{"location":{"x":"-32","y":"-12","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:24.835 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:05:25.225 AM] {"info":{"match_info":{"location":{"x":"-33","y":"-12","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:25.726 AM] {"info":{"match_info":{"location":{"x":"-32","y":"-12","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:25.779 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"6.000000","armor":false,"headshot":false}}
[2022-04-02 10:05:25.782 AM] {"info":{"me":{"totalDamageDealt":"374"}},"feature":"damage"}
[2022-04-02 10:05:25.789 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"25"}}},"feature":"me"}
[2022-04-02 10:05:26.230 AM] {"info":{"match_info":{"location":{"x":"-33","y":"-13","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:26.245 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] turtle","victimName":"[FSFP] MasterChiefSelf","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:05:26.247 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":" Frameworks","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:05:26.728 AM] {"info":{"match_info":{"location":{"x":"-34","y":"-13","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:26.986 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:05:27.227 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-14","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:27.728 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-16","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:28.226 AM] {"info":{"match_info":{"location":{"x":"-34","y":"-18","z":"-62"}}},"feature":"location"}
[2022-04-02 10:05:28.728 AM] {"info":{"match_info":{"location":{"x":"-34","y":"-19","z":"-62"}}},"feature":"location"}
[2022-04-02 10:05:29.229 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-20","z":"-62"}}},"feature":"location"}
[2022-04-02 10:05:30.285 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:05:31.759 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-19","z":"-62"}}},"feature":"location"}
[2022-04-02 10:05:31.837 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:05:32.259 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-17","z":"-62"}}},"feature":"location"}
[2022-04-02 10:05:32.758 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-16","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:33.261 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-15","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:33.760 AM] {"info":{"match_info":{"location":{"x":"-36","y":"-13","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:34.261 AM] {"info":{"match_info":{"location":{"x":"-37","y":"-12","z":"-61"}}},"feature":"location"}
[2022-04-02 10:05:34.759 AM] {"info":{"match_info":{"location":{"x":"-37","y":"-12","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:35.260 AM] {"info":{"match_info":{"location":{"x":"-38","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:35.278 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:05:35.763 AM] {"info":{"match_info":{"location":{"x":"-38","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:36.257 AM] {"info":{"match_info":{"location":{"x":"-39","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:36.764 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] turtle","victimName":"[sus] Ace_Anomaly","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:05:36.766 AM] {"info":{"match_info":{"location":{"x":"-41","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:37.261 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:39.258 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:39.758 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:40.005 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:05:40.261 AM] {"info":{"match_info":{"location":{"x":"-44","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:40.761 AM] {"info":{"match_info":{"location":{"x":"-45","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:41.147 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:05:41.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] turtle","victimName":" EGOCELL","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:05:41.265 AM] {"info":{"match_info":{"location":{"x":"-46","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:41.761 AM] {"info":{"match_info":{"location":{"x":"-48","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:42.263 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:43.259 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:44.259 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:44.760 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:45.258 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:45.272 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"17.000000","armor":true,"headshot":true}}
[2022-04-02 10:05:45.275 AM] {"info":{"me":{"totalDamageDealt":"391"}},"feature":"damage"}
[2022-04-02 10:05:45.759 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:46.370 AM] {"name":"damage","data":{"targetName":"Diisrupt","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:05:46.374 AM] {"info":{"me":{"totalDamageDealt":"404"}},"feature":"damage"}
[2022-04-02 10:05:46.762 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:47.258 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:48.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PN15] Diisrupt","victimName":"[STB] turtle","weaponName":"car","action":"kill"}}
[2022-04-02 10:05:49.262 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:49.760 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:52.259 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:52.760 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:54.763 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:55.262 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:55.761 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:57.813 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:05:59.261 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:05:59.373 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:05:59.760 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:00.263 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:00.763 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:01.259 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:01.651 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:06:01.655 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:06:01.762 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" DomFoundDead","victimName":"[HPE] ImYourFavy","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:06:01.764 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:02.262 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:02.710 AM] {"info":{"me":{"inUse":{"inUse":"Arc Star"}}},"feature":"inventory"}
[2022-04-02 10:06:02.760 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:03.758 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-3","z":"-59"}}},"feature":"location"}
[2022-04-02 10:06:03.934 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2022-04-02 10:06:04.261 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:04.315 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:06:05.261 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:06.259 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-3","z":"-59"}}},"feature":"location"}
[2022-04-02 10:06:06.760 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:06.820 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"17.000000","armor":false,"headshot":true}}
[2022-04-02 10:06:06.822 AM] {"info":{"me":{"totalDamageDealt":"421"}},"feature":"damage"}
[2022-04-02 10:06:07.260 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:07.521 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:07.525 AM] {"info":{"me":{"totalDamageDealt":"431"}},"feature":"damage"}
[2022-04-02 10:06:07.673 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:07.675 AM] {"info":{"me":{"totalDamageDealt":"441"}},"feature":"damage"}
[2022-04-02 10:06:09.261 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:09.761 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:10.005 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:06:10.259 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:10.530 AM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:06:10.762 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:10.832 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:06:11.260 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:12.261 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:12.761 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:13.261 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:13.626 AM] {"name":"damage","data":{"targetName":"Diisrupt","damageAmount":"45.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:13.629 AM] {"info":{"me":{"totalDamageDealt":"486"}},"feature":"damage"}
[2022-04-02 10:06:14.263 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" mokumoku_kun","victimName":"[PN15] Diisrupt","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:06:14.267 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:14.529 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:06:15.761 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:16.264 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:16.764 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:17.261 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":"[STB] Per Aspera Ad Astra","weaponName":"energy_ar","action":"headshot_kill"}}
[2022-04-02 10:06:17.263 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:17.409 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:06:17.502 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:06:17.505 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:06:17.759 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:18.263 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:18.761 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:19.262 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:21.259 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Pekoh246","victimName":"[STB] turtle","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:06:22.801 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:06:24.261 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[dUhm] doridoridoridori","victimName":" Pekoh246","weaponName":"car","action":"kill"}}
[2022-04-02 10:06:26.261 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:26.762 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Meow] Hugatreedamnit","victimName":" Frameworks","weaponName":"prowler","action":"kill"}}
[2022-04-02 10:06:26.766 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:26.924 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:06:26.927 AM] {"info":{"me":{"totalDamageDealt":"499"}},"feature":"damage"}
[2022-04-02 10:06:27.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" SOP GOD","victimName":"[Meow] Hugatreedamnit","weaponName":"car","action":"kill"}}
[2022-04-02 10:06:28.259 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:28.758 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:29.964 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:06:30.757 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:31.571 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"17.000000","armor":true,"headshot":false}}
[2022-04-02 10:06:31.574 AM] {"info":{"me":{"totalDamageDealt":"516"}},"feature":"damage"}
[2022-04-02 10:06:31.577 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"28.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:31.579 AM] {"info":{"me":{"totalDamageDealt":"544"}},"feature":"damage"}
[2022-04-02 10:06:31.759 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:31.925 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"76.000000","armor":false,"headshot":true}}
[2022-04-02 10:06:31.928 AM] {"info":{"me":{"totalDamageDealt":"620"}},"feature":"damage"}
[2022-04-02 10:06:32.260 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":" SOP GOD","weaponName":"wingman","action":"headshot_kill"}}
[2022-04-02 10:06:33.262 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:35.260 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:35.760 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:36.261 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:36.760 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:36.768 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"45.000000","armor":true,"headshot":false}}
[2022-04-02 10:06:36.771 AM] {"info":{"me":{"totalDamageDealt":"665"}},"feature":"damage"}
[2022-04-02 10:06:37.262 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:37.574 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"30.000000","armor":true,"headshot":false}}
[2022-04-02 10:06:37.578 AM] {"info":{"me":{"totalDamageDealt":"695"}},"feature":"damage"}
[2022-04-02 10:06:37.580 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"11.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:37.582 AM] {"info":{"me":{"totalDamageDealt":"706"}},"feature":"damage"}
[2022-04-02 10:06:37.758 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:38.261 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:38.712 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:06:39.131 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"50"}}},"feature":"me"}
[2022-04-02 10:06:39.261 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:06:39.760 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:39.825 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:39.828 AM] {"info":{"me":{"totalDamageDealt":"719"}},"feature":"damage"}
[2022-04-02 10:06:40.124 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:40.128 AM] {"info":{"me":{"totalDamageDealt":"732"}},"feature":"damage"}
[2022-04-02 10:06:40.257 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:41.262 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:41.763 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-11","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:43.275 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:43.278 AM] {"info":{"me":{"totalDamageDealt":"745"}},"feature":"damage"}
[2022-04-02 10:06:43.422 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:43.425 AM] {"info":{"me":{"totalDamageDealt":"758"}},"feature":"damage"}
[2022-04-02 10:06:43.471 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"16.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:43.474 AM] {"info":{"me":{"totalDamageDealt":"774"}},"feature":"damage"}
[2022-04-02 10:06:43.573 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"16.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:43.576 AM] {"info":{"me":{"totalDamageDealt":"790"}},"feature":"damage"}
[2022-04-02 10:06:43.671 AM] {"name":"damage","data":{"targetName":"MasterChiefSelf","damageAmount":"16.000000","armor":false,"headshot":false}}
[2022-04-02 10:06:43.674 AM] {"info":{"me":{"totalDamageDealt":"806"}},"feature":"damage"}
[2022-04-02 10:06:43.758 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":"[FSFP] MasterChiefSelf","weaponName":"car","action":"kill"}}
[2022-04-02 10:06:45.595 AM] {"info":{"me":{"inUse":{"inUse":"Health/Shield"}}},"feature":"inventory"}
[2022-04-02 10:06:47.040 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:06:47.784 AM] {"info":{"me":{"inUse":{"inUse":"Health/Shield"}}},"feature":"inventory"}
[2022-04-02 10:06:48.757 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-10","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:50.758 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:51.764 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-10","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:53.262 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:06:56.175 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:06:56.453 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:07:02.760 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:04.258 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:04.787 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:07:05.263 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Scott Santiago","victimName":" EGOCELL","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:07:05.269 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:06.261 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-7","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:06.759 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-7","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:07.263 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-7","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:07.759 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-7","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:08.259 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-7","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:08.760 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:09.250 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:07:09.254 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:07:09.264 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" DomFoundDead","victimName":"[HPE] ImYourFavy","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:07:09.267 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:09.765 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:10.258 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:10.763 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:13.262 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:14.942 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:07:15.259 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] turtle","victimName":" DomFoundDead","weaponName":"rui/ordnance_icons/grenade_incendiary","action":"kill"}}
[2022-04-02 10:07:15.760 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:17.262 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:17.303 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:07:17.306 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:07:17.762 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:18.263 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:19.927 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"45.000000","armor":true,"headshot":false}}
[2022-04-02 10:07:19.931 AM] {"info":{"me":{"totalDamageDealt":"851"}},"feature":"damage"}
[2022-04-02 10:07:20.759 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[FSFP] MasterChiefSelf","victimName":"[dUhm] doridoridoridori","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:07:21.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" SOP GOD","victimName":"[STB] turtle","weaponName":"car","action":"kill"}}
[2022-04-02 10:07:21.761 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:21.924 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"2.000000","armor":true,"headshot":false}}
[2022-04-02 10:07:21.929 AM] {"info":{"me":{"totalDamageDealt":"853"}},"feature":"damage"}
[2022-04-02 10:07:21.932 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"43.000000","armor":false,"headshot":false}}
[2022-04-02 10:07:21.934 AM] {"info":{"me":{"totalDamageDealt":"896"}},"feature":"damage"}
[2022-04-02 10:07:22.259 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:22.760 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:23.258 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:23.761 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:27.259 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Meow] Hugatreedamnit","victimName":"[sus] Blake Gottardy","weaponName":"prowler","action":"kill"}}
[2022-04-02 10:07:27.264 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:30.264 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:31.265 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:31.762 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:32.258 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:33.243 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2022-04-02 10:07:33.263 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:33.758 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Scott Santiago","victimName":" Frameworks","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:07:34.263 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:34.758 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:35.762 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:36.759 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:37.132 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:07:37.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" SOP GOD","victimName":"[STB] Per Aspera Ad Astra","weaponName":"car","action":"kill"}}
[2022-04-02 10:07:38.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" mokumoku_kun","victimName":" SOP GOD","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:07:38.266 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:38.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Scott Santiago","victimName":"[PN15] Diisrupt","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:07:38.764 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:39.261 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-10","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:40.762 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-11","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:41.938 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:07:43.243 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:07:52.254 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:07:52.878 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:07:53.259 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-10","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:53.762 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:56.261 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:56.392 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:07:56.760 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:57.262 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:57.761 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:58.259 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:07:58.758 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:58.890 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:07:59.258 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:07:59.758 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:00.761 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:01.758 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:03.760 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:04.215 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:08:04.760 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:05.230 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:08:05.263 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:05.761 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:06.259 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:06.762 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:07.261 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:07.759 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-12","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:08.259 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:08.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[dUhm] doridoridoridori","victimName":"[FSFP] MasterChiefSelf","weaponName":"car","action":"kill"}}
[2022-04-02 10:08:08.764 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:09.260 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:09.759 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:10.258 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:10.281 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone_emp"}}},"feature":"inventory"}
[2022-04-02 10:08:10.431 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-02 10:08:10.760 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:11.260 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:11.457 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:08:11.762 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:12.259 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:12.761 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:12.931 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"43.000000","armor":false,"headshot":false}}
[2022-04-02 10:08:12.936 AM] {"info":{"me":{"totalDamageDealt":"939"}},"feature":"damage"}
[2022-04-02 10:08:13.260 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:13.760 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:14.261 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:14.761 AM] {"info":{"match_info":{"location":{"x":"-47","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:15.261 AM] {"info":{"match_info":{"location":{"x":"-46","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:15.758 AM] {"info":{"match_info":{"location":{"x":"-44","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:16.259 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:16.760 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:17.261 AM] {"info":{"match_info":{"location":{"x":"-40","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:17.759 AM] {"info":{"match_info":{"location":{"x":"-38","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:18.261 AM] {"info":{"match_info":{"location":{"x":"-36","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:18.762 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-7","z":"-61"}}},"feature":"location"}
[2022-04-02 10:08:19.259 AM] {"info":{"match_info":{"location":{"x":"-34","y":"-6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:08:19.760 AM] {"info":{"match_info":{"location":{"x":"-33","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:08:20.259 AM] {"info":{"match_info":{"location":{"x":"-31","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:20.762 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:08:21.262 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:08:21.759 AM] {"info":{"match_info":{"location":{"x":"-28","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:08:22.259 AM] {"info":{"match_info":{"location":{"x":"-27","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:08:22.759 AM] {"info":{"match_info":{"location":{"x":"-26","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:08:23.261 AM] {"info":{"match_info":{"location":{"x":"-25","y":"2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:23.762 AM] {"info":{"match_info":{"location":{"x":"-23","y":"3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:24.258 AM] {"info":{"match_info":{"location":{"x":"-22","y":"4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:24.757 AM] {"info":{"match_info":{"location":{"x":"-21","y":"6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:25.261 AM] {"info":{"match_info":{"location":{"x":"-21","y":"7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:25.761 AM] {"info":{"match_info":{"location":{"x":"-19","y":"8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:08:26.258 AM] {"info":{"match_info":{"location":{"x":"-19","y":"10","z":"-59"}}},"feature":"location"}
[2022-04-02 10:08:26.762 AM] {"info":{"match_info":{"location":{"x":"-18","y":"11","z":"-59"}}},"feature":"location"}
[2022-04-02 10:08:27.262 AM] {"info":{"match_info":{"location":{"x":"-17","y":"12","z":"-59"}}},"feature":"location"}
[2022-04-02 10:08:27.758 AM] {"info":{"match_info":{"location":{"x":"-16","y":"13","z":"-59"}}},"feature":"location"}
[2022-04-02 10:08:28.260 AM] {"info":{"match_info":{"location":{"x":"-15","y":"14","z":"-58"}}},"feature":"location"}
[2022-04-02 10:08:28.761 AM] {"info":{"match_info":{"location":{"x":"-14","y":"16","z":"-58"}}},"feature":"location"}
[2022-04-02 10:08:29.259 AM] {"info":{"match_info":{"location":{"x":"-14","y":"17","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:29.760 AM] {"info":{"match_info":{"location":{"x":"-13","y":"18","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:30.155 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:08:30.261 AM] {"info":{"match_info":{"location":{"x":"-12","y":"20","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:30.759 AM] {"info":{"match_info":{"location":{"x":"-12","y":"22","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:31.261 AM] {"info":{"match_info":{"location":{"x":"-12","y":"23","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:31.356 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:08:31.759 AM] {"info":{"match_info":{"location":{"x":"-11","y":"24","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:32.262 AM] {"info":{"match_info":{"location":{"x":"-11","y":"25","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:32.763 AM] {"info":{"match_info":{"location":{"x":"-10","y":"26","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:32.908 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:08:33.260 AM] {"info":{"match_info":{"location":{"x":"-9","y":"27","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:33.762 AM] {"info":{"match_info":{"location":{"x":"-9","y":"28","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:34.265 AM] {"info":{"match_info":{"location":{"x":"-9","y":"29","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:34.758 AM] {"info":{"match_info":{"location":{"x":"-8","y":"30","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:35.259 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" DomFoundDead","victimName":"[dUhm] doridoridoridori","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:08:35.263 AM] {"info":{"match_info":{"location":{"x":"-8","y":"31","z":"-58"}}},"feature":"location"}
[2022-04-02 10:08:35.763 AM] {"info":{"match_info":{"location":{"x":"-8","y":"33","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:36.258 AM] {"info":{"match_info":{"location":{"x":"-9","y":"34","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:36.761 AM] {"info":{"match_info":{"location":{"x":"-10","y":"33","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:37.262 AM] {"info":{"match_info":{"location":{"x":"-10","y":"33","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:37.759 AM] {"info":{"match_info":{"location":{"x":"-10","y":"34","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:38.759 AM] {"info":{"match_info":{"location":{"x":"-10","y":"33","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:39.258 AM] {"info":{"match_info":{"location":{"x":"-10","y":"34","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:39.277 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"45.000000","armor":true,"headshot":false}}
[2022-04-02 10:08:39.282 AM] {"info":{"me":{"totalDamageDealt":"984"}},"feature":"damage"}
[2022-04-02 10:08:40.261 AM] {"info":{"match_info":{"location":{"x":"-9","y":"33","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:41.264 AM] {"info":{"match_info":{"location":{"x":"-10","y":"33","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:41.761 AM] {"info":{"match_info":{"location":{"x":"-10","y":"33","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:42.262 AM] {"info":{"match_info":{"location":{"x":"-10","y":"33","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:42.759 AM] {"info":{"match_info":{"location":{"x":"-9","y":"33","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:43.262 AM] {"info":{"match_info":{"location":{"x":"-9","y":"34","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:43.760 AM] {"info":{"match_info":{"location":{"x":"-8","y":"35","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:44.260 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" EGOCELL","victimName":"[Meow] Hugatreedamnit","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:08:44.265 AM] {"info":{"match_info":{"location":{"x":"-7","y":"35","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:44.761 AM] {"info":{"match_info":{"location":{"x":"-7","y":"35","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:45.259 AM] {"info":{"match_info":{"location":{"x":"-8","y":"35","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:45.764 AM] {"info":{"match_info":{"location":{"x":"-8","y":"36","z":"-57"}}},"feature":"location"}
[2022-04-02 10:08:45.771 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:08:47.259 AM] {"info":{"match_info":{"location":{"x":"-7","y":"36","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:48.260 AM] {"info":{"match_info":{"location":{"x":"-6","y":"37","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:48.760 AM] {"info":{"match_info":{"location":{"x":"-6","y":"37","z":"-55"}}},"feature":"location"}
[2022-04-02 10:08:49.263 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Scott Santiago","victimName":" Pekoh246","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:08:49.268 AM] {"info":{"match_info":{"location":{"x":"-6","y":"38","z":"-55"}}},"feature":"location"}
[2022-04-02 10:08:49.766 AM] {"info":{"match_info":{"location":{"x":"-6","y":"39","z":"-55"}}},"feature":"location"}
[2022-04-02 10:08:49.872 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:08:50.763 AM] {"info":{"match_info":{"location":{"x":"-6","y":"39","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:51.259 AM] {"info":{"match_info":{"location":{"x":"-6","y":"40","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:51.758 AM] {"info":{"match_info":{"location":{"x":"-7","y":"40","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:52.263 AM] {"info":{"match_info":{"location":{"x":"-8","y":"40","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:53.231 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:08:53.236 AM] {"info":{"me":{"totalDamageDealt":"997"}},"feature":"damage"}
[2022-04-02 10:08:53.262 AM] {"info":{"match_info":{"location":{"x":"-9","y":"40","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:53.729 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:08:53.733 AM] {"info":{"me":{"totalDamageDealt":"1010"}},"feature":"damage"}
[2022-04-02 10:08:54.125 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:08:54.130 AM] {"info":{"me":{"totalDamageDealt":"1023"}},"feature":"damage"}
[2022-04-02 10:08:54.377 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":true,"headshot":false}}
[2022-04-02 10:08:54.385 AM] {"info":{"me":{"totalDamageDealt":"1033"}},"feature":"damage"}
[2022-04-02 10:08:54.476 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":true,"headshot":false}}
[2022-04-02 10:08:54.481 AM] {"info":{"me":{"totalDamageDealt":"1043"}},"feature":"damage"}
[2022-04-02 10:08:54.574 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":true,"headshot":false}}
[2022-04-02 10:08:54.578 AM] {"info":{"me":{"totalDamageDealt":"1053"}},"feature":"damage"}
[2022-04-02 10:08:54.634 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"6.000000","armor":true,"headshot":false}}
[2022-04-02 10:08:54.639 AM] {"info":{"me":{"totalDamageDealt":"1059"}},"feature":"damage"}
[2022-04-02 10:08:54.643 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"4.000000","armor":false,"headshot":false}}
[2022-04-02 10:08:54.648 AM] {"info":{"me":{"totalDamageDealt":"1063"}},"feature":"damage"}
[2022-04-02 10:08:54.763 AM] {"info":{"match_info":{"location":{"x":"-8","y":"40","z":"-55"}}},"feature":"location"}
[2022-04-02 10:08:55.258 AM] {"info":{"match_info":{"location":{"x":"-8","y":"40","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:55.809 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:08:56.264 AM] {"info":{"match_info":{"location":{"x":"-8","y":"40","z":"-55"}}},"feature":"location"}
[2022-04-02 10:08:56.761 AM] {"info":{"match_info":{"location":{"x":"-7","y":"40","z":"-55"}}},"feature":"location"}
[2022-04-02 10:08:57.258 AM] {"info":{"match_info":{"location":{"x":"-7","y":"40","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:57.762 AM] {"info":{"match_info":{"location":{"x":"-6","y":"41","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:59.264 AM] {"info":{"match_info":{"location":{"x":"-6","y":"42","z":"-56"}}},"feature":"location"}
[2022-04-02 10:08:59.759 AM] {"info":{"match_info":{"location":{"x":"-6","y":"41","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:00.264 AM] {"info":{"match_info":{"location":{"x":"-6","y":"42","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:01.263 AM] {"info":{"match_info":{"location":{"x":"-6","y":"43","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:01.763 AM] {"info":{"match_info":{"location":{"x":"-7","y":"43","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:02.261 AM] {"info":{"match_info":{"location":{"x":"-8","y":"44","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:02.527 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:09:03.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] turtle","victimName":"[FSFP] MasterChiefSelf","weaponName":"spitfire","action":"kill"}}
[2022-04-02 10:09:03.267 AM] {"info":{"match_info":{"location":{"x":"-7","y":"43","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:03.311 AM] {"name":"death","data":null}
[2022-04-02 10:09:03.316 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"death"}}},"feature":"team"}
[2022-04-02 10:09:03.321 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:09:16.343 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:09:16.349 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:09:17.211 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"death"}}},"feature":"team"}
[2022-04-02 10:09:17.216 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:09:17.314 AM] {"name":"respawn","data":null}
[2022-04-02 10:09:17.321 AM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2022-04-02 10:09:17.325 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:09:17.328 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:09:17.331 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:09:17.335 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2022-04-02 10:09:17.339 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2022-04-02 10:09:17.344 AM] {"info":{"match_info":{"location":{"x":"6","y":"66","z":"-53"}}},"feature":"location"}
[2022-04-02 10:09:17.436 AM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:09:17.441 AM] {"info":{"me":{"inventory_0":{"name":"unknown_164","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:09:17.446 AM] {"info":{"me":{"inventory_1":{"name":"unknown_165","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:09:17.450 AM] {"info":{"me":{"inventory_2":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:09:17.771 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:09:18.233 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"75"}}},"feature":"me"}
[2022-04-02 10:09:18.321 AM] {"info":{"match_info":{"location":{"x":"6","y":"65","z":"-53"}}},"feature":"location"}
[2022-04-02 10:09:18.342 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:09:18.821 AM] {"info":{"match_info":{"location":{"x":"6","y":"63","z":"-53"}}},"feature":"location"}
[2022-04-02 10:09:19.319 AM] {"info":{"match_info":{"location":{"x":"6","y":"62","z":"-53"}}},"feature":"location"}
[2022-04-02 10:09:19.824 AM] {"info":{"match_info":{"location":{"x":"6","y":"60","z":"-54"}}},"feature":"location"}
[2022-04-02 10:09:20.320 AM] {"info":{"match_info":{"location":{"x":"5","y":"58","z":"-55"}}},"feature":"location"}
[2022-04-02 10:09:20.824 AM] {"info":{"match_info":{"location":{"x":"5","y":"56","z":"-55"}}},"feature":"location"}
[2022-04-02 10:09:21.324 AM] {"info":{"match_info":{"location":{"x":"4","y":"54","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:21.763 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" DomFoundDead","victimName":"[2077] H3llsGat313","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:09:21.820 AM] {"info":{"match_info":{"location":{"x":"3","y":"52","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:22.318 AM] {"info":{"match_info":{"location":{"x":"3","y":"51","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:22.825 AM] {"info":{"match_info":{"location":{"x":"2","y":"50","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:23.324 AM] {"info":{"match_info":{"location":{"x":"1","y":"49","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:23.765 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:09:23.820 AM] {"info":{"match_info":{"location":{"x":"0","y":"48","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:24.323 AM] {"info":{"match_info":{"location":{"x":"-1","y":"47","z":"-55"}}},"feature":"location"}
[2022-04-02 10:09:24.819 AM] {"info":{"match_info":{"location":{"x":"-3","y":"46","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:25.319 AM] {"info":{"match_info":{"location":{"x":"-4","y":"46","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:25.338 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2022-04-02 10:09:25.819 AM] {"info":{"match_info":{"location":{"x":"-5","y":"45","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:26.323 AM] {"info":{"match_info":{"location":{"x":"-4","y":"45","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:26.773 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:26.777 AM] {"info":{"me":{"totalDamageDealt":"1076"}},"feature":"damage"}
[2022-04-02 10:09:26.830 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:26.835 AM] {"info":{"me":{"totalDamageDealt":"1089"}},"feature":"damage"}
[2022-04-02 10:09:27.123 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"17.000000","armor":true,"headshot":true}}
[2022-04-02 10:09:27.128 AM] {"info":{"me":{"totalDamageDealt":"1106"}},"feature":"damage"}
[2022-04-02 10:09:27.525 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:27.530 AM] {"info":{"me":{"totalDamageDealt":"1119"}},"feature":"damage"}
[2022-04-02 10:09:27.725 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:27.729 AM] {"info":{"me":{"totalDamageDealt":"1132"}},"feature":"damage"}
[2022-04-02 10:09:27.972 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"4.000000","armor":true,"headshot":true}}
[2022-04-02 10:09:27.976 AM] {"info":{"me":{"totalDamageDealt":"1136"}},"feature":"damage"}
[2022-04-02 10:09:27.980 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"13.000000","armor":false,"headshot":true}}
[2022-04-02 10:09:27.983 AM] {"info":{"me":{"totalDamageDealt":"1149"}},"feature":"damage"}
[2022-04-02 10:09:28.025 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"17.000000","armor":false,"headshot":true}}
[2022-04-02 10:09:28.029 AM] {"info":{"me":{"totalDamageDealt":"1166"}},"feature":"damage"}
[2022-04-02 10:09:28.318 AM] {"info":{"match_info":{"location":{"x":"-4","y":"44","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:28.412 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:09:28.821 AM] {"info":{"match_info":{"location":{"x":"-4","y":"43","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:29.629 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"9.000000","armor":false,"headshot":false}}
[2022-04-02 10:09:29.634 AM] {"info":{"me":{"totalDamageDealt":"1175"}},"feature":"damage"}
[2022-04-02 10:09:29.639 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"10.000000","armor":false,"headshot":true}}
[2022-04-02 10:09:29.642 AM] {"info":{"me":{"totalDamageDealt":"1185"}},"feature":"damage"}
[2022-04-02 10:09:29.645 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"10.000000","armor":false,"headshot":true}}
[2022-04-02 10:09:29.649 AM] {"info":{"me":{"totalDamageDealt":"1195"}},"feature":"damage"}
[2022-04-02 10:09:29.653 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"9.000000","armor":false,"headshot":false}}
[2022-04-02 10:09:29.657 AM] {"info":{"me":{"totalDamageDealt":"1204"}},"feature":"damage"}
[2022-04-02 10:09:29.821 AM] {"info":{"match_info":{"location":{"x":"-4","y":"44","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:30.319 AM] {"info":{"match_info":{"location":{"x":"-4","y":"43","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:30.762 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] turtle","victimName":"[FSFP] MasterChiefSelf","weaponName":"spitfire","action":"kill"}}
[2022-04-02 10:09:30.822 AM] {"info":{"match_info":{"location":{"x":"-3","y":"44","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:31.323 AM] {"info":{"match_info":{"location":{"x":"-1","y":"43","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:31.818 AM] {"info":{"match_info":{"location":{"x":"0","y":"42","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:32.821 AM] {"info":{"match_info":{"location":{"x":"1","y":"41","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:33.078 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"9.000000","armor":false,"headshot":false}}
[2022-04-02 10:09:33.084 AM] {"info":{"me":{"totalDamageDealt":"1213"}},"feature":"damage"}
[2022-04-02 10:09:33.088 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"9.000000","armor":false,"headshot":false}}
[2022-04-02 10:09:33.092 AM] {"info":{"me":{"totalDamageDealt":"1222"}},"feature":"damage"}
[2022-04-02 10:09:33.095 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"9.000000","armor":false,"headshot":false}}
[2022-04-02 10:09:33.099 AM] {"info":{"me":{"totalDamageDealt":"1231"}},"feature":"damage"}
[2022-04-02 10:09:33.102 AM] {"name":"damage","data":{"targetName":"DomFoundDead","damageAmount":"9.000000","armor":false,"headshot":false}}
[2022-04-02 10:09:33.108 AM] {"info":{"me":{"totalDamageDealt":"1240"}},"feature":"damage"}
[2022-04-02 10:09:33.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":" DomFoundDead","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:09:33.322 AM] {"info":{"match_info":{"location":{"x":"1","y":"40","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:33.823 AM] {"info":{"match_info":{"location":{"x":"1","y":"39","z":"-57"}}},"feature":"location"}
[2022-04-02 10:09:34.321 AM] {"info":{"match_info":{"location":{"x":"0","y":"39","z":"-57"}}},"feature":"location"}
[2022-04-02 10:09:34.394 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:09:35.321 AM] {"info":{"match_info":{"location":{"x":"-1","y":"38","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:35.818 AM] {"info":{"match_info":{"location":{"x":"-3","y":"38","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:36.321 AM] {"info":{"match_info":{"location":{"x":"-4","y":"37","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:36.725 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:09:36.821 AM] {"info":{"match_info":{"location":{"x":"-5","y":"37","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:37.318 AM] {"info":{"match_info":{"location":{"x":"-6","y":"36","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:37.818 AM] {"info":{"match_info":{"location":{"x":"-7","y":"36","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:38.322 AM] {"info":{"match_info":{"location":{"x":"-7","y":"35","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:39.323 AM] {"info":{"match_info":{"location":{"x":"-8","y":"35","z":"-57"}}},"feature":"location"}
[2022-04-02 10:09:39.716 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:09:39.819 AM] {"info":{"match_info":{"location":{"x":"-8","y":"34","z":"-57"}}},"feature":"location"}
[2022-04-02 10:09:40.259 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] Per Aspera Ad Astra","victimName":" Pekoh246","weaponName":"r301","action":"kill"}}
[2022-04-02 10:09:40.818 AM] {"info":{"match_info":{"location":{"x":"-7","y":"33","z":"-57"}}},"feature":"location"}
[2022-04-02 10:09:41.302 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:09:41.309 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:09:41.314 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:09:41.318 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:09:41.324 AM] {"info":{"match_info":{"location":{"x":"-7","y":"33","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:42.321 AM] {"info":{"match_info":{"location":{"x":"-7","y":"32","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:42.823 AM] {"info":{"match_info":{"location":{"x":"-7","y":"29","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:43.323 AM] {"info":{"match_info":{"location":{"x":"-8","y":"26","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:43.818 AM] {"info":{"match_info":{"location":{"x":"-8","y":"21","z":"-55"}}},"feature":"location"}
[2022-04-02 10:09:44.319 AM] {"info":{"match_info":{"location":{"x":"-12","y":"14","z":"-56"}}},"feature":"location"}
[2022-04-02 10:09:44.819 AM] {"info":{"match_info":{"location":{"x":"-17","y":"5","z":"-58"}}},"feature":"location"}
[2022-04-02 10:09:45.323 AM] {"info":{"match_info":{"location":{"x":"-21","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:09:45.819 AM] {"info":{"match_info":{"location":{"x":"-20","y":"-3","z":"-59"}}},"feature":"location"}
[2022-04-02 10:09:46.319 AM] {"info":{"match_info":{"location":{"x":"-19","y":"-3","z":"-59"}}},"feature":"location"}
[2022-04-02 10:09:46.822 AM] {"info":{"match_info":{"location":{"x":"-19","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:47.320 AM] {"info":{"match_info":{"location":{"x":"-20","y":"-3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:47.821 AM] {"info":{"match_info":{"location":{"x":"-21","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:47.937 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:09:48.321 AM] {"info":{"match_info":{"location":{"x":"-23","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:09:48.538 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:09:48.822 AM] {"info":{"match_info":{"location":{"x":"-25","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:49.322 AM] {"info":{"match_info":{"location":{"x":"-26","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:49.821 AM] {"info":{"match_info":{"location":{"x":"-27","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:50.091 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:09:50.318 AM] {"info":{"match_info":{"location":{"x":"-28","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:50.818 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:51.126 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:51.132 AM] {"info":{"me":{"totalDamageDealt":"1251"}},"feature":"damage"}
[2022-04-02 10:09:51.373 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:51.378 AM] {"info":{"me":{"totalDamageDealt":"1262"}},"feature":"damage"}
[2022-04-02 10:09:51.422 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:51.427 AM] {"info":{"me":{"totalDamageDealt":"1273"}},"feature":"damage"}
[2022-04-02 10:09:51.477 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:51.482 AM] {"info":{"me":{"totalDamageDealt":"1284"}},"feature":"damage"}
[2022-04-02 10:09:51.675 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"14.000000","armor":true,"headshot":true}}
[2022-04-02 10:09:51.680 AM] {"info":{"me":{"totalDamageDealt":"1298"}},"feature":"damage"}
[2022-04-02 10:09:51.821 AM] {"info":{"match_info":{"location":{"x":"-31","y":"-3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:52.128 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:52.134 AM] {"info":{"me":{"totalDamageDealt":"1309"}},"feature":"damage"}
[2022-04-02 10:09:52.276 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"6.000000","armor":true,"headshot":false}}
[2022-04-02 10:09:52.282 AM] {"info":{"me":{"totalDamageDealt":"1315"}},"feature":"damage"}
[2022-04-02 10:09:52.288 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"5.000000","armor":false,"headshot":false}}
[2022-04-02 10:09:52.292 AM] {"info":{"me":{"totalDamageDealt":"1320"}},"feature":"damage"}
[2022-04-02 10:09:52.324 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":false,"headshot":false}}
[2022-04-02 10:09:52.328 AM] {"info":{"me":{"totalDamageDealt":"1331"}},"feature":"damage"}
[2022-04-02 10:09:52.473 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":false,"headshot":false}}
[2022-04-02 10:09:52.478 AM] {"info":{"me":{"totalDamageDealt":"1342"}},"feature":"damage"}
[2022-04-02 10:09:52.822 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:53.820 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:54.320 AM] {"info":{"match_info":{"location":{"x":"-28","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:55.321 AM] {"info":{"match_info":{"location":{"x":"-28","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:09:55.819 AM] {"info":{"match_info":{"location":{"x":"-28","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:09:56.758 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" SOP GOD","victimName":"[STB] Per Aspera Ad Astra","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:09:56.820 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-5","z":"-59"}}},"feature":"location"}
[2022-04-02 10:09:57.818 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-5","z":"-58"}}},"feature":"location"}
[2022-04-02 10:09:58.324 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-5","z":"-57"}}},"feature":"location"}
[2022-04-02 10:09:58.821 AM] {"info":{"match_info":{"location":{"x":"-31","y":"-5","z":"-57"}}},"feature":"location"}
[2022-04-02 10:09:59.319 AM] {"info":{"match_info":{"location":{"x":"-32","y":"-4","z":"-57"}}},"feature":"location"}
[2022-04-02 10:09:59.457 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:09:59.822 AM] {"info":{"match_info":{"location":{"x":"-34","y":"-4","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:00.302 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:10:00.308 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:10:00.324 AM] {"info":{"match_info":{"location":{"x":"-35","y":"-3","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:00.758 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PN15] Diisrupt","victimName":"[HPE] ImYourFavy","weaponName":"r301","action":"kill"}}
[2022-04-02 10:10:00.820 AM] {"info":{"match_info":{"location":{"x":"-37","y":"-3","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:01.320 AM] {"info":{"match_info":{"location":{"x":"-38","y":"-2","z":"-58"}}},"feature":"location"}
[2022-04-02 10:10:01.818 AM] {"info":{"match_info":{"location":{"x":"-39","y":"-2","z":"-58"}}},"feature":"location"}
[2022-04-02 10:10:02.322 AM] {"info":{"match_info":{"location":{"x":"-40","y":"-1","z":"-58"}}},"feature":"location"}
[2022-04-02 10:10:02.819 AM] {"info":{"match_info":{"location":{"x":"-42","y":"0","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:03.319 AM] {"info":{"match_info":{"location":{"x":"-44","y":"0","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:03.761 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Meow] Hugatreedamnit","victimName":"[sus] Blake Gottardy","weaponName":"bow","action":"kill"}}
[2022-04-02 10:10:03.820 AM] {"info":{"match_info":{"location":{"x":"-45","y":"1","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:04.319 AM] {"info":{"match_info":{"location":{"x":"-47","y":"1","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:04.819 AM] {"info":{"match_info":{"location":{"x":"-48","y":"2","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:05.261 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] turtle","victimName":" SOP GOD","weaponName":"spitfire","action":"kill"}}
[2022-04-02 10:10:05.320 AM] {"info":{"match_info":{"location":{"x":"-49","y":"2","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:05.824 AM] {"info":{"match_info":{"location":{"x":"-51","y":"3","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:06.258 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" DomFoundDead","victimName":"[STB] turtle","weaponName":"r301","action":"kill"}}
[2022-04-02 10:10:06.264 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Scott Santiago","victimName":"[PN15] Diisrupt","weaponName":"wingman","action":"headshot_kill"}}
[2022-04-02 10:10:06.320 AM] {"info":{"match_info":{"location":{"x":"-52","y":"3","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:06.821 AM] {"info":{"match_info":{"location":{"x":"-54","y":"3","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:07.319 AM] {"info":{"match_info":{"location":{"x":"-56","y":"3","z":"-58"}}},"feature":"location"}
[2022-04-02 10:10:07.818 AM] {"info":{"match_info":{"location":{"x":"-57","y":"2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:08.323 AM] {"info":{"match_info":{"location":{"x":"-59","y":"1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:08.552 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"death"}}},"feature":"team"}
[2022-04-02 10:10:08.558 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:10:08.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":" Scott Santiago","weaponName":"volt","action":"kill"}}
[2022-04-02 10:10:08.820 AM] {"info":{"match_info":{"location":{"x":"-59","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:08.887 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:10:09.319 AM] {"info":{"match_info":{"location":{"x":"-58","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:09.822 AM] {"info":{"match_info":{"location":{"x":"-57","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:10.060 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:10:10.320 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:10.819 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:10.850 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:10:11.319 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:11.678 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:10:11.821 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:12.317 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:12.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[dUhm] doridoridoridori","victimName":"[sus] Ace_Anomaly","weaponName":"peacekeeper","action":"headshot_kill"}}
[2022-04-02 10:10:12.820 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:13.322 AM] {"info":{"match_info":{"location":{"x":"-47","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:13.818 AM] {"info":{"match_info":{"location":{"x":"-46","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:13.958 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:10:14.276 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:10:14.281 AM] {"info":{"me":{"totalDamageDealt":"1353"}},"feature":"damage"}
[2022-04-02 10:10:14.319 AM] {"info":{"match_info":{"location":{"x":"-45","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:14.819 AM] {"info":{"match_info":{"location":{"x":"-44","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:14.826 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"14.000000","armor":true,"headshot":true}}
[2022-04-02 10:10:14.831 AM] {"info":{"me":{"totalDamageDealt":"1367"}},"feature":"damage"}
[2022-04-02 10:10:14.873 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"9.000000","armor":true,"headshot":false}}
[2022-04-02 10:10:14.878 AM] {"info":{"me":{"totalDamageDealt":"1376"}},"feature":"damage"}
[2022-04-02 10:10:15.627 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"9.000000","armor":true,"headshot":false}}
[2022-04-02 10:10:15.633 AM] {"info":{"me":{"totalDamageDealt":"1385"}},"feature":"damage"}
[2022-04-02 10:10:15.819 AM] {"info":{"match_info":{"location":{"x":"-44","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:16.322 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:17.306 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:10:17.314 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:10:17.322 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:17.819 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:18.319 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-4","z":"-59"}}},"feature":"location"}
[2022-04-02 10:10:18.819 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:19.818 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:20.283 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:10:20.820 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:21.321 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:21.328 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"8.000000","armor":true,"headshot":false}}
[2022-04-02 10:10:21.335 AM] {"info":{"me":{"totalDamageDealt":"1393"}},"feature":"damage"}
[2022-04-02 10:10:21.341 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"8.000000","armor":true,"headshot":false}}
[2022-04-02 10:10:21.346 AM] {"info":{"me":{"totalDamageDealt":"1401"}},"feature":"damage"}
[2022-04-02 10:10:21.351 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"6.000000","armor":true,"headshot":false}}
[2022-04-02 10:10:21.357 AM] {"info":{"me":{"totalDamageDealt":"1407"}},"feature":"damage"}
[2022-04-02 10:10:21.361 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"9.000000","armor":true,"headshot":true}}
[2022-04-02 10:10:21.366 AM] {"info":{"me":{"totalDamageDealt":"1416"}},"feature":"damage"}
[2022-04-02 10:10:21.369 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"9.000000","armor":true,"headshot":true}}
[2022-04-02 10:10:21.374 AM] {"info":{"me":{"totalDamageDealt":"1425"}},"feature":"damage"}
[2022-04-02 10:10:21.378 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"8.000000","armor":true,"headshot":false}}
[2022-04-02 10:10:21.383 AM] {"info":{"me":{"totalDamageDealt":"1433"}},"feature":"damage"}
[2022-04-02 10:10:21.388 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"8.000000","armor":true,"headshot":false}}
[2022-04-02 10:10:21.392 AM] {"info":{"me":{"totalDamageDealt":"1441"}},"feature":"damage"}
[2022-04-02 10:10:21.397 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"5.000000","armor":true,"headshot":false}}
[2022-04-02 10:10:21.402 AM] {"info":{"me":{"totalDamageDealt":"1446"}},"feature":"damage"}
[2022-04-02 10:10:21.409 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"3.000000","armor":false,"headshot":false}}
[2022-04-02 10:10:21.413 AM] {"info":{"me":{"totalDamageDealt":"1449"}},"feature":"damage"}
[2022-04-02 10:10:21.820 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:22.319 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:22.703 AM] {"name":"death","data":null}
[2022-04-02 10:10:22.711 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"death"}}},"feature":"team"}
[2022-04-02 10:10:22.718 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:10:29.310 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:10:29.317 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:10:41.317 AM] {"name":"respawn","data":null}
[2022-04-02 10:10:41.328 AM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2022-04-02 10:10:41.333 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:10:41.339 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:10:41.344 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:10:41.349 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2022-04-02 10:10:41.355 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2022-04-02 10:10:41.361 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2022-04-02 10:10:41.367 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-02 10:10:41.375 AM] {"info":{"match_info":{"location":{"x":"29","y":"21","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:41.440 AM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:10:41.448 AM] {"info":{"me":{"inventory_0":{"name":"unknown_164","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:10:41.455 AM] {"info":{"me":{"inventory_1":{"name":"unknown_165","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:10:41.460 AM] {"info":{"me":{"inventory_2":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:10:41.797 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:10:42.185 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:10:42.321 AM] {"info":{"match_info":{"location":{"x":"28","y":"21","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:42.820 AM] {"info":{"match_info":{"location":{"x":"27","y":"21","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:43.317 AM] {"info":{"match_info":{"location":{"x":"26","y":"22","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:43.819 AM] {"info":{"match_info":{"location":{"x":"24","y":"23","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:44.319 AM] {"info":{"match_info":{"location":{"x":"23","y":"23","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:44.823 AM] {"info":{"match_info":{"location":{"x":"21","y":"23","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:45.319 AM] {"info":{"match_info":{"location":{"x":"19","y":"23","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:45.818 AM] {"info":{"match_info":{"location":{"x":"18","y":"23","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:46.318 AM] {"info":{"match_info":{"location":{"x":"16","y":"23","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:46.819 AM] {"info":{"match_info":{"location":{"x":"15","y":"23","z":"-50"}}},"feature":"location"}
[2022-04-02 10:10:47.320 AM] {"info":{"match_info":{"location":{"x":"13","y":"23","z":"-51"}}},"feature":"location"}
[2022-04-02 10:10:47.821 AM] {"info":{"match_info":{"location":{"x":"11","y":"22","z":"-52"}}},"feature":"location"}
[2022-04-02 10:10:48.322 AM] {"info":{"match_info":{"location":{"x":"8","y":"23","z":"-53"}}},"feature":"location"}
[2022-04-02 10:10:48.821 AM] {"info":{"match_info":{"location":{"x":"6","y":"22","z":"-53"}}},"feature":"location"}
[2022-04-02 10:10:49.321 AM] {"info":{"match_info":{"location":{"x":"4","y":"22","z":"-53"}}},"feature":"location"}
[2022-04-02 10:10:49.819 AM] {"info":{"match_info":{"location":{"x":"2","y":"21","z":"-53"}}},"feature":"location"}
[2022-04-02 10:10:50.318 AM] {"info":{"match_info":{"location":{"x":"1","y":"20","z":"-53"}}},"feature":"location"}
[2022-04-02 10:10:50.820 AM] {"info":{"match_info":{"location":{"x":"0","y":"19","z":"-53"}}},"feature":"location"}
[2022-04-02 10:10:50.839 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"30"}}},"feature":"me"}
[2022-04-02 10:10:51.258 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" SOP GOD","victimName":"[dUhm] doridoridoridori","weaponName":"car","action":"kill"}}
[2022-04-02 10:10:51.319 AM] {"info":{"match_info":{"location":{"x":"0","y":"18","z":"-53"}}},"feature":"location"}
[2022-04-02 10:10:51.819 AM] {"info":{"match_info":{"location":{"x":"-1","y":"16","z":"-54"}}},"feature":"location"}
[2022-04-02 10:10:52.322 AM] {"info":{"match_info":{"location":{"x":"-2","y":"15","z":"-54"}}},"feature":"location"}
[2022-04-02 10:10:52.818 AM] {"info":{"match_info":{"location":{"x":"-3","y":"14","z":"-55"}}},"feature":"location"}
[2022-04-02 10:10:53.320 AM] {"info":{"match_info":{"location":{"x":"-5","y":"12","z":"-56"}}},"feature":"location"}
[2022-04-02 10:10:53.820 AM] {"info":{"match_info":{"location":{"x":"-6","y":"11","z":"-57"}}},"feature":"location"}
[2022-04-02 10:10:54.322 AM] {"info":{"match_info":{"location":{"x":"-8","y":"10","z":"-58"}}},"feature":"location"}
[2022-04-02 10:10:54.761 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] Per Aspera Ad Astra","victimName":" EGOCELL","weaponName":"energy_ar","action":"headshot_kill"}}
[2022-04-02 10:10:54.823 AM] {"info":{"match_info":{"location":{"x":"-10","y":"10","z":"-58"}}},"feature":"location"}
[2022-04-02 10:10:55.320 AM] {"info":{"match_info":{"location":{"x":"-12","y":"9","z":"-58"}}},"feature":"location"}
[2022-04-02 10:10:55.820 AM] {"info":{"match_info":{"location":{"x":"-13","y":"7","z":"-58"}}},"feature":"location"}
[2022-04-02 10:10:56.319 AM] {"info":{"match_info":{"location":{"x":"-14","y":"5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:56.819 AM] {"info":{"match_info":{"location":{"x":"-15","y":"4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:57.319 AM] {"info":{"match_info":{"location":{"x":"-16","y":"3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:57.820 AM] {"info":{"match_info":{"location":{"x":"-18","y":"3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:58.324 AM] {"info":{"match_info":{"location":{"x":"-18","y":"2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:58.819 AM] {"info":{"match_info":{"location":{"x":"-19","y":"1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:10:59.263 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] turtle","victimName":" Pekoh246","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:10:59.319 AM] {"info":{"match_info":{"location":{"x":"-21","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:10:59.765 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[FSFP] MasterChiefSelf","victimName":"[HPE] ImYourFavy","weaponName":"energy_ar","action":"headshot_kill"}}
[2022-04-02 10:10:59.775 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:10:59.782 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:10:59.823 AM] {"info":{"match_info":{"location":{"x":"-22","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:00.257 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[HPE] ImYourFavy","victimName":" DomFoundDead","weaponName":null,"action":"kill"}}
[2022-04-02 10:11:00.322 AM] {"info":{"match_info":{"location":{"x":"-23","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:00.820 AM] {"info":{"match_info":{"location":{"x":"-25","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:01.320 AM] {"info":{"match_info":{"location":{"x":"-26","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:01.821 AM] {"info":{"match_info":{"location":{"x":"-28","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:02.321 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:02.821 AM] {"info":{"match_info":{"location":{"x":"-31","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:03.319 AM] {"info":{"match_info":{"location":{"x":"-32","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:03.819 AM] {"info":{"match_info":{"location":{"x":"-33","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:04.258 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Meow] Hugatreedamnit","victimName":"[FSFP] MasterChiefSelf","weaponName":"prowler","action":"headshot_kill"}}
[2022-04-02 10:11:04.319 AM] {"info":{"match_info":{"location":{"x":"-34","y":"-6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:04.821 AM] {"info":{"match_info":{"location":{"x":"-36","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:05.317 AM] {"info":{"match_info":{"location":{"x":"-37","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:05.520 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:11:05.822 AM] {"info":{"match_info":{"location":{"x":"-39","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:06.322 AM] {"info":{"match_info":{"location":{"x":"-40","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:06.819 AM] {"info":{"match_info":{"location":{"x":"-41","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:07.073 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:11:07.319 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:07.818 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:07.939 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:11:08.320 AM] {"info":{"match_info":{"location":{"x":"-44","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:08.761 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] Per Aspera Ad Astra","victimName":"[PN15] Diisrupt","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:11:08.792 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:11:08.822 AM] {"info":{"match_info":{"location":{"x":"-45","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:09.318 AM] {"info":{"match_info":{"location":{"x":"-46","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:09.819 AM] {"info":{"match_info":{"location":{"x":"-47","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:09.991 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:11:10.321 AM] {"info":{"match_info":{"location":{"x":"-48","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:10.821 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:11.320 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:11.821 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:12.322 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:12.819 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-7","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:13.322 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:13.822 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:14.322 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-10","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:14.821 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-11","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:15.320 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-13","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:15.821 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-14","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:15.957 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:11:16.318 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-15","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:16.820 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-16","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:17.315 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:11:17.324 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:11:17.530 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:11:17.758 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":"[STB] Per Aspera Ad Astra","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:11:18.264 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Scott Santiago","victimName":" Frameworks","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:11:24.416 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:11:25.322 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-17","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:25.820 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-17","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:25.990 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"55"}}},"feature":"me"}
[2022-04-02 10:11:26.258 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Scott Santiago","victimName":"[sus] Blake Gottardy","weaponName":"r301","action":"kill"}}
[2022-04-02 10:11:26.320 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-18","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:27.321 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-19","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:27.661 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:11:27.820 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-20","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:28.230 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:11:28.321 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-22","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:28.821 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-23","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:29.323 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-25","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:29.430 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:11:29.437 AM] {"info":{"me":{"totalDamageDealt":"1459"}},"feature":"damage"}
[2022-04-02 10:11:29.526 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:11:29.532 AM] {"info":{"me":{"totalDamageDealt":"1469"}},"feature":"damage"}
[2022-04-02 10:11:29.578 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:11:29.586 AM] {"info":{"me":{"totalDamageDealt":"1479"}},"feature":"damage"}
[2022-04-02 10:11:29.822 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-26","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:30.027 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:11:30.035 AM] {"info":{"me":{"totalDamageDealt":"1489"}},"feature":"damage"}
[2022-04-02 10:11:30.323 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-27","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:30.331 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"10.000000","armor":false,"headshot":false}}
[2022-04-02 10:11:30.337 AM] {"info":{"me":{"totalDamageDealt":"1499"}},"feature":"damage"}
[2022-04-02 10:11:30.819 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-28","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:30.957 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:11:31.822 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-27","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:31.834 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"1.000000","armor":true,"headshot":false}}
[2022-04-02 10:11:31.843 AM] {"info":{"me":{"totalDamageDealt":"1500"}},"feature":"damage"}
[2022-04-02 10:11:31.849 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"8.000000","armor":false,"headshot":false}}
[2022-04-02 10:11:31.855 AM] {"info":{"me":{"totalDamageDealt":"1508"}},"feature":"damage"}
[2022-04-02 10:11:31.862 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"75"}}},"feature":"me"}
[2022-04-02 10:11:32.261 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":" SOP GOD","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:11:32.324 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-28","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:32.770 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:11:32.823 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-27","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:33.320 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-26","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:33.819 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-25","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:34.319 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:34.821 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-23","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:34.984 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:11:35.319 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-22","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:35.822 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-21","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:36.321 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-20","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:36.820 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-19","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:37.819 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-18","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:38.322 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-17","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:38.823 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-16","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:39.318 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-15","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:39.821 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-14","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:40.232 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:11:40.320 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-13","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:40.821 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-12","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:41.251 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:11:41.319 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:41.822 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-10","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:42.321 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-10","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:42.696 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:11:42.824 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:43.318 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:43.821 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:44.322 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:44.416 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:11:44.819 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:45.320 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:45.668 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:11:45.822 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-7","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:46.321 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:46.818 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:47.319 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:47.822 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:48.320 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:48.818 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:49.320 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:49.822 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:50.318 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-12","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:50.821 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-13","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:51.319 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-14","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:51.357 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:11:51.734 AM] {"info":{"me":{"weapons":{"weapon0":"R-301 Carbine","weapon1":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:11:51.931 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2022-04-02 10:11:52.823 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-15","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:53.320 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-17","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:53.818 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-18","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:54.320 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-20","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:54.820 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-21","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:55.319 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-22","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:55.820 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-23","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:56.321 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:56.722 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:11:56.821 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-25","z":"-60"}}},"feature":"location"}
[2022-04-02 10:11:57.319 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-26","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:57.821 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-27","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:58.321 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-28","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:58.614 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2022-04-02 10:11:58.819 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-30","z":"-62"}}},"feature":"location"}
[2022-04-02 10:11:59.318 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-30","z":"-61"}}},"feature":"location"}
[2022-04-02 10:11:59.820 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-29","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:00.229 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:12:00.238 AM] {"info":{"me":{"totalDamageDealt":"1522"}},"feature":"damage"}
[2022-04-02 10:12:00.318 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-30","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:01.478 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"20.000000","armor":true,"headshot":true}}
[2022-04-02 10:12:01.485 AM] {"info":{"me":{"totalDamageDealt":"1542"}},"feature":"damage"}
[2022-04-02 10:12:02.318 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-31","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:03.322 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-31","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:03.820 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-30","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:04.820 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-31","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:05.322 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-30","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:06.821 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-29","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:07.323 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-27","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:07.823 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-25","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:08.321 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-23","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:08.431 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:08.437 AM] {"info":{"me":{"totalDamageDealt":"1556"}},"feature":"damage"}
[2022-04-02 10:12:08.578 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:08.585 AM] {"info":{"me":{"totalDamageDealt":"1570"}},"feature":"damage"}
[2022-04-02 10:12:08.779 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:08.787 AM] {"info":{"me":{"totalDamageDealt":"1584"}},"feature":"damage"}
[2022-04-02 10:12:08.820 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-23","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:08.932 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:08.939 AM] {"info":{"me":{"totalDamageDealt":"1598"}},"feature":"damage"}
[2022-04-02 10:12:09.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] Per Aspera Ad Astra","victimName":" EGOCELL","weaponName":"r301","action":"kill"}}
[2022-04-02 10:12:10.320 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-23","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:10.819 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-23","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:10.887 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:12:11.318 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-23","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:11.819 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-22","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:11.936 AM] {"info":{"me":{"weapons":{"weapon0":"R-301 Carbine","weapon1":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:12:12.268 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:12:12.320 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-21","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:12.820 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-20","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:13.322 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-19","z":"-63"}}},"feature":"location"}
[2022-04-02 10:12:13.354 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:12:13.819 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-17","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:14.319 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-16","z":"-62"}}},"feature":"location"}
[2022-04-02 10:12:14.425 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:12:14.822 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-15","z":"-61"}}},"feature":"location"}
[2022-04-02 10:12:15.323 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-14","z":"-61"}}},"feature":"location"}
[2022-04-02 10:12:15.584 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2022-04-02 10:12:15.818 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-13","z":"-61"}}},"feature":"location"}
[2022-04-02 10:12:16.319 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-11","z":"-61"}}},"feature":"location"}
[2022-04-02 10:12:16.822 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-10","z":"-61"}}},"feature":"location"}
[2022-04-02 10:12:17.007 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:12:17.016 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:12:17.023 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:12:17.259 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[sus] Blake Gottardy","victimName":"[HPE] ImYourFavy","weaponName":"car","action":"kill"}}
[2022-04-02 10:12:17.321 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-8","z":"-61"}}},"feature":"location"}
[2022-04-02 10:12:17.819 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:18.320 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-5","z":"-61"}}},"feature":"location"}
[2022-04-02 10:12:18.821 AM] {"info":{"match_info":{"location":{"x":"-52","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:19.318 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:19.822 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:20.139 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:12:20.154 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"death"}}},"feature":"team"}
[2022-04-02 10:12:20.162 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:12:20.260 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PN15] Diisrupt","victimName":" Scott Santiago","weaponName":"car","action":"kill"}}
[2022-04-02 10:12:20.322 AM] {"info":{"match_info":{"location":{"x":"-55","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:20.821 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:21.147 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2022-04-02 10:12:21.321 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:21.762 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Meow] Hugatreedamnit","victimName":"[PN15] Diisrupt","weaponName":"prowler","action":"kill"}}
[2022-04-02 10:12:21.820 AM] {"info":{"match_info":{"location":{"x":"-59","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:23.319 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:24.323 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:24.819 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:25.261 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" DomFoundDead","victimName":"[dUhm] doridoridoridori","weaponName":"wingman","action":"headshot_kill"}}
[2022-04-02 10:12:26.322 AM] {"info":{"match_info":{"location":{"x":"-58","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:26.379 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:12:26.389 AM] {"info":{"me":{"totalDamageDealt":"1612"}},"feature":"damage"}
[2022-04-02 10:12:26.819 AM] {"info":{"match_info":{"location":{"x":"-58","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:27.029 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:12:27.037 AM] {"info":{"me":{"totalDamageDealt":"1626"}},"feature":"damage"}
[2022-04-02 10:12:27.130 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:12:27.138 AM] {"info":{"me":{"totalDamageDealt":"1640"}},"feature":"damage"}
[2022-04-02 10:12:27.329 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"11.000000","armor":true,"headshot":false}}
[2022-04-02 10:12:27.337 AM] {"info":{"me":{"totalDamageDealt":"1651"}},"feature":"damage"}
[2022-04-02 10:12:27.631 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"3.000000","armor":true,"headshot":false}}
[2022-04-02 10:12:27.640 AM] {"info":{"me":{"totalDamageDealt":"1654"}},"feature":"damage"}
[2022-04-02 10:12:27.647 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"8.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:27.653 AM] {"info":{"me":{"totalDamageDealt":"1662"}},"feature":"damage"}
[2022-04-02 10:12:27.731 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"11.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:27.739 AM] {"info":{"me":{"totalDamageDealt":"1673"}},"feature":"damage"}
[2022-04-02 10:12:27.775 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:27.784 AM] {"info":{"me":{"totalDamageDealt":"1687"}},"feature":"damage"}
[2022-04-02 10:12:27.821 AM] {"info":{"match_info":{"location":{"x":"-59","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:27.877 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"11.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:27.886 AM] {"info":{"me":{"totalDamageDealt":"1698"}},"feature":"damage"}
[2022-04-02 10:12:27.930 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"11.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:27.939 AM] {"info":{"me":{"totalDamageDealt":"1709"}},"feature":"damage"}
[2022-04-02 10:12:28.027 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:28.033 AM] {"info":{"me":{"totalDamageDealt":"1723"}},"feature":"damage"}
[2022-04-02 10:12:28.501 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:12:28.819 AM] {"info":{"match_info":{"location":{"x":"-59","y":"1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:29.318 AM] {"info":{"match_info":{"location":{"x":"-58","y":"1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:29.632 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"41.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:29.641 AM] {"info":{"me":{"totalDamageDealt":"1764"}},"feature":"damage"}
[2022-04-02 10:12:29.648 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"85"}}},"feature":"me"}
[2022-04-02 10:12:29.762 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":" SOP GOD","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:12:29.819 AM] {"info":{"match_info":{"location":{"x":"-58","y":"2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:12:30.321 AM] {"info":{"match_info":{"location":{"x":"-57","y":"2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:12:30.823 AM] {"info":{"match_info":{"location":{"x":"-58","y":"1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:31.822 AM] {"info":{"match_info":{"location":{"x":"-59","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:32.321 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:32.685 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2022-04-02 10:12:32.820 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:33.318 AM] {"info":{"match_info":{"location":{"x":"-59","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:33.817 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:34.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":"[STB] Per Aspera Ad Astra","weaponName":"flatline","action":"kill"}}
[2022-04-02 10:12:34.318 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:34.822 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:35.269 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:12:35.321 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:35.818 AM] {"info":{"match_info":{"location":{"x":"-60","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:36.320 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-11","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:36.821 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-13","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:37.319 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-14","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:37.817 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-16","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:38.321 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-17","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:38.821 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-18","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:38.905 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:12:39.322 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-19","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:40.323 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-20","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:40.820 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-19","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:41.315 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:12:41.325 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:12:43.133 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"16.000000","armor":true,"headshot":false}}
[2022-04-02 10:12:43.142 AM] {"info":{"me":{"totalDamageDealt":"1780"}},"feature":"damage"}
[2022-04-02 10:12:43.149 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"22.000000","armor":false,"headshot":false}}
[2022-04-02 10:12:43.156 AM] {"info":{"me":{"totalDamageDealt":"1802"}},"feature":"damage"}
[2022-04-02 10:12:43.758 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":"[STB] turtle","weaponName":"flatline","action":"kill"}}
[2022-04-02 10:12:43.820 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-20","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:44.322 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-21","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:44.818 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-22","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:45.318 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-23","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:45.820 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:46.318 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:46.822 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-23","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:47.318 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:47.818 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:48.821 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-23","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:49.318 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:50.080 AM] {"name":"damage","data":{"targetName":"Blake Gottardy","damageAmount":"45.000000","armor":true,"headshot":false}}
[2022-04-02 10:12:50.090 AM] {"info":{"me":{"totalDamageDealt":"1847"}},"feature":"damage"}
[2022-04-02 10:12:52.320 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-25","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:53.305 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:12:53.316 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:12:53.325 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:53.820 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:54.321 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:12:59.757 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":"[Meow] Hugatreedamnit","weaponName":"flatline","action":"kill"}}
[2022-04-02 10:13:03.758 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Pekoh246","victimName":"[dUhm] doridoridoridori","weaponName":"volt","action":"kill"}}
[2022-04-02 10:13:04.727 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"75.000000","armor":true,"headshot":true}}
[2022-04-02 10:13:04.736 AM] {"info":{"me":{"totalDamageDealt":"1922"}},"feature":"damage"}
[2022-04-02 10:13:04.743 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"1.000000","armor":false,"headshot":true}}
[2022-04-02 10:13:04.751 AM] {"info":{"me":{"totalDamageDealt":"1923"}},"feature":"damage"}
[2022-04-02 10:13:05.641 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2022-04-02 10:13:06.319 AM] {"info":{"match_info":{"location":{"x":"-63","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:13:07.260 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Scott Santiago","victimName":" Pekoh246","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:13:07.319 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:13:09.086 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:13:09.459 AM] {"info":{"me":{"inUse":{"inUse":"Arc Star"}}},"feature":"inventory"}
[2022-04-02 10:13:10.842 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2022-04-02 10:13:11.258 AM] {"info":{"me":{"inUse":{"inUse":"Wingman"}}},"feature":"inventory"}
[2022-04-02 10:13:11.320 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-24","z":"-60"}}},"feature":"location"}
[2022-04-02 10:13:11.818 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-23","z":"-60"}}},"feature":"location"}
[2022-04-02 10:13:12.123 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:13:12.317 AM] {"info":{"match_info":{"location":{"x":"-61","y":"-22","z":"-60"}}},"feature":"location"}
[2022-04-02 10:13:12.818 AM] {"info":{"match_info":{"location":{"x":"-62","y":"-21","z":"-60"}}},"feature":"location"}
[2022-04-02 10:13:13.206 AM] {"name":"death","data":null}
[2022-04-02 10:13:13.217 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"death"}}},"feature":"team"}
[2022-04-02 10:13:13.225 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:13:29.314 AM] {"name":"respawn","data":null}
[2022-04-02 10:13:29.325 AM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2022-04-02 10:13:29.334 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:13:29.341 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:13:29.348 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2022-04-02 10:13:29.353 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2022-04-02 10:13:29.360 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-02 10:13:29.366 AM] {"info":{"match_info":{"location":{"x":"8","y":"90","z":"-50"}}},"feature":"location"}
[2022-04-02 10:13:29.442 AM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:13:29.452 AM] {"info":{"me":{"inventory_0":{"name":"unknown_164","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:13:29.458 AM] {"info":{"me":{"inventory_1":{"name":"unknown_165","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:13:29.466 AM] {"info":{"me":{"inventory_2":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:13:29.790 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:13:29.819 AM] {"info":{"match_info":{"location":{"x":"8","y":"89","z":"-49"}}},"feature":"location"}
[2022-04-02 10:13:30.232 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:13:30.243 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"85"}}},"feature":"me"}
[2022-04-02 10:13:30.318 AM] {"info":{"match_info":{"location":{"x":"9","y":"88","z":"-49"}}},"feature":"location"}
[2022-04-02 10:13:30.821 AM] {"info":{"match_info":{"location":{"x":"9","y":"87","z":"-49"}}},"feature":"location"}
[2022-04-02 10:13:31.319 AM] {"info":{"match_info":{"location":{"x":"9","y":"86","z":"-49"}}},"feature":"location"}
[2022-04-02 10:13:31.823 AM] {"info":{"match_info":{"location":{"x":"10","y":"85","z":"-49"}}},"feature":"location"}
[2022-04-02 10:13:32.323 AM] {"info":{"match_info":{"location":{"x":"11","y":"83","z":"-50"}}},"feature":"location"}
[2022-04-02 10:13:32.820 AM] {"info":{"match_info":{"location":{"x":"12","y":"81","z":"-50"}}},"feature":"location"}
[2022-04-02 10:13:33.320 AM] {"info":{"match_info":{"location":{"x":"11","y":"79","z":"-51"}}},"feature":"location"}
[2022-04-02 10:13:33.822 AM] {"info":{"match_info":{"location":{"x":"11","y":"78","z":"-51"}}},"feature":"location"}
[2022-04-02 10:13:34.321 AM] {"info":{"match_info":{"location":{"x":"11","y":"76","z":"-51"}}},"feature":"location"}
[2022-04-02 10:13:34.823 AM] {"info":{"match_info":{"location":{"x":"11","y":"75","z":"-51"}}},"feature":"location"}
[2022-04-02 10:13:35.321 AM] {"info":{"match_info":{"location":{"x":"11","y":"73","z":"-51"}}},"feature":"location"}
[2022-04-02 10:13:35.821 AM] {"info":{"match_info":{"location":{"x":"10","y":"72","z":"-50"}}},"feature":"location"}
[2022-04-02 10:13:36.318 AM] {"info":{"match_info":{"location":{"x":"10","y":"70","z":"-51"}}},"feature":"location"}
[2022-04-02 10:13:36.821 AM] {"info":{"match_info":{"location":{"x":"10","y":"69","z":"-52"}}},"feature":"location"}
[2022-04-02 10:13:37.322 AM] {"info":{"match_info":{"location":{"x":"9","y":"67","z":"-52"}}},"feature":"location"}
[2022-04-02 10:13:37.819 AM] {"info":{"match_info":{"location":{"x":"10","y":"65","z":"-53"}}},"feature":"location"}
[2022-04-02 10:13:38.320 AM] {"info":{"match_info":{"location":{"x":"10","y":"63","z":"-53"}}},"feature":"location"}
[2022-04-02 10:13:38.822 AM] {"info":{"match_info":{"location":{"x":"9","y":"62","z":"-53"}}},"feature":"location"}
[2022-04-02 10:13:39.318 AM] {"info":{"match_info":{"location":{"x":"9","y":"61","z":"-53"}}},"feature":"location"}
[2022-04-02 10:13:39.822 AM] {"info":{"match_info":{"location":{"x":"8","y":"60","z":"-54"}}},"feature":"location"}
[2022-04-02 10:13:40.322 AM] {"info":{"match_info":{"location":{"x":"8","y":"58","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:40.820 AM] {"info":{"match_info":{"location":{"x":"7","y":"56","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:41.320 AM] {"info":{"match_info":{"location":{"x":"6","y":"54","z":"-56"}}},"feature":"location"}
[2022-04-02 10:13:41.820 AM] {"info":{"match_info":{"location":{"x":"5","y":"52","z":"-56"}}},"feature":"location"}
[2022-04-02 10:13:42.321 AM] {"info":{"match_info":{"location":{"x":"4","y":"51","z":"-56"}}},"feature":"location"}
[2022-04-02 10:13:42.824 AM] {"info":{"match_info":{"location":{"x":"3","y":"50","z":"-56"}}},"feature":"location"}
[2022-04-02 10:13:43.320 AM] {"info":{"match_info":{"location":{"x":"2","y":"49","z":"-56"}}},"feature":"location"}
[2022-04-02 10:13:43.821 AM] {"info":{"match_info":{"location":{"x":"2","y":"48","z":"-56"}}},"feature":"location"}
[2022-04-02 10:13:44.321 AM] {"info":{"match_info":{"location":{"x":"2","y":"46","z":"-56"}}},"feature":"location"}
[2022-04-02 10:13:44.820 AM] {"info":{"match_info":{"location":{"x":"2","y":"45","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:45.323 AM] {"info":{"match_info":{"location":{"x":"3","y":"45","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:46.319 AM] {"info":{"match_info":{"location":{"x":"3","y":"45","z":"-54"}}},"feature":"location"}
[2022-04-02 10:13:46.821 AM] {"info":{"match_info":{"location":{"x":"2","y":"45","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:47.323 AM] {"info":{"match_info":{"location":{"x":"0","y":"46","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:47.821 AM] {"info":{"match_info":{"location":{"x":"1","y":"48","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:48.322 AM] {"info":{"match_info":{"location":{"x":"3","y":"50","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:48.818 AM] {"info":{"match_info":{"location":{"x":"5","y":"55","z":"-54"}}},"feature":"location"}
[2022-04-02 10:13:49.321 AM] {"info":{"match_info":{"location":{"x":"7","y":"59","z":"-53"}}},"feature":"location"}
[2022-04-02 10:13:49.817 AM] {"info":{"match_info":{"location":{"x":"8","y":"62","z":"-52"}}},"feature":"location"}
[2022-04-02 10:13:50.321 AM] {"info":{"match_info":{"location":{"x":"10","y":"64","z":"-51"}}},"feature":"location"}
[2022-04-02 10:13:50.818 AM] {"info":{"match_info":{"location":{"x":"11","y":"65","z":"-52"}}},"feature":"location"}
[2022-04-02 10:13:51.322 AM] {"info":{"match_info":{"location":{"x":"11","y":"63","z":"-52"}}},"feature":"location"}
[2022-04-02 10:13:51.820 AM] {"info":{"match_info":{"location":{"x":"11","y":"62","z":"-52"}}},"feature":"location"}
[2022-04-02 10:13:53.321 AM] {"info":{"match_info":{"location":{"x":"9","y":"57","z":"-52"}}},"feature":"location"}
[2022-04-02 10:13:53.823 AM] {"info":{"match_info":{"location":{"x":"6","y":"52","z":"-54"}}},"feature":"location"}
[2022-04-02 10:13:54.323 AM] {"info":{"match_info":{"location":{"x":"4","y":"47","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:54.823 AM] {"info":{"match_info":{"location":{"x":"2","y":"43","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:55.321 AM] {"info":{"match_info":{"location":{"x":"0","y":"38","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:55.824 AM] {"info":{"match_info":{"location":{"x":"-1","y":"33","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:56.319 AM] {"info":{"match_info":{"location":{"x":"-3","y":"29","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:56.823 AM] {"info":{"match_info":{"location":{"x":"-6","y":"25","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:57.322 AM] {"info":{"match_info":{"location":{"x":"-9","y":"21","z":"-55"}}},"feature":"location"}
[2022-04-02 10:13:57.820 AM] {"info":{"match_info":{"location":{"x":"-11","y":"17","z":"-56"}}},"feature":"location"}
[2022-04-02 10:13:58.311 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"death"}}},"feature":"team"}
[2022-04-02 10:13:58.323 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:13:58.330 AM] {"info":{"match_info":{"location":{"x":"-14","y":"13","z":"-57"}}},"feature":"location"}
[2022-04-02 10:13:58.763 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":" Scott Santiago","weaponName":"flatline","action":"headshot_kill"}}
[2022-04-02 10:13:58.822 AM] {"info":{"match_info":{"location":{"x":"-18","y":"9","z":"-58"}}},"feature":"location"}
[2022-04-02 10:13:59.323 AM] {"info":{"match_info":{"location":{"x":"-21","y":"6","z":"-59"}}},"feature":"location"}
[2022-04-02 10:13:59.823 AM] {"info":{"match_info":{"location":{"x":"-25","y":"3","z":"-59"}}},"feature":"location"}
[2022-04-02 10:14:00.322 AM] {"info":{"match_info":{"location":{"x":"-29","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:14:00.823 AM] {"info":{"match_info":{"location":{"x":"-30","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:14:01.319 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:14:01.823 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:14:02.601 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:14:02.817 AM] {"info":{"match_info":{"location":{"x":"-28","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:14:03.323 AM] {"info":{"match_info":{"location":{"x":"-28","y":"-3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:14:03.335 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:14:03.343 AM] {"info":{"me":{"totalDamageDealt":"1936"}},"feature":"damage"}
[2022-04-02 10:14:03.484 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:14:03.493 AM] {"info":{"me":{"totalDamageDealt":"1949"}},"feature":"damage"}
[2022-04-02 10:14:03.533 AM] {"name":"damage","data":{"targetName":"SOP GOD","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-02 10:14:03.542 AM] {"info":{"me":{"totalDamageDealt":"1962"}},"feature":"damage"}
[2022-04-02 10:14:03.818 AM] {"info":{"match_info":{"location":{"x":"-28","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:14:03.960 AM] {"name":"death","data":null}
[2022-04-02 10:14:03.969 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"death"}}},"feature":"team"}
[2022-04-02 10:14:03.978 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:14:26.667 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:14:26.679 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:14:29.325 AM] {"name":"respawn","data":null}
[2022-04-02 10:14:29.337 AM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2022-04-02 10:14:29.347 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:14:29.354 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:14:29.362 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:14:29.371 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:14:29.381 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:14:29.391 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2022-04-02 10:14:29.401 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2022-04-02 10:14:29.409 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2022-04-02 10:14:29.418 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-02 10:14:29.426 AM] {"info":{"match_info":{"location":{"x":"31","y":"20","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:29.447 AM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:14:29.457 AM] {"info":{"me":{"inventory_0":{"name":"unknown_164","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:14:29.466 AM] {"info":{"me":{"inventory_1":{"name":"unknown_165","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:14:29.474 AM] {"info":{"me":{"inventory_2":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:14:29.772 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:14:30.319 AM] {"info":{"match_info":{"location":{"x":"30","y":"20","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:30.366 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:14:30.818 AM] {"info":{"match_info":{"location":{"x":"29","y":"19","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:31.324 AM] {"info":{"match_info":{"location":{"x":"27","y":"18","z":"-49"}}},"feature":"location"}
[2022-04-02 10:14:31.822 AM] {"info":{"match_info":{"location":{"x":"25","y":"18","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:32.321 AM] {"info":{"match_info":{"location":{"x":"24","y":"18","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:32.823 AM] {"info":{"match_info":{"location":{"x":"22","y":"18","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:33.322 AM] {"info":{"match_info":{"location":{"x":"21","y":"18","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:33.818 AM] {"info":{"match_info":{"location":{"x":"20","y":"18","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:34.321 AM] {"info":{"match_info":{"location":{"x":"18","y":"19","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:34.762 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" EGOCELL","victimName":"[dUhm] doridoridoridori","weaponName":"volt","action":"kill"}}
[2022-04-02 10:14:34.823 AM] {"info":{"match_info":{"location":{"x":"17","y":"20","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:35.321 AM] {"info":{"match_info":{"location":{"x":"16","y":"21","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:35.820 AM] {"info":{"match_info":{"location":{"x":"15","y":"23","z":"-49"}}},"feature":"location"}
[2022-04-02 10:14:36.321 AM] {"info":{"match_info":{"location":{"x":"14","y":"24","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:36.823 AM] {"info":{"match_info":{"location":{"x":"13","y":"26","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:37.321 AM] {"info":{"match_info":{"location":{"x":"12","y":"26","z":"-51"}}},"feature":"location"}
[2022-04-02 10:14:37.819 AM] {"info":{"match_info":{"location":{"x":"10","y":"27","z":"-52"}}},"feature":"location"}
[2022-04-02 10:14:38.323 AM] {"info":{"match_info":{"location":{"x":"9","y":"28","z":"-52"}}},"feature":"location"}
[2022-04-02 10:14:38.822 AM] {"info":{"match_info":{"location":{"x":"8","y":"29","z":"-52"}}},"feature":"location"}
[2022-04-02 10:14:39.321 AM] {"info":{"match_info":{"location":{"x":"7","y":"30","z":"-52"}}},"feature":"location"}
[2022-04-02 10:14:39.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PN15] Diisrupt","victimName":"[2077] H3llsGat313","weaponName":"sniper","action":"headshot_kill"}}
[2022-04-02 10:14:39.819 AM] {"info":{"match_info":{"location":{"x":"6","y":"32","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:40.321 AM] {"info":{"match_info":{"location":{"x":"5","y":"31","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:40.434 AM] {"info":{"me":{"inUse":{"inUse":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:14:40.821 AM] {"info":{"match_info":{"location":{"x":"6","y":"31","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:41.308 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:14:41.318 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:14:41.327 AM] {"info":{"match_info":{"location":{"x":"6","y":"32","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:42.319 AM] {"info":{"match_info":{"location":{"x":"5","y":"32","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:43.320 AM] {"info":{"match_info":{"location":{"x":"5","y":"33","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:43.341 AM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Volt SMG"}}},"feature":"inventory"}
[2022-04-02 10:14:43.706 AM] {"info":{"me":{"inUse":{"inUse":"Volt SMG"}}},"feature":"inventory"}
[2022-04-02 10:14:43.837 AM] {"info":{"me":{"inventory_3":{"name":"unknown_190","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:14:44.321 AM] {"info":{"match_info":{"location":{"x":"6","y":"33","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:44.823 AM] {"info":{"match_info":{"location":{"x":"6","y":"32","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:45.680 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:14:45.820 AM] {"info":{"match_info":{"location":{"x":"6","y":"31","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:46.320 AM] {"info":{"match_info":{"location":{"x":"6","y":"30","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:46.819 AM] {"info":{"match_info":{"location":{"x":"6","y":"28","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:47.322 AM] {"info":{"match_info":{"location":{"x":"5","y":"27","z":"-54"}}},"feature":"location"}
[2022-04-02 10:14:47.818 AM] {"info":{"match_info":{"location":{"x":"5","y":"26","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:48.321 AM] {"info":{"match_info":{"location":{"x":"4","y":"24","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:48.819 AM] {"info":{"match_info":{"location":{"x":"4","y":"23","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:49.322 AM] {"info":{"match_info":{"location":{"x":"4","y":"21","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:49.820 AM] {"info":{"match_info":{"location":{"x":"4","y":"20","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:50.318 AM] {"info":{"match_info":{"location":{"x":"5","y":"19","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:50.820 AM] {"info":{"match_info":{"location":{"x":"6","y":"18","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:51.319 AM] {"info":{"match_info":{"location":{"x":"7","y":"16","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:51.441 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"100"}}},"feature":"me"}
[2022-04-02 10:14:51.820 AM] {"info":{"match_info":{"location":{"x":"9","y":"15","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:52.318 AM] {"info":{"match_info":{"location":{"x":"9","y":"13","z":"-53"}}},"feature":"location"}
[2022-04-02 10:14:52.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PN15] Diisrupt","victimName":" mokumoku_kun","weaponName":"sniper","action":"kill"}}
[2022-04-02 10:14:52.819 AM] {"info":{"match_info":{"location":{"x":"10","y":"12","z":"-52"}}},"feature":"location"}
[2022-04-02 10:14:53.320 AM] {"info":{"match_info":{"location":{"x":"10","y":"11","z":"-52"}}},"feature":"location"}
[2022-04-02 10:14:53.819 AM] {"info":{"match_info":{"location":{"x":"11","y":"9","z":"-52"}}},"feature":"location"}
[2022-04-02 10:14:54.320 AM] {"info":{"match_info":{"location":{"x":"11","y":"8","z":"-51"}}},"feature":"location"}
[2022-04-02 10:14:54.821 AM] {"info":{"match_info":{"location":{"x":"12","y":"7","z":"-51"}}},"feature":"location"}
[2022-04-02 10:14:55.321 AM] {"info":{"match_info":{"location":{"x":"12","y":"6","z":"-51"}}},"feature":"location"}
[2022-04-02 10:14:55.822 AM] {"info":{"match_info":{"location":{"x":"12","y":"5","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:56.320 AM] {"info":{"match_info":{"location":{"x":"12","y":"3","z":"-50"}}},"feature":"location"}
[2022-04-02 10:14:56.822 AM] {"info":{"match_info":{"location":{"x":"12","y":"1","z":"-49"}}},"feature":"location"}
[2022-04-02 10:14:57.322 AM] {"info":{"match_info":{"location":{"x":"12","y":"0","z":"-49"}}},"feature":"location"}
[2022-04-02 10:14:57.819 AM] {"info":{"match_info":{"location":{"x":"13","y":"0","z":"-49"}}},"feature":"location"}
[2022-04-02 10:14:59.361 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:15:00.918 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:15:01.261 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Meow] Hugatreedamnit","victimName":"[PN15] Diisrupt","weaponName":"bow","action":"kill"}}
[2022-04-02 10:15:06.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[sus] Blake Gottardy","victimName":" Scott Santiago","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:15:06.273 AM] {"info":{"match_info":{"teammate_1":{"name":"Scott Santiago","state":"death"}}},"feature":"team"}
[2022-04-02 10:15:06.282 AM] {"info":{"match_info":{"roster_6":{"name":"Scott Santiago","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:15:09.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" DomFoundDead","victimName":"[STB] Per Aspera Ad Astra","weaponName":"wingman","action":"kill"}}
[2022-04-02 10:15:13.258 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[FSFP] MasterChiefSelf","victimName":"[STB] turtle","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:15:13.609 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:15:13.620 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:15:13.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Pekoh246","victimName":"[HPE] ImYourFavy","weaponName":"r301","action":"kill"}}
[2022-04-02 10:15:18.318 AM] {"info":{"match_info":{"location":{"x":"12","y":"1","z":"-49"}}},"feature":"location"}
[2022-04-02 10:15:18.820 AM] {"info":{"match_info":{"location":{"x":"11","y":"1","z":"-49"}}},"feature":"location"}
[2022-04-02 10:15:19.318 AM] {"info":{"match_info":{"location":{"x":"10","y":"0","z":"-49"}}},"feature":"location"}
[2022-04-02 10:15:19.823 AM] {"info":{"match_info":{"location":{"x":"8","y":"0","z":"-49"}}},"feature":"location"}
[2022-04-02 10:15:20.322 AM] {"info":{"match_info":{"location":{"x":"7","y":"-1","z":"-49"}}},"feature":"location"}
[2022-04-02 10:15:20.821 AM] {"info":{"match_info":{"location":{"x":"5","y":"-1","z":"-49"}}},"feature":"location"}
[2022-04-02 10:15:21.323 AM] {"info":{"match_info":{"location":{"x":"4","y":"-1","z":"-49"}}},"feature":"location"}
[2022-04-02 10:15:21.821 AM] {"info":{"match_info":{"location":{"x":"2","y":"-1","z":"-51"}}},"feature":"location"}
[2022-04-02 10:15:22.321 AM] {"info":{"match_info":{"location":{"x":"1","y":"-1","z":"-52"}}},"feature":"location"}
[2022-04-02 10:15:22.822 AM] {"info":{"match_info":{"location":{"x":"0","y":"-1","z":"-53"}}},"feature":"location"}
[2022-04-02 10:15:23.319 AM] {"info":{"match_info":{"location":{"x":"-1","y":"0","z":"-54"}}},"feature":"location"}
[2022-04-02 10:15:23.818 AM] {"info":{"match_info":{"location":{"x":"-3","y":"0","z":"-55"}}},"feature":"location"}
[2022-04-02 10:15:24.720 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:15:26.279 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:15:29.313 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:15:29.326 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:15:32.293 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-02 10:15:34.730 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"43.000000","armor":false,"headshot":false}}
[2022-04-02 10:15:34.742 AM] {"info":{"me":{"totalDamageDealt":"2005"}},"feature":"damage"}
[2022-04-02 10:15:34.752 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"50.000000","armor":false,"headshot":false}}
[2022-04-02 10:15:34.762 AM] {"info":{"me":{"totalDamageDealt":"2055"}},"feature":"damage"}
[2022-04-02 10:15:34.770 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"39.000000","armor":false,"headshot":false}}
[2022-04-02 10:15:34.781 AM] {"info":{"me":{"totalDamageDealt":"2094"}},"feature":"damage"}
[2022-04-02 10:15:37.318 AM] {"info":{"match_info":{"location":{"x":"-4","y":"0","z":"-55"}}},"feature":"location"}
[2022-04-02 10:15:37.822 AM] {"info":{"match_info":{"location":{"x":"-5","y":"0","z":"-55"}}},"feature":"location"}
[2022-04-02 10:15:38.227 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:15:38.321 AM] {"info":{"match_info":{"location":{"x":"-6","y":"0","z":"-55"}}},"feature":"location"}
[2022-04-02 10:15:38.822 AM] {"info":{"match_info":{"location":{"x":"-6","y":"-1","z":"-55"}}},"feature":"location"}
[2022-04-02 10:15:39.258 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[sus] Blake Gottardy","victimName":"[dUhm] doridoridoridori","weaponName":"car","action":"kill"}}
[2022-04-02 10:15:41.321 AM] {"info":{"match_info":{"location":{"x":"-7","y":"-2","z":"-55"}}},"feature":"location"}
[2022-04-02 10:15:41.824 AM] {"info":{"match_info":{"location":{"x":"-8","y":"-3","z":"-55"}}},"feature":"location"}
[2022-04-02 10:15:42.320 AM] {"info":{"match_info":{"location":{"x":"-9","y":"-4","z":"-56"}}},"feature":"location"}
[2022-04-02 10:15:42.822 AM] {"info":{"match_info":{"location":{"x":"-10","y":"-5","z":"-57"}}},"feature":"location"}
[2022-04-02 10:15:43.321 AM] {"info":{"match_info":{"location":{"x":"-12","y":"-5","z":"-58"}}},"feature":"location"}
[2022-04-02 10:15:43.823 AM] {"info":{"match_info":{"location":{"x":"-13","y":"-6","z":"-59"}}},"feature":"location"}
[2022-04-02 10:15:44.319 AM] {"info":{"match_info":{"location":{"x":"-14","y":"-6","z":"-59"}}},"feature":"location"}
[2022-04-02 10:15:44.825 AM] {"info":{"match_info":{"location":{"x":"-16","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:15:45.091 AM] {"info":{"me":{"inUse":{"inUse":"Volt SMG"}}},"feature":"inventory"}
[2022-04-02 10:15:45.321 AM] {"info":{"match_info":{"location":{"x":"-17","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:15:45.822 AM] {"info":{"match_info":{"location":{"x":"-18","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:15:46.259 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[FSFP] MasterChiefSelf","victimName":"[Meow] Hugatreedamnit","weaponName":"energy_ar","action":"kill"}}
[2022-04-02 10:15:47.322 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:15:47.820 AM] {"info":{"match_info":{"location":{"x":"-18","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:15:48.318 AM] {"info":{"match_info":{"location":{"x":"-19","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:15:48.818 AM] {"info":{"match_info":{"location":{"x":"-20","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:15:49.322 AM] {"info":{"match_info":{"location":{"x":"-21","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:49.818 AM] {"info":{"match_info":{"location":{"x":"-23","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:50.322 AM] {"info":{"match_info":{"location":{"x":"-24","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:50.820 AM] {"info":{"match_info":{"location":{"x":"-25","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:51.319 AM] {"info":{"match_info":{"location":{"x":"-27","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:51.819 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-4","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:52.221 AM] {"info":{"me":{"inUse":{"inUse":"mp_ability_crypto_drone"}}},"feature":"inventory"}
[2022-04-02 10:15:53.779 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:15:54.318 AM] {"info":{"me":{"inUse":{"inUse":"Volt SMG"}}},"feature":"inventory"}
[2022-04-02 10:15:55.321 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:55.731 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:15:55.742 AM] {"info":{"me":{"totalDamageDealt":"2108"}},"feature":"damage"}
[2022-04-02 10:15:56.135 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"12.000000","armor":true,"headshot":false}}
[2022-04-02 10:15:56.149 AM] {"info":{"me":{"totalDamageDealt":"2120"}},"feature":"damage"}
[2022-04-02 10:15:56.231 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:15:56.241 AM] {"info":{"me":{"totalDamageDealt":"2134"}},"feature":"damage"}
[2022-04-02 10:15:56.335 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:15:56.346 AM] {"info":{"me":{"totalDamageDealt":"2148"}},"feature":"damage"}
[2022-04-02 10:15:56.383 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:15:56.394 AM] {"info":{"me":{"totalDamageDealt":"2162"}},"feature":"damage"}
[2022-04-02 10:15:56.633 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"7.000000","armor":true,"headshot":false}}
[2022-04-02 10:15:56.647 AM] {"info":{"me":{"totalDamageDealt":"2169"}},"feature":"damage"}
[2022-04-02 10:15:56.656 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"5.000000","armor":false,"headshot":false}}
[2022-04-02 10:15:56.665 AM] {"info":{"me":{"totalDamageDealt":"2174"}},"feature":"damage"}
[2022-04-02 10:15:56.819 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:57.080 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"12.000000","armor":false,"headshot":false}}
[2022-04-02 10:15:57.090 AM] {"info":{"me":{"totalDamageDealt":"2186"}},"feature":"damage"}
[2022-04-02 10:15:57.228 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"12.000000","armor":false,"headshot":false}}
[2022-04-02 10:15:57.238 AM] {"info":{"me":{"totalDamageDealt":"2198"}},"feature":"damage"}
[2022-04-02 10:15:57.321 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:57.330 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-02 10:15:57.338 AM] {"info":{"me":{"totalDamageDealt":"2212"}},"feature":"damage"}
[2022-04-02 10:15:57.380 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-02 10:15:57.391 AM] {"info":{"me":{"totalDamageDealt":"2226"}},"feature":"damage"}
[2022-04-02 10:15:57.480 AM] {"name":"damage","data":{"targetName":"Pekoh246","damageAmount":"14.000000","armor":false,"headshot":false}}
[2022-04-02 10:15:57.490 AM] {"info":{"me":{"totalDamageDealt":"2240"}},"feature":"damage"}
[2022-04-02 10:15:58.261 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" SOP GOD","victimName":"[STB] turtle","weaponName":"car","action":"kill"}}
[2022-04-02 10:15:58.318 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:58.821 AM] {"info":{"match_info":{"location":{"x":"-31","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:15:59.322 AM] {"info":{"match_info":{"location":{"x":"-31","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:00.322 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:00.822 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:00.983 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:00.994 AM] {"info":{"me":{"totalDamageDealt":"2254"}},"feature":"damage"}
[2022-04-02 10:16:01.131 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:01.142 AM] {"info":{"me":{"totalDamageDealt":"2268"}},"feature":"damage"}
[2022-04-02 10:16:01.278 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:01.288 AM] {"info":{"me":{"totalDamageDealt":"2282"}},"feature":"damage"}
[2022-04-02 10:16:01.321 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:01.532 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"19.000000","armor":true,"headshot":true}}
[2022-04-02 10:16:01.542 AM] {"info":{"me":{"totalDamageDealt":"2301"}},"feature":"damage"}
[2022-04-02 10:16:01.682 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:01.696 AM] {"info":{"me":{"totalDamageDealt":"2315"}},"feature":"damage"}
[2022-04-02 10:16:01.785 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"19.000000","armor":true,"headshot":true}}
[2022-04-02 10:16:01.796 AM] {"info":{"me":{"totalDamageDealt":"2334"}},"feature":"damage"}
[2022-04-02 10:16:01.885 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"6.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:01.896 AM] {"info":{"me":{"totalDamageDealt":"2340"}},"feature":"damage"}
[2022-04-02 10:16:01.906 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"8.000000","armor":false,"headshot":false}}
[2022-04-02 10:16:01.916 AM] {"info":{"me":{"totalDamageDealt":"2348"}},"feature":"damage"}
[2022-04-02 10:16:02.029 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"19.000000","armor":false,"headshot":true}}
[2022-04-02 10:16:02.041 AM] {"info":{"me":{"totalDamageDealt":"2367"}},"feature":"damage"}
[2022-04-02 10:16:02.819 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:03.319 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:04.758 AM] {"info":{"me":{"inUse":{"inUse":"Arc Star"}}},"feature":"inventory"}
[2022-04-02 10:16:05.321 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:05.762 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" mokumoku_kun","victimName":" Pekoh246","weaponName":"peacekeeper","action":"kill"}}
[2022-04-02 10:16:06.320 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:06.943 AM] {"info":{"me":{"inventory_2":{"name":"unknown_190","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:16:06.956 AM] {"info":{"me":{"inventory_3":null}},"feature":"inventory"}
[2022-04-02 10:16:07.319 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:07.336 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:16:07.764 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[STB] Per Aspera Ad Astra","victimName":"[FSFP] MasterChiefSelf","weaponName":"car","action":"kill"}}
[2022-04-02 10:16:07.818 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:08.820 AM] {"info":{"match_info":{"location":{"x":"-31","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:09.320 AM] {"info":{"match_info":{"location":{"x":"-32","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:10.318 AM] {"info":{"match_info":{"location":{"x":"-34","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:10.333 AM] {"name":"damage","data":{"targetName":"Blake Gottardy","damageAmount":"75.000000","armor":false,"headshot":false}}
[2022-04-02 10:16:10.342 AM] {"info":{"me":{"totalDamageDealt":"2442"}},"feature":"damage"}
[2022-04-02 10:16:11.262 AM] {"info":{"me":{"inUse":{"inUse":"Health/Shield"}}},"feature":"inventory"}
[2022-04-02 10:16:14.511 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:16:14.520 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:16:14.760 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[PN15] Diisrupt","victimName":"[HPE] ImYourFavy","weaponName":"spitfire","action":"kill"}}
[2022-04-02 10:16:14.818 AM] {"info":{"match_info":{"location":{"x":"-33","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:15.261 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" SOP GOD","victimName":"[STB] Per Aspera Ad Astra","weaponName":"peacekeeper","action":"headshot_kill"}}
[2022-04-02 10:16:17.823 AM] {"info":{"match_info":{"location":{"x":"-32","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:19.322 AM] {"info":{"match_info":{"location":{"x":"-33","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:19.658 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:16:19.821 AM] {"info":{"match_info":{"location":{"x":"-34","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:20.321 AM] {"info":{"match_info":{"location":{"x":"-35","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:20.820 AM] {"info":{"match_info":{"location":{"x":"-36","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:21.323 AM] {"info":{"match_info":{"location":{"x":"-38","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:21.506 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:16:21.822 AM] {"info":{"match_info":{"location":{"x":"-39","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:22.321 AM] {"info":{"match_info":{"location":{"x":"-41","y":"1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:22.597 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:16:22.820 AM] {"info":{"match_info":{"location":{"x":"-43","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:23.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" EGOCELL","victimName":" mokumoku_kun","weaponName":"r301","action":"kill"}}
[2022-04-02 10:16:23.319 AM] {"info":{"match_info":{"location":{"x":"-44","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:23.823 AM] {"info":{"match_info":{"location":{"x":"-46","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:24.321 AM] {"info":{"match_info":{"location":{"x":"-47","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:24.821 AM] {"info":{"match_info":{"location":{"x":"-49","y":"2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:25.322 AM] {"info":{"match_info":{"location":{"x":"-51","y":"2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:25.821 AM] {"info":{"match_info":{"location":{"x":"-52","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:26.317 AM] {"info":{"match_info":{"location":{"x":"-54","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:26.819 AM] {"info":{"match_info":{"location":{"x":"-55","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:27.321 AM] {"info":{"match_info":{"location":{"x":"-57","y":"1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:16:27.819 AM] {"info":{"match_info":{"location":{"x":"-59","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:28.106 AM] {"info":{"me":{"inUse":{"inUse":"Volt SMG"}}},"feature":"inventory"}
[2022-04-02 10:16:28.823 AM] {"info":{"match_info":{"location":{"x":"-58","y":"0","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:29.115 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:16:29.313 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:16:29.324 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:16:29.332 AM] {"info":{"match_info":{"location":{"x":"-57","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:29.821 AM] {"info":{"match_info":{"location":{"x":"-56","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:30.319 AM] {"info":{"match_info":{"location":{"x":"-54","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:30.820 AM] {"info":{"match_info":{"location":{"x":"-53","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:31.323 AM] {"info":{"match_info":{"location":{"x":"-51","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:31.822 AM] {"info":{"match_info":{"location":{"x":"-50","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:32.322 AM] {"info":{"match_info":{"location":{"x":"-49","y":"-1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:32.820 AM] {"info":{"match_info":{"location":{"x":"-48","y":"-2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:33.258 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":"[2077] H3llsGat313","weaponName":"flatline","action":"kill"}}
[2022-04-02 10:16:33.319 AM] {"info":{"match_info":{"location":{"x":"-47","y":"-3","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:33.820 AM] {"info":{"match_info":{"location":{"x":"-45","y":"-4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:34.321 AM] {"info":{"match_info":{"location":{"x":"-44","y":"-5","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:34.819 AM] {"info":{"match_info":{"location":{"x":"-43","y":"-6","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:35.228 AM] {"info":{"me":{"inUse":{"inUse":"Volt SMG"}}},"feature":"inventory"}
[2022-04-02 10:16:35.319 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-7","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:35.819 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:36.679 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:36.690 AM] {"info":{"me":{"totalDamageDealt":"2456"}},"feature":"damage"}
[2022-04-02 10:16:37.262 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Meow] Hugatreedamnit","victimName":" Pekoh246","weaponName":"bow","action":"kill"}}
[2022-04-02 10:16:37.683 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"17.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:37.697 AM] {"info":{"me":{"totalDamageDealt":"2473"}},"feature":"damage"}
[2022-04-02 10:16:37.787 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"17.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:37.796 AM] {"info":{"me":{"totalDamageDealt":"2490"}},"feature":"damage"}
[2022-04-02 10:16:37.820 AM] {"info":{"match_info":{"location":{"x":"-41","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:37.884 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"17.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:37.893 AM] {"info":{"me":{"totalDamageDealt":"2507"}},"feature":"damage"}
[2022-04-02 10:16:38.283 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"10.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:38.296 AM] {"info":{"me":{"totalDamageDealt":"2517"}},"feature":"damage"}
[2022-04-02 10:16:38.305 AM] {"name":"damage","data":{"targetName":"EGOCELL","damageAmount":"7.000000","armor":false,"headshot":false}}
[2022-04-02 10:16:38.314 AM] {"info":{"me":{"totalDamageDealt":"2524"}},"feature":"damage"}
[2022-04-02 10:16:38.326 AM] {"info":{"match_info":{"location":{"x":"-42","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:39.322 AM] {"info":{"match_info":{"location":{"x":"-41","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:39.820 AM] {"info":{"match_info":{"location":{"x":"-40","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:40.319 AM] {"info":{"match_info":{"location":{"x":"-39","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:40.818 AM] {"info":{"match_info":{"location":{"x":"-39","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:41.318 AM] {"info":{"match_info":{"location":{"x":"-38","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:42.318 AM] {"info":{"match_info":{"location":{"x":"-37","y":"-8","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:42.533 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:42.543 AM] {"info":{"me":{"totalDamageDealt":"2538"}},"feature":"damage"}
[2022-04-02 10:16:42.761 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" EGOCELL","victimName":"[dUhm] doridoridoridori","weaponName":"volt","action":"headshot_kill"}}
[2022-04-02 10:16:42.821 AM] {"info":{"match_info":{"location":{"x":"-36","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:42.831 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"14.000000","armor":true,"headshot":false}}
[2022-04-02 10:16:42.839 AM] {"info":{"me":{"totalDamageDealt":"2552"}},"feature":"damage"}
[2022-04-02 10:16:43.321 AM] {"info":{"match_info":{"location":{"x":"-37","y":"-9","z":"-60"}}},"feature":"location"}
[2022-04-02 10:16:43.431 AM] {"name":"damage","data":{"targetName":"Frameworks","damageAmount":"19.000000","armor":true,"headshot":true}}
[2022-04-02 10:16:43.441 AM] {"info":{"me":{"totalDamageDealt":"2571"}},"feature":"damage"}
[2022-04-02 10:16:43.712 AM] {"name":"death","data":null}
[2022-04-02 10:16:43.724 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"death"}}},"feature":"team"}
[2022-04-02 10:16:43.736 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:17:00.962 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"death"}}},"feature":"team"}
[2022-04-02 10:17:00.975 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:05.315 AM] {"name":"respawn","data":null}
[2022-04-02 10:17:05.327 AM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2022-04-02 10:17:05.337 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:17:05.347 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:17:05.354 AM] {"info":{"match_info":{"roster_4":{"name":"MasterKriff","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"1"}}},"feature":"roster"}
[2022-04-02 10:17:05.365 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2022-04-02 10:17:05.375 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2022-04-02 10:17:05.384 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2022-04-02 10:17:05.393 AM] {"info":{"match_info":{"location":{"x":"-42","y":"61","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:05.446 AM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Peacekeeper"}}},"feature":"inventory"}
[2022-04-02 10:17:05.460 AM] {"info":{"me":{"inventory_0":{"name":"unknown_164","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:17:05.470 AM] {"info":{"me":{"inventory_1":{"name":"unknown_165","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:17:05.480 AM] {"info":{"me":{"inventory_2":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-02 10:17:05.787 AM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-02 10:17:06.240 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"5"}}},"feature":"me"}
[2022-04-02 10:17:06.321 AM] {"info":{"match_info":{"location":{"x":"-41","y":"60","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:06.582 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_crypto_heirloom_primary"}}},"feature":"inventory"}
[2022-04-02 10:17:06.820 AM] {"info":{"match_info":{"location":{"x":"-41","y":"59","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:07.320 AM] {"info":{"match_info":{"location":{"x":"-41","y":"58","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:07.819 AM] {"info":{"match_info":{"location":{"x":"-42","y":"56","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:08.320 AM] {"info":{"match_info":{"location":{"x":"-42","y":"54","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:08.762 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Pekoh246","victimName":"[STB] Per Aspera Ad Astra","weaponName":"rui/ordnance_icons/grenade_arc","action":"kill"}}
[2022-04-02 10:17:08.818 AM] {"info":{"match_info":{"location":{"x":"-41","y":"53","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:09.318 AM] {"info":{"match_info":{"location":{"x":"-41","y":"52","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:09.819 AM] {"info":{"match_info":{"location":{"x":"-40","y":"50","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:10.320 AM] {"info":{"match_info":{"location":{"x":"-39","y":"48","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:10.820 AM] {"info":{"match_info":{"location":{"x":"-39","y":"47","z":"-59"}}},"feature":"location"}
[2022-04-02 10:17:11.322 AM] {"info":{"match_info":{"location":{"x":"-39","y":"45","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:11.818 AM] {"info":{"match_info":{"location":{"x":"-38","y":"44","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:12.322 AM] {"info":{"match_info":{"location":{"x":"-38","y":"43","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:12.818 AM] {"info":{"match_info":{"location":{"x":"-37","y":"41","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:13.318 AM] {"info":{"match_info":{"location":{"x":"-36","y":"40","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:13.819 AM] {"info":{"match_info":{"location":{"x":"-36","y":"38","z":"-59"}}},"feature":"location"}
[2022-04-02 10:17:14.321 AM] {"info":{"match_info":{"location":{"x":"-36","y":"37","z":"-59"}}},"feature":"location"}
[2022-04-02 10:17:14.818 AM] {"info":{"match_info":{"location":{"x":"-36","y":"35","z":"-59"}}},"feature":"location"}
[2022-04-02 10:17:15.260 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Frameworks","victimName":"[Meow] Hugatreedamnit","weaponName":"car","action":"kill"}}
[2022-04-02 10:17:15.322 AM] {"info":{"match_info":{"location":{"x":"-36","y":"34","z":"-59"}}},"feature":"location"}
[2022-04-02 10:17:15.818 AM] {"info":{"match_info":{"location":{"x":"-36","y":"34","z":"-58"}}},"feature":"location"}
[2022-04-02 10:17:16.323 AM] {"info":{"match_info":{"location":{"x":"-36","y":"34","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:16.821 AM] {"info":{"match_info":{"location":{"x":"-36","y":"33","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:17.311 AM] {"info":{"match_info":{"teammate_2":{"name":"ImYourFavy","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:17:17.327 AM] {"info":{"match_info":{"roster_10":{"name":"ImYourFavy","isTeammate":true,"team_id":6,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:17.339 AM] {"info":{"match_info":{"location":{"x":"-37","y":"31","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:17.818 AM] {"info":{"match_info":{"location":{"x":"-38","y":"30","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:18.319 AM] {"info":{"match_info":{"location":{"x":"-38","y":"28","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:18.819 AM] {"info":{"match_info":{"location":{"x":"-38","y":"27","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:19.317 AM] {"info":{"match_info":{"location":{"x":"-37","y":"25","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:19.822 AM] {"info":{"match_info":{"location":{"x":"-37","y":"24","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:20.321 AM] {"info":{"match_info":{"location":{"x":"-36","y":"22","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:20.822 AM] {"info":{"match_info":{"location":{"x":"-36","y":"20","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:21.318 AM] {"info":{"match_info":{"location":{"x":"-35","y":"19","z":"-57"}}},"feature":"location"}
[2022-04-02 10:17:21.823 AM] {"info":{"match_info":{"location":{"x":"-35","y":"17","z":"-59"}}},"feature":"location"}
[2022-04-02 10:17:22.319 AM] {"info":{"match_info":{"location":{"x":"-36","y":"15","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:22.822 AM] {"info":{"match_info":{"location":{"x":"-36","y":"13","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:23.319 AM] {"info":{"match_info":{"location":{"x":"-36","y":"12","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:23.817 AM] {"info":{"match_info":{"location":{"x":"-35","y":"10","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:24.323 AM] {"info":{"match_info":{"location":{"x":"-35","y":"9","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:24.819 AM] {"info":{"match_info":{"location":{"x":"-36","y":"7","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:25.319 AM] {"info":{"match_info":{"location":{"x":"-35","y":"6","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:25.818 AM] {"info":{"match_info":{"location":{"x":"-35","y":"4","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:26.322 AM] {"info":{"match_info":{"location":{"x":"-34","y":"3","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:26.818 AM] {"info":{"match_info":{"location":{"x":"-33","y":"2","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:27.319 AM] {"info":{"match_info":{"location":{"x":"-33","y":"1","z":"-60"}}},"feature":"location"}
[2022-04-02 10:17:27.821 AM] {"info":{"match_info":{"location":{"x":"-32","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:28.258 AM] {"info":{"match_info":{"teammate_3":{"name":"turtle","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:17:28.272 AM] {"info":{"match_info":{"roster_18":{"name":"turtle","isTeammate":true,"team_id":2,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:28.282 AM] {"info":{"match_info":{"roster_19":{"name":"Scott Santiago","isTeammate":false,"team_id":6,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:28.292 AM] {"info":{"match_info":{"roster_20":{"name":"ImYourFavy","isTeammate":false,"team_id":6,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:28.303 AM] {"info":{"match_info":{"teammate_4":{"name":"mokumoku_kun","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:17:28.315 AM] {"info":{"match_info":{"roster_21":{"name":"mokumoku_kun","isTeammate":true,"team_id":2,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:28.327 AM] {"info":{"match_info":{"teammate_5":{"name":"Per Aspera Ad Astra","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:17:28.339 AM] {"info":{"match_info":{"roster_22":{"name":"Per Aspera Ad Astra","isTeammate":true,"team_id":2,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:28.355 AM] {"info":{"match_info":{"location":{"x":"-31","y":"0","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:28.369 AM] {"info":{"match_info":{"teammate_6":{"name":"H3llsGat313","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:17:28.381 AM] {"info":{"match_info":{"roster_23":{"name":"H3llsGat313","isTeammate":true,"team_id":2,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:28.392 AM] {"info":{"match_info":{"teammate_7":{"name":"Hugatreedamnit","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:17:28.402 AM] {"info":{"match_info":{"roster_24":{"name":"Hugatreedamnit","isTeammate":true,"team_id":2,"platform_hw":2,"platform_sw":2,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:28.411 AM] {"info":{"match_info":{"teammate_8":{"name":"doridoridoridori","state":"respawn"}}},"feature":"team"}
[2022-04-02 10:17:28.421 AM] {"info":{"match_info":{"roster_25":{"name":"doridoridoridori","isTeammate":true,"team_id":2,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-02 10:17:28.821 AM] {"info":{"match_info":{"location":{"x":"-30","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:29.320 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-1","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:29.823 AM] {"info":{"match_info":{"location":{"x":"-29","y":"-2","z":"-61"}}},"feature":"location"}
[2022-04-02 10:17:31.714 AM] {"info":{"match_info":{"teammate_2":null}},"feature":"team"}
[2022-04-02 10:17:31.725 AM] {"info":{"match_info":{"roster_10":null}},"feature":"roster"}
[2022-04-02 10:17:31.732 AM] {"info":{"match_info":{"roster_20":null}},"feature":"roster"}
[2022-04-02 10:17:35.691 AM] {"info":{"match_info":{"pseudo_match_id":null}},"feature":"match_info"}
[2022-04-02 10:17:35.701 AM] {"info":{"match_info":{"team_info":{"team_state":null}}},"feature":"team"}
[2022-04-02 10:17:35.722 AM] {"info":{"game_info":{"match_state":"inactive"}},"feature":"match_state"}
[2022-04-02 10:17:35.730 AM] {"name":"match_end","data":null}
[2022-04-02 10:17:35.739 AM] {"info":{"match_info":{"location":{"x":"0","y":"0","z":"0"}}},"feature":"location"}
[2022-04-02 10:17:35.747 AM] {"info":{"match_info":{"roster_0":null}},"feature":"roster"}
[2022-04-02 10:17:35.758 AM] {"info":{"match_info":{"roster_1":null}},"feature":"roster"}
[2022-04-02 10:17:35.766 AM] {"info":{"match_info":{"roster_2":null}},"feature":"roster"}
[2022-04-02 10:17:35.775 AM] {"info":{"match_info":{"roster_3":null}},"feature":"roster"}
[2022-04-02 10:17:35.784 AM] {"info":{"match_info":{"teammate_0":null}},"feature":"team"}
[2022-04-02 10:17:35.792 AM] {"info":{"match_info":{"roster_4":null}},"feature":"roster"}
[2022-04-02 10:17:35.799 AM] {"info":{"match_info":{"roster_5":null}},"feature":"roster"}
[2022-04-02 10:17:35.806 AM] {"info":{"match_info":{"teammate_1":null}},"feature":"team"}
[2022-04-02 10:17:35.818 AM] {"info":{"match_info":{"roster_6":null}},"feature":"roster"}
[2022-04-02 10:17:35.824 AM] {"info":{"match_info":{"roster_7":null}},"feature":"roster"}
[2022-04-02 10:17:35.830 AM] {"info":{"match_info":{"roster_8":null}},"feature":"roster"}
[2022-04-02 10:17:35.835 AM] {"info":{"match_info":{"roster_9":null}},"feature":"roster"}
[2022-04-02 10:17:35.851 AM] {"info":{"match_info":{"roster_11":null}},"feature":"roster"}
[2022-04-02 10:17:35.858 AM] {"info":{"match_info":{"roster_12":null}},"feature":"roster"}
[2022-04-02 10:17:35.864 AM] {"info":{"match_info":{"roster_14":null}},"feature":"roster"}
[2022-04-02 10:17:35.870 AM] {"info":{"match_info":{"roster_15":null}},"feature":"roster"}
[2022-04-02 10:17:35.876 AM] {"info":{"match_info":{"roster_16":null}},"feature":"roster"}
[2022-04-02 10:17:35.883 AM] {"info":{"match_info":{"roster_17":null}},"feature":"roster"}
[2022-04-02 10:17:35.889 AM] {"info":{"match_info":{"roster_13":null}},"feature":"roster"}
[2022-04-02 10:17:35.895 AM] {"info":{"match_info":{"teammate_3":null}},"feature":"team"}
[2022-04-02 10:17:35.902 AM] {"info":{"match_info":{"roster_18":null}},"feature":"roster"}
[2022-04-02 10:17:35.908 AM] {"info":{"match_info":{"roster_19":null}},"feature":"roster"}
[2022-04-02 10:17:35.914 AM] {"info":{"match_info":{"teammate_4":null}},"feature":"team"}
[2022-04-02 10:17:35.921 AM] {"info":{"match_info":{"roster_21":null}},"feature":"roster"}
[2022-04-02 10:17:35.928 AM] {"info":{"match_info":{"teammate_5":null}},"feature":"team"}
[2022-04-02 10:17:35.937 AM] {"info":{"match_info":{"roster_22":null}},"feature":"roster"}
[2022-04-02 10:17:35.944 AM] {"info":{"match_info":{"teammate_6":null}},"feature":"team"}
[2022-04-02 10:17:35.952 AM] {"info":{"match_info":{"roster_23":null}},"feature":"roster"}
[2022-04-02 10:17:35.961 AM] {"info":{"match_info":{"teammate_7":null}},"feature":"team"}
[2022-04-02 10:17:35.967 AM] {"info":{"match_info":{"roster_24":null}},"feature":"roster"}
[2022-04-02 10:17:35.974 AM] {"info":{"match_info":{"teammate_8":null}},"feature":"team"}
[2022-04-02 10:17:35.981 AM] {"info":{"match_info":{"roster_25":null}},"feature":"roster"}
[2022-04-02 10:17:35.987 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2022-04-02 10:17:35.994 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2022-04-02 10:17:36.000 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2022-04-02 10:17:36.006 AM] {"info":{"me":{"inventory_4":null}},"feature":"inventory"}
[2022-04-02 10:17:36.013 AM] {"info":{"me":{"inventory_5":null}},"feature":"inventory"}
[2022-04-02 10:17:36.019 AM] {"info":{"me":{"inventory_6":null}},"feature":"inventory"}
[2022-04-02 10:17:36.025 AM] {"info":{"me":{"inventory_7":null}},"feature":"inventory"}
[2022-04-02 10:17:36.032 AM] {"info":{"me":{"inventory_8":null}},"feature":"inventory"}
[2022-04-02 10:17:36.038 AM] {"info":{"me":{"inventory_9":null}},"feature":"inventory"}
[2022-04-02 10:17:36.044 AM] {"info":{"me":{"inventory_10":null}},"feature":"inventory"}
[2022-04-02 10:17:36.054 AM] {"info":{"me":{"inventory_11":null}},"feature":"inventory"}
[2022-04-02 10:17:36.063 AM] {"info":{"me":{"inventory_12":null}},"feature":"inventory"}
[2022-04-02 10:17:36.069 AM] {"info":{"me":{"inventory_13":null}},"feature":"inventory"}
[2022-04-02 10:17:36.076 AM] {"info":{"me":{"inventory_14":null}},"feature":"inventory"}
[2022-04-02 10:17:36.084 AM] {"info":{"me":{"inventory_15":null}},"feature":"inventory"}
[2022-04-02 10:17:36.091 AM] {"info":{"me":{"inventory_16":null}},"feature":"inventory"}
[2022-04-02 10:17:36.098 AM] {"info":{"me":{"inventory_17":null}},"feature":"inventory"}
[2022-04-02 10:17:36.104 AM] {"info":{"me":{"inventory_18":null}},"feature":"inventory"}
[2022-04-02 10:17:36.111 AM] {"info":{"me":{"inventory_19":null}},"feature":"inventory"}
[2022-04-02 10:17:36.117 AM] {"info":{"me":{"inventory_20":null}},"feature":"inventory"}
[2022-04-02 10:17:36.124 AM] {"info":{"me":{"inventory_21":null}},"feature":"inventory"}
[2022-04-02 10:17:36.131 AM] {"info":{"me":{"inventory_22":null}},"feature":"inventory"}
[2022-04-02 10:17:36.138 AM] {"info":{"me":{"inventory_23":null}},"feature":"inventory"}
[2022-04-02 10:17:36.145 AM] {"info":{"me":{"inventory_24":null}},"feature":"inventory"}
[2022-04-02 10:17:36.151 AM] {"info":{"me":{"inventory_25":null}},"feature":"inventory"}
[2022-04-02 10:17:36.160 AM] {"info":{"me":{"inventory_26":null}},"feature":"inventory"}
[2022-04-02 10:17:36.169 AM] {"info":{"me":{"inventory_27":null}},"feature":"inventory"}
[2022-04-02 10:17:36.175 AM] {"info":{"me":{"inventory_28":null}},"feature":"inventory"}
[2022-04-02 10:17:36.183 AM] {"info":{"me":{"inventory_29":null}},"feature":"inventory"}
[2022-04-02 10:17:36.190 AM] {"info":{"me":{"inventory_30":null}},"feature":"inventory"}
[2022-04-02 10:17:36.197 AM] {"info":{"me":{"inventory_31":null}},"feature":"inventory"}
[2022-04-02 10:17:37.700 AM] {"info":{"match_info":{"legendSelect_0":null}},"feature":"team"}
[2022-04-02 10:17:37.712 AM] {"info":{"match_info":{"legendSelect_1":null}},"feature":"team"}
[2022-04-02 10:17:37.720 AM] {"info":{"match_info":{"legendSelect_2":null}},"feature":"team"}
[2022-04-02 10:17:37.727 AM] {"info":{"match_info":{"tabs":null}},"feature":"match_info"}
`;
