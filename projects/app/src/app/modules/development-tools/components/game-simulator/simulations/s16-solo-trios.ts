import { v4 as uuid } from "uuid";

export const s16SoloTrios = (): string => `
[2023-04-17 11:04:53.807 AM] {"info":{"match_info":{"game_mode":"#PL_TRIO"}},"feature":"match_info"}
[2023-04-17 11:04:53.872 AM] {"info":{"match_info":{"map_id":"mp_rr_olympus_mu2"}},"feature":"match_info"}
[2023-04-17 11:04:54.108 AM] {"info":{"match_info":{"location":{"x":"-76","y":"-93","z":"-53"}}},"feature":"location"}
[2023-04-17 11:04:55.111 AM] {"info":{"match_info":{"roster_0":{"name":"DriPPyMastiFFy","isTeammate":false,"team_id":9,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"1008393079728","origin_id":"1008393079728"}}},"feature":"roster"}
[2023-04-17 11:04:55.112 AM] {"info":{"match_info":{"roster_1":{"name":"Rolders","isTeammate":false,"team_id":15,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"1009734703806","origin_id":"1009734703806"}}},"feature":"roster"}
[2023-04-17 11:04:55.113 AM] {"info":{"match_info":{"roster_2":{"name":"Onniki","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199143610196","origin_id":"1004788025831"}}},"feature":"roster"}
[2023-04-17 11:04:55.124 AM] {"info":{"match_info":{"roster_3":{"name":"Fortnite is Better","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198343915138","origin_id":"1010284983611"}}},"feature":"roster"}
[2023-04-17 11:04:55.125 AM] {"info":{"match_info":{"roster_4":{"name":"ShinobiiSensei | TTV","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198159211054","origin_id":"1000361713246"}}},"feature":"roster"}
[2023-04-17 11:04:55.126 AM] {"info":{"match_info":{"roster_5":{"name":"son deebo","isTeammate":false,"team_id":2,"platform_hw":10,"platform_sw":10,"is_local":"0","platform_id":"2535461447268065","origin_id":"1006239745274"}}},"feature":"roster"}
[2023-04-17 11:04:55.128 AM] {"info":{"match_info":{"roster_6":{"name":"CarlBass","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199246207914","origin_id":"1009518645085"}}},"feature":"roster"}
[2023-04-17 11:04:55.129 AM] {"info":{"match_info":{"roster_7":{"name":"TNT","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199018557397","origin_id":"1008422522465"}}},"feature":"roster"}
[2023-04-17 11:04:55.132 AM] {"info":{"match_info":{"roster_8":{"name":"pablo_ba","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198980274451","origin_id":"1009269742801"}}},"feature":"roster"}
[2023-04-17 11:04:55.133 AM] {"info":{"match_info":{"roster_9":{"name":"Zyncere","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"1009729487851","origin_id":"1009729487851"}}},"feature":"roster"}
[2023-04-17 11:04:55.134 AM] {"info":{"match_info":{"roster_10":{"name":"xoJuni","isTeammate":false,"team_id":2,"platform_hw":10,"platform_sw":10,"is_local":"0","platform_id":"2535416984230307","origin_id":"1006530163719"}}},"feature":"roster"}
[2023-04-17 11:04:55.136 AM] {"info":{"match_info":{"roster_11":{"name":"GuchiiJD","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"1002918761793","origin_id":"1002918761793"}}},"feature":"roster"}
[2023-04-17 11:04:55.138 AM] {"info":{"match_info":{"roster_12":{"name":"Rasenrengan24","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198848356099","origin_id":"1009368830989"}}},"feature":"roster"}
[2023-04-17 11:04:55.139 AM] {"info":{"match_info":{"roster_13":{"name":"Pyroh","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199016521945","origin_id":"1011590537118"}}},"feature":"roster"}
[2023-04-17 11:04:55.141 AM] {"info":{"match_info":{"roster_14":{"name":"uka uka","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199230239832","origin_id":"1008358694082"}}},"feature":"roster"}
[2023-04-17 11:04:55.142 AM] {"info":{"match_info":{"roster_15":{"name":"ELKNESS007","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199379334540","origin_id":"1010598095681"}}},"feature":"roster"}
[2023-04-17 11:04:55.143 AM] {"info":{"match_info":{"roster_16":{"name":"Skinny Pete","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199489673339","origin_id":"1008757406837"}}},"feature":"roster"}
[2023-04-17 11:04:55.144 AM] {"info":{"match_info":{"roster_17":{"name":"Kingo1N54N3o","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"1005009249033","origin_id":"1005009249033"}}},"feature":"roster"}
[2023-04-17 11:04:55.145 AM] {"info":{"match_info":{"roster_18":{"name":"blur","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198356451189","origin_id":"1000167525618"}}},"feature":"roster"}
[2023-04-17 11:04:55.146 AM] {"info":{"match_info":{"roster_19":{"name":"\\(o_0)/","isTeammate":false,"team_id":19,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198045881086","origin_id":"1009042111058"}}},"feature":"roster"}
[2023-04-17 11:04:55.148 AM] {"info":{"match_info":{"roster_20":{"name":"TheDude4080","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198959191397","origin_id":"1004606092431"}}},"feature":"roster"}
[2023-04-17 11:04:55.150 AM] {"info":{"match_info":{"roster_21":{"name":"D3RO ( ¬‿¬) 凸","isTeammate":false,"team_id":19,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199127019712","origin_id":"1006642651891"}}},"feature":"roster"}
[2023-04-17 11:04:55.162 AM] {"info":{"match_info":{"roster_22":{"name":"Holy_pharaoh","isTeammate":false,"team_id":19,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199297669717","origin_id":"1005075288030"}}},"feature":"roster"}
[2023-04-17 11:04:55.165 AM] {"info":{"match_info":{"roster_23":{"name":"DoN of ChaoS","isTeammate":false,"team_id":9,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199414974592","origin_id":"1005427067904"}}},"feature":"roster"}
[2023-04-17 11:04:55.168 AM] {"info":{"match_info":{"roster_24":{"name":"WxRaxz","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199476411633","origin_id":"1003599984410"}}},"feature":"roster"}
[2023-04-17 11:04:55.171 AM] {"info":{"match_info":{"roster_25":{"name":"TheRisingDuck","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198267188161","origin_id":"1006378180495"}}},"feature":"roster"}
[2023-04-17 11:04:55.174 AM] {"info":{"match_info":{"roster_26":{"name":"monstrous313","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"1003686395937","origin_id":"1003686395937"}}},"feature":"roster"}
[2023-04-17 11:04:55.178 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff | YouTube","state":"alive"}}},"feature":"team"}
[2023-04-17 11:04:55.183 AM] {"info":{"match_info":{"roster_27":{"name":"MasterKriff | YouTube","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"alive","is_local":"1","platform_id":"76561197980819668","origin_id":"1008162215062"}}},"feature":"roster"}
[2023-04-17 11:04:55.238 AM] {"info":{"match_info":{"roster_28":{"name":"Demonic Ping","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199172632306","origin_id":"1004414202795"}}},"feature":"roster"}
[2023-04-17 11:04:55.240 AM] {"info":{"match_info":{"roster_29":{"name":"Johnhetfield93","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198302433361","origin_id":"1008010057655"}}},"feature":"roster"}
[2023-04-17 11:04:55.242 AM] {"info":{"match_info":{"roster_30":{"name":"Yōkai","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198797084091","origin_id":"1009643840834"}}},"feature":"roster"}
[2023-04-17 11:04:55.244 AM] {"info":{"match_info":{"roster_31":{"name":"TheRandomnatrix","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198051075745","origin_id":"1009207193610"}}},"feature":"roster"}
[2023-04-17 11:04:55.247 AM] {"info":{"match_info":{"roster_32":{"name":"angelo-under12","isTeammate":false,"team_id":10,"platform_hw":8,"platform_sw":8,"is_local":"0","platform_id":"3350541437749222204","origin_id":"1011178221988"}}},"feature":"roster"}
[2023-04-17 11:04:55.250 AM] {"info":{"match_info":{"roster_33":{"name":"Jovar03","isTeammate":false,"team_id":15,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199200887759","origin_id":"1008172155022"}}},"feature":"roster"}
[2023-04-17 11:04:55.253 AM] {"info":{"match_info":{"roster_34":{"name":"Elotito","isTeammate":false,"team_id":6,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199138038607","origin_id":"1010452181987"}}},"feature":"roster"}
[2023-04-17 11:04:55.257 AM] {"info":{"match_info":{"roster_35":{"name":"Water","isTeammate":false,"team_id":22,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198840525969","origin_id":"1009693758394"}}},"feature":"roster"}
[2023-04-17 11:04:55.260 AM] {"info":{"match_info":{"roster_36":{"name":"XDragoReaper","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198267956444","origin_id":"1000442167139"}}},"feature":"roster"}
[2023-04-17 11:04:55.263 AM] {"info":{"match_info":{"roster_37":{"name":"Wazci","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198091582621","origin_id":"1007860613601"}}},"feature":"roster"}
[2023-04-17 11:04:55.266 AM] {"info":{"match_info":{"roster_38":{"name":"Rango","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198075109137","origin_id":"2664960934"}}},"feature":"roster"}
[2023-04-17 11:04:55.269 AM] {"info":{"match_info":{"roster_39":{"name":"26r9ea0vvtc","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"1012777476720","origin_id":"1012777476720"}}},"feature":"roster"}
[2023-04-17 11:04:55.326 AM] {"info":{"match_info":{"roster_40":{"name":"HEXOHMKING","isTeammate":false,"team_id":12,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199029618818","origin_id":"1004877202389"}}},"feature":"roster"}
[2023-04-17 11:04:55.441 AM] {"info":{"match_info":{"roster_41":{"name":"Grant_Assassins","isTeammate":false,"team_id":12,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"2381058367","origin_id":"2381058367"}}},"feature":"roster"}
[2023-04-17 11:04:55.478 AM] {"info":{"match_info":{"roster_42":{"name":"TIGERBAIT","isTeammate":false,"team_id":22,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199026686598","origin_id":"1001347103950"}}},"feature":"roster"}
[2023-04-17 11:04:55.482 AM] {"info":{"match_info":{"roster_43":{"name":"dinkleberg","isTeammate":false,"team_id":15,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198118050677","origin_id":"1007943213767"}}},"feature":"roster"}
[2023-04-17 11:04:55.518 AM] {"info":{"match_info":{"roster_44":{"name":"Alexy_Guitar","isTeammate":false,"team_id":21,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198161469360","origin_id":"1003253314661"}}},"feature":"roster"}
[2023-04-17 11:04:55.664 AM] {"info":{"match_info":{"roster_45":{"name":"beHazard","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199440118396","origin_id":"1008028495844"}}},"feature":"roster"}
[2023-04-17 11:04:55.761 AM] {"info":{"match_info":{"roster_46":{"name":"Drewbie923","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198351632294","origin_id":"1000640142502"}}},"feature":"roster"}
[2023-04-17 11:04:55.852 AM] {"info":{"match_info":{"roster_47":{"name":"JDracing103","isTeammate":false,"team_id":12,"platform_hw":10,"platform_sw":10,"is_local":"0","platform_id":"2535449003196977","origin_id":"1015556580892"}}},"feature":"roster"}
[2023-04-17 11:04:55.855 AM] {"info":{"match_info":{"roster_48":{"name":"Shannylolhi","isTeammate":false,"team_id":22,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199256777660","origin_id":"1010571585031"}}},"feature":"roster"}
[2023-04-17 11:04:55.998 AM] {"info":{"match_info":{"roster_49":{"name":"Karlita","isTeammate":false,"team_id":9,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199173086202","origin_id":"1009356123216"}}},"feature":"roster"}
[2023-04-17 11:04:55.059 AM] {"info":{"match_info":{"roster_50":{"name":"SlimPimbus","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"1003813678945","origin_id":"1003813678945"}}},"feature":"roster"}
[2023-04-17 11:04:55.100 AM] {"info":{"match_info":{"roster_51":{"name":"Titan2518","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":2,"is_local":"0","platform_id":"1013855052775","origin_id":"1013855052775"}}},"feature":"roster"}
[2023-04-17 11:04:55.843 AM] {"info":{"match_info":{"roster_52":{"name":"guardianbladex","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561198361825817","origin_id":"1011507832703"}}},"feature":"roster"}
[2023-04-17 11:04:55.889 AM] {"info":{"match_info":{"roster_53":{"name":"Durandal","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199260665960","origin_id":"1007538010463"}}},"feature":"roster"}
[2023-04-17 11:04:55.885 AM] {"info":{"match_info":{"roster_54":{"name":"(=･ω･=)","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":7,"is_local":"0","platform_id":"76561199036487627","origin_id":"1011340318629"}}},"feature":"roster"}
[2023-04-17 11:04:55.734 AM] {"info":{"match_info":{"roster_55":{"name":"LaniMani96","isTeammate":false,"team_id":6,"platform_hw":1,"platform_sw":1,"is_local":"0","platform_id":"8436928860187742090","origin_id":"1004658004302"}}},"feature":"roster"}
[2023-04-17 11:04:56.330 AM] {"info":{"match_info":{"roster_56":{"name":"ALX-DOOMED","isTeammate":false,"team_id":6,"platform_hw":1,"platform_sw":1,"is_local":"0","platform_id":"6414661987398105586","origin_id":"1011323762679"}}},"feature":"roster"}
[2023-04-17 11:04:57.745 AM] {"info":{"match_info":{"legendSelect_3":{"playerName":"MasterKriff | YouTube","legendName":"#character_pathfinder_NAME","selectionOrder":"3","lead":true}}},"feature":"team"}
[2023-04-17 11:04:58.602 AM] {"info":{"match_info":{"location":{"x":"-13","y":"37","z":"-58"}}},"feature":"location"}
[2023-04-17 11:04:59.691 AM] {"info":{"match_info":{"pseudo_match_id":"${uuid()}"}},"feature":"match_info"}
[2023-04-17 11:04:59.694 AM] {"info":{"match_info":{"victory":null}},"feature":"rank"}
[2023-04-17 11:04:59.703 AM] {"info":{"match_info":{"team_info":{"team_state":"active"}}},"feature":"team"}
[2023-04-17 11:04:59.705 AM] {"info":{"game_info":{"match_state":"active"}},"feature":"match_state"}
[2023-04-17 11:04:59.706 AM] {"name":"match_start","data":null}
[2023-04-17 11:04:59.711 AM] {"info":{"me":{"weapons":{"weapon0":"unknown","weapon1":"unknown"}}},"feature":"inventory"}
[2023-04-17 11:04:59.713 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_pathfinder_gloves_primary"}}},"feature":"inventory"}
[2023-04-17 11:04:59.716 AM] {"info":{"me":{"inventory_0":{"name":"unknown_173","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:04:59.719 AM] {"info":{"me":{"inventory_1":{"name":"unknown_171","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:04:59.752 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2023-04-17 11:04:59.756 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":21,"players":57,"damage":0,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:04:59.808 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2023-04-17 11:04:59.813 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2023-04-17 11:05:00.103 AM] {"info":{"match_info":{"location":{"x":"460","y":"72","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:00.601 AM] {"info":{"match_info":{"location":{"x":"449","y":"73","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:01.105 AM] {"info":{"match_info":{"location":{"x":"439","y":"74","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:01.602 AM] {"info":{"match_info":{"location":{"x":"429","y":"75","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:02.103 AM] {"info":{"match_info":{"location":{"x":"419","y":"75","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:02.631 AM] {"info":{"match_info":{"location":{"x":"409","y":"76","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:03.102 AM] {"info":{"match_info":{"location":{"x":"399","y":"77","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:03.604 AM] {"info":{"match_info":{"location":{"x":"389","y":"77","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:04.100 AM] {"info":{"match_info":{"location":{"x":"379","y":"78","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:04.602 AM] {"info":{"match_info":{"location":{"x":"369","y":"79","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:05.107 AM] {"info":{"match_info":{"location":{"x":"359","y":"80","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:05.600 AM] {"info":{"match_info":{"location":{"x":"350","y":"80","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:06.105 AM] {"info":{"match_info":{"location":{"x":"340","y":"81","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:06.603 AM] {"info":{"match_info":{"location":{"x":"330","y":"82","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:07.103 AM] {"info":{"match_info":{"location":{"x":"319","y":"82","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:07.606 AM] {"info":{"match_info":{"location":{"x":"309","y":"83","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:08.100 AM] {"info":{"match_info":{"location":{"x":"300","y":"84","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:08.601 AM] {"info":{"match_info":{"location":{"x":"290","y":"85","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:09.104 AM] {"info":{"match_info":{"location":{"x":"280","y":"85","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:09.602 AM] {"info":{"match_info":{"location":{"x":"270","y":"86","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:10.101 AM] {"info":{"match_info":{"location":{"x":"260","y":"87","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:10.603 AM] {"info":{"match_info":{"location":{"x":"250","y":"87","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:11.101 AM] {"info":{"match_info":{"location":{"x":"240","y":"88","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:11.602 AM] {"info":{"match_info":{"location":{"x":"230","y":"89","z":"119"}}},"feature":"location"}
[2023-04-17 11:05:11.687 AM] {"info":{"me":{"inventory_0":{"name":"unknown_173","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:11.691 AM] {"info":{"me":{"inventory_1":{"name":"unknown_171","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:12.104 AM] {"info":{"match_info":{"location":{"x":"223","y":"90","z":"115"}}},"feature":"location"}
[2023-04-17 11:05:12.605 AM] {"info":{"match_info":{"location":{"x":"222","y":"93","z":"110"}}},"feature":"location"}
[2023-04-17 11:05:13.103 AM] {"info":{"match_info":{"location":{"x":"223","y":"96","z":"105"}}},"feature":"location"}
[2023-04-17 11:05:13.604 AM] {"info":{"match_info":{"location":{"x":"224","y":"98","z":"99"}}},"feature":"location"}
[2023-04-17 11:05:14.101 AM] {"info":{"match_info":{"location":{"x":"225","y":"100","z":"93"}}},"feature":"location"}
[2023-04-17 11:05:14.604 AM] {"info":{"match_info":{"location":{"x":"226","y":"102","z":"87"}}},"feature":"location"}
[2023-04-17 11:05:15.101 AM] {"info":{"match_info":{"location":{"x":"227","y":"104","z":"81"}}},"feature":"location"}
[2023-04-17 11:05:15.603 AM] {"info":{"match_info":{"location":{"x":"229","y":"106","z":"74"}}},"feature":"location"}
[2023-04-17 11:05:16.103 AM] {"info":{"match_info":{"location":{"x":"230","y":"109","z":"68"}}},"feature":"location"}
[2023-04-17 11:05:16.604 AM] {"info":{"match_info":{"location":{"x":"231","y":"111","z":"62"}}},"feature":"location"}
[2023-04-17 11:05:17.100 AM] {"info":{"match_info":{"location":{"x":"232","y":"113","z":"56"}}},"feature":"location"}
[2023-04-17 11:05:17.604 AM] {"info":{"match_info":{"location":{"x":"233","y":"115","z":"49"}}},"feature":"location"}
[2023-04-17 11:05:18.103 AM] {"info":{"match_info":{"location":{"x":"234","y":"117","z":"43"}}},"feature":"location"}
[2023-04-17 11:05:18.600 AM] {"info":{"match_info":{"location":{"x":"236","y":"120","z":"37"}}},"feature":"location"}
[2023-04-17 11:05:19.102 AM] {"info":{"match_info":{"location":{"x":"237","y":"122","z":"30"}}},"feature":"location"}
[2023-04-17 11:05:19.601 AM] {"info":{"match_info":{"location":{"x":"238","y":"124","z":"24"}}},"feature":"location"}
[2023-04-17 11:05:20.101 AM] {"info":{"match_info":{"location":{"x":"239","y":"126","z":"18"}}},"feature":"location"}
[2023-04-17 11:05:20.604 AM] {"info":{"match_info":{"location":{"x":"240","y":"128","z":"11"}}},"feature":"location"}
[2023-04-17 11:05:21.102 AM] {"info":{"match_info":{"location":{"x":"241","y":"130","z":"5"}}},"feature":"location"}
[2023-04-17 11:05:21.604 AM] {"info":{"match_info":{"location":{"x":"242","y":"133","z":"0"}}},"feature":"location"}
[2023-04-17 11:05:22.102 AM] {"info":{"match_info":{"location":{"x":"243","y":"135","z":"-7"}}},"feature":"location"}
[2023-04-17 11:05:22.604 AM] {"info":{"match_info":{"location":{"x":"244","y":"137","z":"-13"}}},"feature":"location"}
[2023-04-17 11:05:23.103 AM] {"info":{"match_info":{"location":{"x":"245","y":"139","z":"-19"}}},"feature":"location"}
[2023-04-17 11:05:23.601 AM] {"info":{"match_info":{"location":{"x":"246","y":"141","z":"-24"}}},"feature":"location"}
[2023-04-17 11:05:24.105 AM] {"info":{"match_info":{"location":{"x":"247","y":"143","z":"-30"}}},"feature":"location"}
[2023-04-17 11:05:24.603 AM] {"info":{"match_info":{"location":{"x":"248","y":"145","z":"-35"}}},"feature":"location"}
[2023-04-17 11:05:25.104 AM] {"info":{"match_info":{"location":{"x":"248","y":"146","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:26.100 AM] {"info":{"match_info":{"location":{"x":"248","y":"147","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:26.601 AM] {"info":{"match_info":{"location":{"x":"248","y":"148","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:27.091 AM] {"info":{"me":{"weapons":{"weapon0":"Mozambique Shotgun","weapon1":"unknown"}}},"feature":"inventory"}
[2023-04-17 11:05:27.103 AM] {"info":{"match_info":{"location":{"x":"248","y":"149","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:27.291 AM] {"info":{"me":{"inventory_0":{"name":"unknown_129","amount":"8"}}},"feature":"inventory"}
[2023-04-17 11:05:27.294 AM] {"info":{"me":{"inventory_1":{"name":"unknown_173","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:27.299 AM] {"info":{"me":{"inventory_2":{"name":"unknown_171","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:27.380 AM] {"info":{"me":{"inUse":{"inUse":"Mozambique Shotgun"}}},"feature":"inventory"}
[2023-04-17 11:05:27.392 AM] {"info":{"me":{"inventory_0":{"name":"unknown_129","amount":"16"}}},"feature":"inventory"}
[2023-04-17 11:05:27.604 AM] {"info":{"match_info":{"location":{"x":"247","y":"150","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:27.761 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_pathfinder_gloves_primary"}}},"feature":"inventory"}
[2023-04-17 11:05:28.102 AM] {"info":{"match_info":{"location":{"x":"247","y":"152","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:28.604 AM] {"info":{"match_info":{"location":{"x":"247","y":"153","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:28.885 AM] {"info":{"me":{"inventory_0":{"name":"unknown_130","amount":"20"}}},"feature":"inventory"}
[2023-04-17 11:05:28.889 AM] {"info":{"me":{"inventory_1":{"name":"unknown_129","amount":"16"}}},"feature":"inventory"}
[2023-04-17 11:05:28.893 AM] {"info":{"me":{"inventory_2":{"name":"unknown_173","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:28.896 AM] {"info":{"me":{"inventory_3":{"name":"unknown_171","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:28.986 AM] {"info":{"me":{"weapons":{"weapon0":"Prowler Burst PDW","weapon1":"Mozambique Shotgun"}}},"feature":"inventory"}
[2023-04-17 11:05:29.101 AM] {"info":{"match_info":{"location":{"x":"247","y":"154","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:29.292 AM] {"info":{"me":{"inUse":{"inUse":"Prowler Burst PDW"}}},"feature":"inventory"}
[2023-04-17 11:05:29.295 AM] {"info":{"me":{"inventory_0":{"name":"unknown_130","amount":"40"}}},"feature":"inventory"}
[2023-04-17 11:05:29.606 AM] {"info":{"me":{"inventory_0":{"name":"unknown_130","amount":"60"}}},"feature":"inventory"}
[2023-04-17 11:05:29.614 AM] {"info":{"match_info":{"location":{"x":"248","y":"154","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:29.703 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_pathfinder_gloves_primary"}}},"feature":"inventory"}
[2023-04-17 11:05:30.103 AM] {"info":{"match_info":{"location":{"x":"248","y":"153","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:30.601 AM] {"info":{"match_info":{"location":{"x":"249","y":"153","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:30.745 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"5"}}},"feature":"me"}
[2023-04-17 11:05:31.035 AM] {"info":{"me":{"inUse":{"inUse":"Mozambique Shotgun"}}},"feature":"inventory"}
[2023-04-17 11:05:31.104 AM] {"info":{"match_info":{"location":{"x":"251","y":"153","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:31.288 AM] {"info":{"me":{"inventory_2":{"name":"unknown_127","amount":"20"}}},"feature":"inventory"}
[2023-04-17 11:05:31.293 AM] {"info":{"me":{"inventory_3":{"name":"unknown_173","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:31.297 AM] {"info":{"me":{"inventory_4":{"name":"unknown_171","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:31.790 AM] {"info":{"me":{"inventory_2":{"name":"unknown_127","amount":"40"}}},"feature":"inventory"}
[2023-04-17 11:05:32.101 AM] {"info":{"match_info":{"location":{"x":"251","y":"154","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:32.191 AM] {"info":{"me":{"weapons":{"weapon0":"Prowler Burst PDW","weapon1":"G7 Scout"}}},"feature":"inventory"}
[2023-04-17 11:05:32.402 AM] {"info":{"me":{"inventory_2":{"name":"unknown_127","amount":"60"}}},"feature":"inventory"}
[2023-04-17 11:05:32.407 AM] {"info":{"me":{"inUse":{"inUse":"G7 Scout"}}},"feature":"inventory"}
[2023-04-17 11:05:32.603 AM] {"info":{"me":{"inventory_4":{"name":"unknown_171","amount":"4"}}},"feature":"inventory"}
[2023-04-17 11:05:32.612 AM] {"info":{"match_info":{"location":{"x":"252","y":"154","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:32.891 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_pathfinder_gloves_primary"}}},"feature":"inventory"}
[2023-04-17 11:05:33.103 AM] {"info":{"match_info":{"location":{"x":"252","y":"153","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:33.601 AM] {"info":{"match_info":{"location":{"x":"252","y":"152","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:34.105 AM] {"info":{"match_info":{"location":{"x":"254","y":"151","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:34.389 AM] {"info":{"me":{"inventory_3":{"name":"unknown_172","amount":"1"}}},"feature":"inventory"}
[2023-04-17 11:05:34.395 AM] {"info":{"me":{"inventory_4":{"name":"unknown_173","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:34.400 AM] {"info":{"me":{"inventory_5":{"name":"unknown_171","amount":"4"}}},"feature":"inventory"}
[2023-04-17 11:05:34.604 AM] {"info":{"match_info":{"location":{"x":"255","y":"150","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:35.103 AM] {"info":{"match_info":{"location":{"x":"256","y":"149","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:35.503 AM] {"info":{"me":{"inUse":{"inUse":"Prowler Burst PDW"}}},"feature":"inventory"}
[2023-04-17 11:05:35.604 AM] {"info":{"match_info":{"location":{"x":"258","y":"150","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:35.957 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_pathfinder_gloves_primary"}}},"feature":"inventory"}
[2023-04-17 11:05:36.100 AM] {"info":{"match_info":{"location":{"x":"259","y":"151","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:36.594 AM] {"info":{"me":{"inventory_3":{"name":"unknown_127","amount":"20"}}},"feature":"inventory"}
[2023-04-17 11:05:36.599 AM] {"info":{"me":{"inventory_4":{"name":"unknown_172","amount":"1"}}},"feature":"inventory"}
[2023-04-17 11:05:36.603 AM] {"info":{"me":{"inventory_5":{"name":"unknown_173","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:36.607 AM] {"info":{"me":{"inventory_6":{"name":"unknown_171","amount":"4"}}},"feature":"inventory"}
[2023-04-17 11:05:36.611 AM] {"info":{"match_info":{"location":{"x":"260","y":"152","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:36.748 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"dinkleberg","victimName":"D3RO ( ¬‿¬) 凸","weaponName":"triple_take","action":"knockdown"}}
[2023-04-17 11:05:36.752 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"10"}}},"feature":"me"}
[2023-04-17 11:05:37.101 AM] {"info":{"match_info":{"location":{"x":"260","y":"153","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:37.143 AM] {"info":{"me":{"inUse":{"inUse":"G7 Scout"}}},"feature":"inventory"}
[2023-04-17 11:05:37.249 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Jovar03","victimName":"Holy_pharaoh","weaponName":"g7","action":"knockdown"}}
[2023-04-17 11:05:38.491 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_pathfinder_gloves_primary"}}},"feature":"inventory"}
[2023-04-17 11:05:38.603 AM] {"info":{"match_info":{"location":{"x":"260","y":"152","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:39.104 AM] {"info":{"match_info":{"location":{"x":"260","y":"151","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:39.601 AM] {"info":{"match_info":{"location":{"x":"260","y":"149","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:40.102 AM] {"info":{"match_info":{"location":{"x":"259","y":"148","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:40.606 AM] {"info":{"match_info":{"location":{"x":"258","y":"146","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:41.105 AM] {"info":{"match_info":{"location":{"x":"258","y":"144","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:41.246 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Jovar03","victimName":"\\(o_0)/","weaponName":"g7","action":"kill"}}
[2023-04-17 11:05:41.251 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":21,"players":56,"damage":0,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:05:41.603 AM] {"info":{"match_info":{"location":{"x":"259","y":"144","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:41.745 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Jovar03","victimName":"Holy_pharaoh","weaponName":null,"action":"Bleed_out"}}
[2023-04-17 11:05:41.749 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"dinkleberg","victimName":"D3RO ( ¬‿¬) 凸","weaponName":null,"action":"Bleed_out"}}
[2023-04-17 11:05:41.754 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":20,"players":54,"damage":0,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:05:41.867 AM] {"info":{"me":{"inUse":{"inUse":"Prowler Burst PDW"}}},"feature":"inventory"}
[2023-04-17 11:05:42.103 AM] {"info":{"match_info":{"location":{"x":"260","y":"144","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:42.435 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_pathfinder_gloves_primary"}}},"feature":"inventory"}
[2023-04-17 11:05:42.745 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"15"}}},"feature":"me"}
[2023-04-17 11:05:43.105 AM] {"info":{"match_info":{"location":{"x":"259","y":"143","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:43.299 AM] {"info":{"me":{"inventory_7":{"name":"unknown_198","amount":"1"}}},"feature":"inventory"}
[2023-04-17 11:05:43.494 AM] {"info":{"me":{"inventory_8":{"name":"unknown_216","amount":"1"}}},"feature":"inventory"}
[2023-04-17 11:05:43.605 AM] {"info":{"match_info":{"location":{"x":"259","y":"144","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:44.103 AM] {"info":{"match_info":{"location":{"x":"258","y":"144","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:44.605 AM] {"info":{"match_info":{"location":{"x":"258","y":"143","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:45.104 AM] {"info":{"match_info":{"location":{"x":"256","y":"142","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:45.366 AM] {"info":{"match_info":{"roster_21":null}},"feature":"roster"}
[2023-04-17 11:05:45.498 AM] {"info":{"me":{"inventory_8":null}},"feature":"inventory"}
[2023-04-17 11:05:45.606 AM] {"info":{"match_info":{"location":{"x":"255","y":"142","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:45.702 AM] {"info":{"me":{"inventory_1":{"name":"unknown_127","amount":"60"}}},"feature":"inventory"}
[2023-04-17 11:05:45.708 AM] {"info":{"me":{"inventory_2":{"name":"unknown_127","amount":"20"}}},"feature":"inventory"}
[2023-04-17 11:05:45.714 AM] {"info":{"me":{"inventory_3":{"name":"unknown_172","amount":"1"}}},"feature":"inventory"}
[2023-04-17 11:05:45.719 AM] {"info":{"me":{"inventory_4":{"name":"unknown_173","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:05:45.724 AM] {"info":{"me":{"inventory_5":{"name":"unknown_171","amount":"4"}}},"feature":"inventory"}
[2023-04-17 11:05:45.731 AM] {"info":{"me":{"inventory_6":{"name":"unknown_198","amount":"1"}}},"feature":"inventory"}
[2023-04-17 11:05:45.736 AM] {"info":{"me":{"inventory_7":null}},"feature":"inventory"}
[2023-04-17 11:05:46.101 AM] {"info":{"match_info":{"location":{"x":"254","y":"142","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:46.602 AM] {"info":{"match_info":{"location":{"x":"252","y":"143","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:47.105 AM] {"info":{"match_info":{"location":{"x":"250","y":"143","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:47.604 AM] {"info":{"match_info":{"location":{"x":"248","y":"143","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:48.105 AM] {"info":{"match_info":{"location":{"x":"247","y":"143","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:48.604 AM] {"info":{"match_info":{"location":{"x":"246","y":"144","z":"-36"}}},"feature":"location"}
[2023-04-17 11:05:48.743 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"20"}}},"feature":"me"}
[2023-04-17 11:05:49.106 AM] {"info":{"match_info":{"location":{"x":"244","y":"146","z":"-34"}}},"feature":"location"}
[2023-04-17 11:05:49.609 AM] {"info":{"match_info":{"location":{"x":"240","y":"145","z":"-33"}}},"feature":"location"}
[2023-04-17 11:05:50.102 AM] {"info":{"match_info":{"location":{"x":"235","y":"144","z":"-34"}}},"feature":"location"}
[2023-04-17 11:05:50.604 AM] {"info":{"match_info":{"location":{"x":"232","y":"144","z":"-35"}}},"feature":"location"}
[2023-04-17 11:05:51.105 AM] {"info":{"match_info":{"location":{"x":"231","y":"144","z":"-35"}}},"feature":"location"}
[2023-04-17 11:05:52.103 AM] {"info":{"match_info":{"location":{"x":"230","y":"142","z":"-35"}}},"feature":"location"}
[2023-04-17 11:05:52.424 AM] {"info":{"match_info":{"roster_54":null}},"feature":"roster"}
[2023-04-17 11:05:52.602 AM] {"info":{"match_info":{"location":{"x":"228","y":"139","z":"-35"}}},"feature":"location"}
[2023-04-17 11:05:52.749 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":20,"players":53,"damage":0,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:05:53.070 AM] {"info":{"match_info":{"roster_19":null}},"feature":"roster"}
[2023-04-17 11:05:53.077 AM] {"info":{"match_info":{"roster_22":null}},"feature":"roster"}
[2023-04-17 11:05:53.102 AM] {"info":{"match_info":{"location":{"x":"225","y":"135","z":"-34"}}},"feature":"location"}
[2023-04-17 11:05:53.603 AM] {"info":{"match_info":{"location":{"x":"223","y":"131","z":"-32"}}},"feature":"location"}
[2023-04-17 11:05:54.101 AM] {"info":{"match_info":{"location":{"x":"220","y":"126","z":"-32"}}},"feature":"location"}
[2023-04-17 11:05:54.602 AM] {"info":{"match_info":{"location":{"x":"217","y":"123","z":"-31"}}},"feature":"location"}
[2023-04-17 11:05:54.745 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"GuchiiJD","victimName":"Water","weaponName":"alternator","action":"knockdown"}}
[2023-04-17 11:05:54.752 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"25"}}},"feature":"me"}
[2023-04-17 11:05:55.105 AM] {"info":{"match_info":{"location":{"x":"214","y":"119","z":"-31"}}},"feature":"location"}
[2023-04-17 11:05:55.602 AM] {"info":{"match_info":{"location":{"x":"212","y":"117","z":"-30"}}},"feature":"location"}
[2023-04-17 11:05:55.752 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"blur","victimName":"Mirage7387","weaponName":"dragon","action":"knockdown"}}
[2023-04-17 11:05:56.104 AM] {"info":{"match_info":{"location":{"x":"210","y":"116","z":"-30"}}},"feature":"location"}
[2023-04-17 11:05:56.602 AM] {"info":{"match_info":{"location":{"x":"210","y":"115","z":"-31"}}},"feature":"location"}
[2023-04-17 11:05:56.932 AM] {"info":{"me":{"inUse":{"inUse":"G7 Scout"}}},"feature":"inventory"}
[2023-04-17 11:05:58.108 AM] {"info":{"match_info":{"location":{"x":"209","y":"115","z":"-31"}}},"feature":"location"}
[2023-04-17 11:05:58.604 AM] {"info":{"match_info":{"location":{"x":"209","y":"115","z":"-30"}}},"feature":"location"}
[2023-04-17 11:05:58.744 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Zyncere","victimName":"Pathfinder8253","weaponName":"r97","action":"knockdown"}}
[2023-04-17 11:05:59.100 AM] {"info":{"match_info":{"location":{"x":"209","y":"114","z":"-30"}}},"feature":"location"}
[2023-04-17 11:05:59.245 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"GuchiiJD","victimName":"Water","weaponName":"alternator","action":"kill"}}
[2023-04-17 11:05:59.251 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":20,"players":52,"damage":0,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:00.338 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"32.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:00.344 AM] {"info":{"me":{"totalDamageDealt":"32"}},"feature":"damage"}
[2023-04-17 11:06:00.745 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"30"}}},"feature":"me"}
[2023-04-17 11:06:00.754 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":20,"players":52,"damage":32,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:01.714 AM] {"info":{"match_info":{"roster_35":null}},"feature":"roster"}
[2023-04-17 11:06:02.602 AM] {"info":{"match_info":{"location":{"x":"209","y":"115","z":"-31"}}},"feature":"location"}
[2023-04-17 11:06:03.103 AM] {"info":{"match_info":{"location":{"x":"210","y":"115","z":"-31"}}},"feature":"location"}
[2023-04-17 11:06:03.599 AM] {"info":{"match_info":{"location":{"x":"209","y":"114","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:04.101 AM] {"info":{"match_info":{"location":{"x":"209","y":"113","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:04.220 AM] {"info":{"me":{"inventory_2":{"name":"unknown_127","amount":"10"}}},"feature":"inventory"}
[2023-04-17 11:06:04.245 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"TIGERBAIT","victimName":"blur","weaponName":"mozambique","action":"knockdown"}}
[2023-04-17 11:06:05.010 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_pathfinder_gloves_primary"}}},"feature":"inventory"}
[2023-04-17 11:06:05.105 AM] {"info":{"match_info":{"location":{"x":"209","y":"111","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:05.521 AM] {"info":{"match_info":{"roster_48":null}},"feature":"roster"}
[2023-04-17 11:06:05.605 AM] {"info":{"match_info":{"location":{"x":"209","y":"110","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:05.748 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":20,"players":51,"damage":32,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:05.860 AM] {"info":{"me":{"inUse":{"inUse":"G7 Scout"}}},"feature":"inventory"}
[2023-04-17 11:06:06.102 AM] {"info":{"match_info":{"location":{"x":"209","y":"108","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:06.243 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"xoJuni","victimName":"dinkleberg","weaponName":"spitfire","action":"knockdown"}}
[2023-04-17 11:06:06.250 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Yōkai","victimName":"ELKNESS007","weaponName":"dragon","action":"knockdown"}}
[2023-04-17 11:06:06.601 AM] {"info":{"match_info":{"location":{"x":"208","y":"107","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:07.746 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"35"}}},"feature":"me"}
[2023-04-17 11:06:08.490 AM] {"name":"damage","data":{"targetName":"dinkleberg","damageAmount":"51.000000","armor":false,"headshot":true}}
[2023-04-17 11:06:08.496 AM] {"info":{"me":{"totalDamageDealt":"83"}},"feature":"damage"}
[2023-04-17 11:06:08.671 AM] {"info":{"match_info":{"roster_1":null}},"feature":"roster"}
[2023-04-17 11:06:08.747 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"xoJuni","victimName":"Jovar03","weaponName":"wingman","action":"headshot_kill"}}
[2023-04-17 11:06:08.754 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":20,"players":49,"damage":83,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:09.243 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"xoJuni","victimName":"dinkleberg","weaponName":null,"action":"Bleed_out"}}
[2023-04-17 11:06:09.250 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":19,"players":48,"damage":83,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:09.602 AM] {"info":{"match_info":{"location":{"x":"208","y":"106","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:09.745 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Yōkai","victimName":"guardianbladex","weaponName":"dragon","action":"knockdown"}}
[2023-04-17 11:06:11.103 AM] {"info":{"match_info":{"location":{"x":"209","y":"106","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:11.470 AM] {"info":{"match_info":{"roster_43":null}},"feature":"roster"}
[2023-04-17 11:06:11.567 AM] {"info":{"match_info":{"roster_33":null}},"feature":"roster"}
[2023-04-17 11:06:11.602 AM] {"info":{"match_info":{"location":{"x":"209","y":"105","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:12.491 AM] {"info":{"me":{"inventory_2":{"name":"unknown_127","amount":"3"}}},"feature":"inventory"}
[2023-04-17 11:06:12.604 AM] {"info":{"match_info":{"location":{"x":"209","y":"104","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:12.744 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"40"}}},"feature":"me"}
[2023-04-17 11:06:13.785 AM] {"name":"damage","data":{"targetName":"son deebo","damageAmount":"32.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:13.792 AM] {"info":{"me":{"totalDamageDealt":"115"}},"feature":"damage"}
[2023-04-17 11:06:14.084 AM] {"name":"damage","data":{"targetName":"son deebo","damageAmount":"32.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:14.090 AM] {"info":{"me":{"totalDamageDealt":"147"}},"feature":"damage"}
[2023-04-17 11:06:14.245 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":19,"players":48,"damage":147,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:14.594 AM] {"name":"damage","data":{"targetName":"son deebo","damageAmount":"11.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:14.602 AM] {"info":{"me":{"totalDamageDealt":"158"}},"feature":"damage"}
[2023-04-17 11:06:14.610 AM] {"name":"damage","data":{"targetName":"son deebo","damageAmount":"21.000000","armor":false,"headshot":false}}
[2023-04-17 11:06:14.616 AM] {"info":{"me":{"totalDamageDealt":"179"}},"feature":"damage"}
[2023-04-17 11:06:14.746 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":19,"players":48,"damage":179,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:15.102 AM] {"info":{"match_info":{"location":{"x":"208","y":"104","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:15.134 AM] {"name":"damage","data":{"targetName":"son deebo","damageAmount":"24.000000","armor":false,"headshot":false}}
[2023-04-17 11:06:15.139 AM] {"info":{"me":{"totalDamageDealt":"203"}},"feature":"damage"}
[2023-04-17 11:06:15.244 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":19,"players":48,"damage":203,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:15.604 AM] {"info":{"match_info":{"location":{"x":"209","y":"104","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:17.103 AM] {"info":{"match_info":{"location":{"x":"210","y":"103","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:17.749 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"GuchiiJD","victimName":"TIGERBAIT","weaponName":"nemesis","action":"kill"}}
[2023-04-17 11:06:17.755 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":18,"players":47,"damage":203,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:18.102 AM] {"info":{"match_info":{"location":{"x":"210","y":"102","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:18.606 AM] {"info":{"match_info":{"location":{"x":"210","y":"102","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:18.701 AM] {"info":{"me":{"inventory_1":{"name":"unknown_127","amount":"53"}}},"feature":"inventory"}
[2023-04-17 11:06:18.707 AM] {"info":{"me":{"inventory_2":{"name":"unknown_172","amount":"1"}}},"feature":"inventory"}
[2023-04-17 11:06:18.713 AM] {"info":{"me":{"inventory_3":{"name":"unknown_173","amount":"2"}}},"feature":"inventory"}
[2023-04-17 11:06:18.718 AM] {"info":{"me":{"inventory_4":{"name":"unknown_171","amount":"4"}}},"feature":"inventory"}
[2023-04-17 11:06:18.723 AM] {"info":{"me":{"inventory_5":{"name":"unknown_198","amount":"1"}}},"feature":"inventory"}
[2023-04-17 11:06:18.729 AM] {"info":{"me":{"inventory_6":null}},"feature":"inventory"}
[2023-04-17 11:06:19.100 AM] {"info":{"match_info":{"location":{"x":"211","y":"102","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:19.513 AM] {"info":{"match_info":{"roster_42":null}},"feature":"roster"}
[2023-04-17 11:06:19.606 AM] {"info":{"match_info":{"location":{"x":"212","y":"102","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:19.747 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"45"}}},"feature":"me"}
[2023-04-17 11:06:20.100 AM] {"info":{"match_info":{"location":{"x":"211","y":"102","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:20.334 AM] {"name":"damage","data":{"targetName":"xoJuni","damageAmount":"32.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:20.341 AM] {"info":{"me":{"totalDamageDealt":"235"}},"feature":"damage"}
[2023-04-17 11:06:20.745 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Yōkai","victimName":"ELKNESS007","weaponName":"mozambique","action":"kill"}}
[2023-04-17 11:06:20.752 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":18,"players":46,"damage":235,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:21.601 AM] {"info":{"match_info":{"location":{"x":"212","y":"102","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:22.100 AM] {"info":{"match_info":{"location":{"x":"211","y":"102","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:23.100 AM] {"info":{"match_info":{"location":{"x":"211","y":"101","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:23.518 AM] {"info":{"me":{"inUse":{"inUse":"Thermite Grenade"}}},"feature":"inventory"}
[2023-04-17 11:06:23.605 AM] {"info":{"match_info":{"location":{"x":"211","y":"100","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:24.600 AM] {"info":{"match_info":{"location":{"x":"211","y":"99","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:24.744 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"50"}}},"feature":"me"}
[2023-04-17 11:06:24.997 AM] {"info":{"me":{"inventory_5":null}},"feature":"inventory"}
[2023-04-17 11:06:25.105 AM] {"info":{"match_info":{"location":{"x":"210","y":"99","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:25.488 AM] {"info":{"me":{"inUse":{"inUse":"G7 Scout"}}},"feature":"inventory"}
[2023-04-17 11:06:25.606 AM] {"info":{"match_info":{"location":{"x":"210","y":"100","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:27.103 AM] {"info":{"match_info":{"location":{"x":"210","y":"99","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:27.243 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"DoN of ChaoS","victimName":"Pathfinder3797","weaponName":"flatline","action":"knockdown"}}
[2023-04-17 11:06:27.499 AM] {"info":{"me":{"inventory_1":{"name":"unknown_127","amount":"49"}}},"feature":"inventory"}
[2023-04-17 11:06:27.608 AM] {"info":{"match_info":{"location":{"x":"209","y":"99","z":"-28"}}},"feature":"location"}
[2023-04-17 11:06:28.099 AM] {"info":{"match_info":{"location":{"x":"208","y":"98","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:28.601 AM] {"info":{"match_info":{"location":{"x":"206","y":"97","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:28.749 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Wraith6214","victimName":"angelo-under12","weaponName":"alternator","action":"kill"}}
[2023-04-17 11:06:28.756 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Yōkai","victimName":"guardianbladex","weaponName":null,"action":"Bleed_out"}}
[2023-04-17 11:06:28.761 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":17,"players":44,"damage":235,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:28.886 AM] {"name":"damage","data":{"targetName":"xoJuni","damageAmount":"44.000000","armor":true,"headshot":true}}
[2023-04-17 11:06:28.892 AM] {"info":{"me":{"totalDamageDealt":"279"}},"feature":"damage"}
[2023-04-17 11:06:29.101 AM] {"info":{"match_info":{"location":{"x":"205","y":"97","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:29.234 AM] {"name":"damage","data":{"targetName":"xoJuni","damageAmount":"24.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:29.239 AM] {"info":{"me":{"totalDamageDealt":"303"}},"feature":"damage"}
[2023-04-17 11:06:29.247 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":17,"players":44,"damage":303,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:29.533 AM] {"name":"damage","data":{"targetName":"xoJuni","damageAmount":"7.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:29.540 AM] {"info":{"me":{"totalDamageDealt":"310"}},"feature":"damage"}
[2023-04-17 11:06:29.546 AM] {"name":"damage","data":{"targetName":"xoJuni","damageAmount":"25.000000","armor":false,"headshot":false}}
[2023-04-17 11:06:29.553 AM] {"info":{"me":{"totalDamageDealt":"335"}},"feature":"damage"}
[2023-04-17 11:06:29.602 AM] {"info":{"match_info":{"location":{"x":"204","y":"97","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:29.746 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":17,"players":44,"damage":335,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:30.104 AM] {"info":{"match_info":{"location":{"x":"204","y":"96","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:30.747 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"55"}}},"feature":"me"}
[2023-04-17 11:06:31.101 AM] {"info":{"match_info":{"location":{"x":"203","y":"97","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:31.125 AM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_pathfinder_gloves_primary"}}},"feature":"inventory"}
[2023-04-17 11:06:31.511 AM] {"info":{"match_info":{"roster_52":null}},"feature":"roster"}
[2023-04-17 11:06:31.601 AM] {"info":{"match_info":{"location":{"x":"202","y":"97","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:32.101 AM] {"info":{"match_info":{"location":{"x":"200","y":"97","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:32.243 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"Durandal","victimName":"DoN of ChaoS","weaponName":"prowler","action":"knockdown"}}
[2023-04-17 11:06:32.602 AM] {"info":{"match_info":{"location":{"x":"198","y":"97","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:33.103 AM] {"info":{"match_info":{"location":{"x":"197","y":"96","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:33.605 AM] {"info":{"match_info":{"location":{"x":"197","y":"95","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:34.105 AM] {"info":{"match_info":{"location":{"x":"196","y":"94","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:34.312 AM] {"info":{"match_info":{"roster_32":null}},"feature":"roster"}
[2023-04-17 11:06:34.600 AM] {"info":{"match_info":{"location":{"x":"195","y":"93","z":"-28"}}},"feature":"location"}
[2023-04-17 11:06:34.614 AM] {"info":{"match_info":{"roster_15":null}},"feature":"roster"}
[2023-04-17 11:06:35.106 AM] {"info":{"match_info":{"location":{"x":"194","y":"92","z":"-28"}}},"feature":"location"}
[2023-04-17 11:06:35.245 AM] {"info":{"me":{"inUse":{"inUse":"Prowler Burst PDW"}}},"feature":"inventory"}
[2023-04-17 11:06:35.599 AM] {"info":{"match_info":{"location":{"x":"193","y":"91","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:36.102 AM] {"info":{"match_info":{"location":{"x":"192","y":"89","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:36.601 AM] {"info":{"match_info":{"location":{"x":"192","y":"88","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:36.744 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"60"}}},"feature":"me"}
[2023-04-17 11:06:37.599 AM] {"info":{"match_info":{"location":{"x":"192","y":"89","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:37.882 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"12.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:37.890 AM] {"info":{"me":{"totalDamageDealt":"347"}},"feature":"damage"}
[2023-04-17 11:06:38.243 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":17,"players":44,"damage":347,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:38.603 AM] {"info":{"match_info":{"location":{"x":"192","y":"88","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:38.681 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"12.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:38.687 AM] {"info":{"me":{"totalDamageDealt":"359"}},"feature":"damage"}
[2023-04-17 11:06:38.735 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"15.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:38.742 AM] {"info":{"me":{"totalDamageDealt":"374"}},"feature":"damage"}
[2023-04-17 11:06:38.749 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":17,"players":44,"damage":374,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:38.783 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"15.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:38.790 AM] {"info":{"me":{"totalDamageDealt":"389"}},"feature":"damage"}
[2023-04-17 11:06:39.244 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":17,"players":44,"damage":389,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:39.600 AM] {"info":{"match_info":{"location":{"x":"193","y":"88","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:40.105 AM] {"info":{"match_info":{"location":{"x":"194","y":"88","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:40.400 AM] {"info":{"me":{"inventory_0":{"name":"unknown_130","amount":"45"}}},"feature":"inventory"}
[2023-04-17 11:06:40.608 AM] {"info":{"match_info":{"location":{"x":"196","y":"88","z":"-29"}}},"feature":"location"}
[2023-04-17 11:06:40.748 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"GuchiiJD","victimName":"SlimPimbus","weaponName":"r97","action":"knockdown"}}
[2023-04-17 11:06:40.930 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"12.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:40.938 AM] {"info":{"me":{"totalDamageDealt":"401"}},"feature":"damage"}
[2023-04-17 11:06:41.033 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"12.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:41.041 AM] {"info":{"me":{"totalDamageDealt":"413"}},"feature":"damage"}
[2023-04-17 11:06:41.103 AM] {"info":{"match_info":{"location":{"x":"197","y":"88","z":"-30"}}},"feature":"location"}
[2023-04-17 11:06:41.247 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":17,"players":44,"damage":413,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:41.838 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"15.000000","armor":true,"headshot":false}}
[2023-04-17 11:06:41.844 AM] {"info":{"me":{"totalDamageDealt":"428"}},"feature":"damage"}
[2023-04-17 11:06:41.884 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"15.000000","armor":false,"headshot":false}}
[2023-04-17 11:06:41.890 AM] {"info":{"me":{"totalDamageDealt":"443"}},"feature":"damage"}
[2023-04-17 11:06:41.932 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"15.000000","armor":false,"headshot":false}}
[2023-04-17 11:06:41.942 AM] {"info":{"me":{"totalDamageDealt":"458"}},"feature":"damage"}
[2023-04-17 11:06:41.982 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"15.000000","armor":false,"headshot":false}}
[2023-04-17 11:06:41.991 AM] {"info":{"me":{"totalDamageDealt":"473"}},"feature":"damage"}
[2023-04-17 11:06:42.181 AM] {"name":"damage","data":{"targetName":"Zyncere","damageAmount":"21.000000","armor":false,"headshot":true}}
[2023-04-17 11:06:42.191 AM] {"info":{"me":{"totalDamageDealt":"494"}},"feature":"damage"}
[2023-04-17 11:06:42.251 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"teams":17,"players":44,"damage":494,"cash":0}}},"feature":"match_info"}
[2023-04-17 11:06:42.525 AM] {"name":"death","data":null}
[2023-04-17 11:06:42.535 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff | YouTube","state":"death"}}},"feature":"team"}
[2023-04-17 11:06:42.542 AM] {"info":{"match_info":{"roster_27":{"name":"MasterKriff | YouTube","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"1","platform_id":"76561197980819668","origin_id":"1008162215062"}}},"feature":"roster"}
[2023-04-17 11:06:42.549 AM] {"info":{"match_info":{"team_info":{"team_state":"eliminated"}}},"feature":"team"}
[2023-04-17 11:06:42.559 AM] {"info":{"match_info":{"victory":false}},"feature":"rank"}
[2023-04-17 11:06:42.743 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"son deebo","victimName":"MasterKriff | YouTube","weaponName":"volt","action":"kill"}}
[2023-04-17 11:06:50.245 AM] {"info":{"match_info":{"match_summary":{"rank":"17","teams":"21","squadKills":"0"}}},"feature":"match_summary"}
[2023-04-17 11:06:52.747 AM] {"name":"kill_feed","data":{"local_player_name":"[MNK]MasterKriff | YouTube","attackerName":"TNT","victimName":"Skinny Pete","weaponName":"r97","action":"kill"}}
[2023-04-17 11:06:55.323 AM] {"info":{"match_info":{"pseudo_match_id":null}},"feature":"match_info"}
[2023-04-17 11:06:55.329 AM] {"info":{"match_info":{"team_info":{"team_state":null}}},"feature":"team"}
[2023-04-17 11:06:55.361 AM] {"info":{"game_info":{"match_state":"inactive"}},"feature":"match_state"}
[2023-04-17 11:06:55.368 AM] {"name":"match_end","data":null}
[2023-04-17 11:06:55.374 AM] {"info":{"match_info":{"location":{"x":"0","y":"0","z":"0"}}},"feature":"location"}
[2023-04-17 11:06:55.380 AM] {"info":{"match_info":{"roster_0":null}},"feature":"roster"}
[2023-04-17 11:06:55.386 AM] {"info":{"match_info":{"roster_2":null}},"feature":"roster"}
[2023-04-17 11:06:55.392 AM] {"info":{"match_info":{"roster_3":null}},"feature":"roster"}
[2023-04-17 11:06:55.398 AM] {"info":{"match_info":{"roster_4":null}},"feature":"roster"}
[2023-04-17 11:06:55.403 AM] {"info":{"match_info":{"roster_5":null}},"feature":"roster"}
[2023-04-17 11:06:55.409 AM] {"info":{"match_info":{"roster_6":null}},"feature":"roster"}
[2023-04-17 11:06:55.414 AM] {"info":{"match_info":{"roster_7":null}},"feature":"roster"}
[2023-04-17 11:06:55.420 AM] {"info":{"match_info":{"roster_8":null}},"feature":"roster"}
[2023-04-17 11:06:55.425 AM] {"info":{"match_info":{"roster_9":null}},"feature":"roster"}
[2023-04-17 11:06:55.430 AM] {"info":{"match_info":{"roster_10":null}},"feature":"roster"}
[2023-04-17 11:06:55.435 AM] {"info":{"match_info":{"roster_11":null}},"feature":"roster"}
[2023-04-17 11:06:55.440 AM] {"info":{"match_info":{"roster_12":null}},"feature":"roster"}
[2023-04-17 11:06:55.445 AM] {"info":{"match_info":{"roster_13":null}},"feature":"roster"}
[2023-04-17 11:06:55.450 AM] {"info":{"match_info":{"roster_14":null}},"feature":"roster"}
[2023-04-17 11:06:55.456 AM] {"info":{"match_info":{"roster_16":null}},"feature":"roster"}
[2023-04-17 11:06:55.461 AM] {"info":{"match_info":{"roster_17":null}},"feature":"roster"}
[2023-04-17 11:06:55.466 AM] {"info":{"match_info":{"roster_18":null}},"feature":"roster"}
[2023-04-17 11:06:55.472 AM] {"info":{"match_info":{"roster_20":null}},"feature":"roster"}
[2023-04-17 11:06:55.477 AM] {"info":{"match_info":{"roster_23":null}},"feature":"roster"}
[2023-04-17 11:06:55.482 AM] {"info":{"match_info":{"roster_24":null}},"feature":"roster"}
[2023-04-17 11:06:55.487 AM] {"info":{"match_info":{"roster_25":null}},"feature":"roster"}
[2023-04-17 11:06:55.493 AM] {"info":{"match_info":{"roster_26":null}},"feature":"roster"}
[2023-04-17 11:06:55.498 AM] {"info":{"match_info":{"teammate_0":null}},"feature":"team"}
[2023-04-17 11:06:55.503 AM] {"info":{"match_info":{"roster_27":null}},"feature":"roster"}
[2023-04-17 11:06:55.508 AM] {"info":{"match_info":{"roster_28":null}},"feature":"roster"}
[2023-04-17 11:06:55.513 AM] {"info":{"match_info":{"roster_29":null}},"feature":"roster"}
[2023-04-17 11:06:55.519 AM] {"info":{"match_info":{"roster_31":null}},"feature":"roster"}
[2023-04-17 11:06:55.524 AM] {"info":{"match_info":{"roster_36":null}},"feature":"roster"}
[2023-04-17 11:06:55.529 AM] {"info":{"match_info":{"roster_37":null}},"feature":"roster"}
[2023-04-17 11:06:55.534 AM] {"info":{"match_info":{"roster_38":null}},"feature":"roster"}
[2023-04-17 11:06:55.539 AM] {"info":{"match_info":{"roster_39":null}},"feature":"roster"}
[2023-04-17 11:06:55.544 AM] {"info":{"match_info":{"roster_34":null}},"feature":"roster"}
[2023-04-17 11:06:55.550 AM] {"info":{"match_info":{"roster_41":null}},"feature":"roster"}
[2023-04-17 11:06:55.555 AM] {"info":{"match_info":{"roster_40":null}},"feature":"roster"}
[2023-04-17 11:06:55.559 AM] {"info":{"match_info":{"roster_44":null}},"feature":"roster"}
[2023-04-17 11:06:55.566 AM] {"info":{"match_info":{"roster_45":null}},"feature":"roster"}
[2023-04-17 11:06:55.571 AM] {"info":{"match_info":{"roster_46":null}},"feature":"roster"}
[2023-04-17 11:06:55.576 AM] {"info":{"match_info":{"roster_47":null}},"feature":"roster"}
[2023-04-17 11:06:55.585 AM] {"info":{"match_info":{"roster_30":null}},"feature":"roster"}
[2023-04-17 11:06:55.590 AM] {"info":{"match_info":{"roster_49":null}},"feature":"roster"}
[2023-04-17 11:06:55.595 AM] {"info":{"match_info":{"roster_50":null}},"feature":"roster"}
[2023-04-17 11:06:55.600 AM] {"info":{"match_info":{"roster_51":null}},"feature":"roster"}
[2023-04-17 11:06:55.606 AM] {"info":{"match_info":{"roster_53":null}},"feature":"roster"}
[2023-04-17 11:06:55.610 AM] {"info":{"match_info":{"roster_55":null}},"feature":"roster"}
[2023-04-17 11:06:55.616 AM] {"info":{"match_info":{"roster_56":null}},"feature":"roster"}
[2023-04-17 11:06:55.621 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2023-04-17 11:06:55.626 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2023-04-17 11:06:55.631 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2023-04-17 11:06:55.637 AM] {"info":{"me":{"inventory_3":null}},"feature":"inventory"}
[2023-04-17 11:06:55.642 AM] {"info":{"me":{"inventory_4":null}},"feature":"inventory"}
[2023-04-17 11:06:57.333 AM] {"info":{"match_info":{"legendSelect_0":null}},"feature":"team"}
[2023-04-17 11:06:57.341 AM] {"info":{"match_info":{"legendSelect_1":null}},"feature":"team"}
[2023-04-17 11:06:57.347 AM] {"info":{"match_info":{"legendSelect_2":null}},"feature":"team"}
[2023-04-17 11:06:57.352 AM] {"info":{"match_info":{"legendSelect_3":null}},"feature":"team"}
[2023-04-17 11:06:57.357 AM] {"info":{"match_info":{"tabs":null}},"feature":"match_info"}
[2023-04-17 11:06:57.362 AM] {"info":{"match_info":{"map_id":null}},"feature":"match_info"}`;
