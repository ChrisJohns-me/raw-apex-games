import { v4 as uuid } from "uuid";

export const stupidGame1Full = (): string => `
[2021-05-06 04:46:12.526 AM] {"info":{"me":{"name":"MasterKriff"}},"feature":"me"}
[2021-05-06 04:46:12.526 AM] {"info":{"match_info":{"game_mode":"#PL_DUO"}},"feature":"match_info"}
[2021-05-06 04:46:14.949 AM] {"info":{"match_info":{"roster_0":{"name":"SneakyMacledon","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.952 AM] {"info":{"match_info":{"roster_1":{"name":"davidhizar96","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.954 AM] {"info":{"match_info":{"roster_2":{"name":"Keerrn","isTeammate":false,"team_id":12,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.955 AM] {"info":{"match_info":{"roster_3":{"name":"Hopps","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.957 AM] {"info":{"match_info":{"roster_4":{"name":"razzrider17","isTeammate":false,"team_id":15,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.958 AM] {"info":{"match_info":{"roster_5":{"name":"MVPFIGHTER","isTeammate":false,"team_id":19,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.959 AM] {"info":{"match_info":{"roster_6":{"name":"Umbra","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.960 AM] {"info":{"match_info":{"roster_7":{"name":"faytalMonsta","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.961 AM] {"info":{"match_info":{"roster_8":{"name":"Raioou","isTeammate":false,"team_id":26,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.962 AM] {"info":{"match_info":{"roster_9":{"name":"Lil Kujo","isTeammate":false,"team_id":27,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.964 AM] {"info":{"match_info":{"roster_10":{"name":"pachiform","isTeammate":false,"team_id":23,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.965 AM] {"info":{"match_info":{"roster_11":{"name":"Noivern715","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.966 AM] {"info":{"match_info":{"roster_12":{"name":"RoyUnbound","isTeammate":false,"team_id":6,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.966 AM] {"info":{"match_info":{"roster_13":{"name":"brandon","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.967 AM] {"info":{"match_info":{"roster_14":{"name":"Azravir","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.968 AM] {"info":{"match_info":{"roster_15":{"name":"Lily","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.969 AM] {"info":{"match_info":{"roster_16":{"name":"Jeeves","isTeammate":false,"team_id":13,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.970 AM] {"info":{"match_info":{"roster_17":{"name":"Jalloh999","isTeammate":false,"team_id":6,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.971 AM] {"info":{"match_info":{"roster_18":{"name":"Xerphil","isTeammate":false,"team_id":24,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.972 AM] {"info":{"match_info":{"roster_19":{"name":"trent_the_ging","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.973 AM] {"info":{"match_info":{"roster_20":{"name":"Centurion2701","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.975 AM] {"info":{"match_info":{"roster_21":{"name":"mamacita","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.976 AM] {"info":{"match_info":{"roster_22":{"name":"iTooToxic","isTeammate":false,"team_id":29,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.977 AM] {"info":{"match_info":{"roster_23":{"name":"mooblu","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.978 AM] {"info":{"match_info":{"roster_24":{"name":"Pashoelpacman","isTeammate":false,"team_id":26,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.979 AM] {"info":{"match_info":{"roster_25":{"name":"Xisorapex","isTeammate":false,"team_id":30,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.981 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"alive"}}},"feature":"team"}
[2021-05-06 04:46:14.983 AM] {"info":{"match_info":{"roster_26":{"name":"MasterKriff","isTeammate":true,"team_id":28,"platform_hw":2,"platform_sw":7,"state":"alive"}}},"feature":"roster"}
[2021-05-06 04:46:14.985 AM] {"info":{"match_info":{"roster_27":{"name":"trexmochi","isTeammate":false,"team_id":23,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.988 AM] {"info":{"match_info":{"roster_28":{"name":"PharaohGod","isTeammate":false,"team_id":13,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.994 AM] {"info":{"match_info":{"roster_29":{"name":"THEJ0RY","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:14.996 AM] {"info":{"match_info":{"roster_30":{"name":"Merp","isTeammate":false,"team_id":25,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:14.998 AM] {"info":{"match_info":{"roster_31":{"name":"Firmersix","isTeammate":false,"team_id":21,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.001 AM] {"info":{"match_info":{"roster_32":{"name":"Frosty5ly","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.006 AM] {"info":{"match_info":{"roster_33":{"name":"night","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.012 AM] {"info":{"match_info":{"roster_34":{"name":"dsparkey","isTeammate":false,"team_id":15,"platform_hw":0,"platform_sw":0}}},"feature":"roster"}
[2021-05-06 04:46:15.015 AM] {"info":{"match_info":{"roster_35":{"name":"Lady Roketsu","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.017 AM] {"info":{"match_info":{"roster_36":{"name":"kxngava","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:15.018 AM] {"info":{"match_info":{"roster_37":{"name":"seanomite","isTeammate":false,"team_id":9,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.020 AM] {"info":{"match_info":{"roster_38":{"name":"ChillinCookie","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.021 AM] {"info":{"match_info":{"roster_39":{"name":"dMccDanielb","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:15.022 AM] {"info":{"match_info":{"roster_40":{"name":"ImperfectJustice","isTeammate":false,"team_id":24,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.024 AM] {"info":{"match_info":{"roster_41":{"name":"johanSL","isTeammate":false,"team_id":21,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.025 AM] {"info":{"match_info":{"roster_42":{"name":"shiggyqwq","isTeammate":false,"team_id":9,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:15.027 AM] {"info":{"match_info":{"roster_43":{"name":"TubaCat2017","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":2}}},"feature":"roster"}
[2021-05-06 04:46:15.029 AM] {"info":{"match_info":{"roster_44":{"name":"Pakavka_","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.030 AM] {"info":{"match_info":{"roster_45":{"name":"Akula-RED","isTeammate":false,"team_id":22,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.031 AM] {"info":{"match_info":{"roster_46":{"name":"SIN_Ukumpchee","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:15.147 AM] {"info":{"match_info":{"roster_47":{"name":"Firedupdude1","isTeammate":false,"team_id":8,"platform_hw":1,"platform_sw":1}}},"feature":"roster"}
[2021-05-06 04:46:15.150 AM] {"info":{"match_info":{"roster_49":{"name":"Nikki","isTeammate":false,"team_id":7,"platform_hw":9,"platform_sw":9}}},"feature":"roster"}
[2021-05-06 04:46:15.152 AM] {"info":{"match_info":{"roster_48":{"name":"SweetTeaSlurper","isTeammate":false,"team_id":12,"platform_hw":0,"platform_sw":0}}},"feature":"roster"}
[2021-05-06 04:46:15.292 AM] {"info":{"match_info":{"roster_50":{"name":"Mast3rChi3f7620","isTeammate":false,"team_id":19,"platform_hw":0,"platform_sw":0}}},"feature":"roster"}
[2021-05-06 04:46:15.429 AM] {"info":{"match_info":{"roster_51":{"name":"FxdeGT","isTeammate":false,"team_id":22,"platform_hw":1,"platform_sw":1}}},"feature":"roster"}
[2021-05-06 04:46:15.482 AM] {"info":{"match_info":{"roster_52":{"name":"Brother_Infamous","isTeammate":false,"team_id":17,"platform_hw":1,"platform_sw":1}}},"feature":"roster"}
[2021-05-06 04:46:17.123 AM] {"info":{"match_info":{"roster_53":{"name":"Codescratch","isTeammate":false,"team_id":31,"platform_hw":2,"platform_sw":7}}},"feature":"roster"}
[2021-05-06 04:46:18.245 AM] {"info":{"match_info":{"roster_54":{"name":"Amovyann","isTeammate":false,"team_id":25,"platform_hw":1,"platform_sw":1}}},"feature":"roster"}
[2021-05-06 04:46:18.973 AM] {"info":{"match_info":{"roster_55":{"name":"gangsterboy2856","isTeammate":false,"team_id":27,"platform_hw":0,"platform_sw":0}}},"feature":"roster"}
[2021-05-06 04:46:41.475 AM] {"info":{"match_info":{"legendSelect_0":{"playerName":"MasterKriff","legendName":"#character_valkyrie_NAME","selectionOrder":"0","lead":true}}},"feature":"team"}
[2021-05-06 04:47:13.843 AM] {"info":{"match_info":{"pseudo_match_id":"${uuid()}"}},"feature":"match_info"}
[2021-05-06 04:47:13.880 AM] {"info":{"game_info":{"match_state":"active"}},"feature":"match_state"}
[2021-05-06 04:47:13.883 AM] {"info":{"me":{"totalDamageDealt":"0"}},"feature":"damage"}
[2021-05-06 04:47:13.886 AM] {"name":"match_start","data":null}
[2021-05-06 04:47:13.887 AM] {"info":{"match_info":{"team_info":{"team_state":"active"}}},"feature":"team"}
[2021-05-06 04:47:13.923 AM] {"info":{"match_info":{"location":{"x":"-352","y":"-422","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:13.926 AM] {"info":{"match_info":{"victory":null}},"feature":"rank"}
[2021-05-06 04:47:13.928 AM] {"info":{"me":{"inventory_0":{"name":"141","amount":"0"}}},"feature":"inventory"}
[2021-05-06 04:47:13.932 AM] {"info":{"me":{"inventory_1":{"name":"139","amount":"0"}}},"feature":"inventory"}
[2021-05-06 04:47:13.942 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":30,"players":56,"damage":0,"cash":0}}},"feature":"match_info"}
[2021-05-06 04:47:14.300 AM] {"info":{"match_info":{"location":{"x":"-348","y":"-412","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:14.823 AM] {"info":{"match_info":{"location":{"x":"-344","y":"-403","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:15.327 AM] {"info":{"match_info":{"location":{"x":"-340","y":"-393","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:15.838 AM] {"info":{"match_info":{"location":{"x":"-337","y":"-384","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:16.329 AM] {"info":{"match_info":{"location":{"x":"-333","y":"-374","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:16.829 AM] {"info":{"match_info":{"location":{"x":"-330","y":"-365","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:17.321 AM] {"info":{"match_info":{"location":{"x":"-326","y":"-356","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:17.823 AM] {"info":{"match_info":{"location":{"x":"-322","y":"-347","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:18.324 AM] {"info":{"match_info":{"location":{"x":"-319","y":"-337","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:18.815 AM] {"info":{"match_info":{"location":{"x":"-315","y":"-328","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:19.322 AM] {"info":{"match_info":{"location":{"x":"-312","y":"-318","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:19.818 AM] {"info":{"match_info":{"location":{"x":"-308","y":"-309","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:20.323 AM] {"info":{"match_info":{"location":{"x":"-304","y":"-300","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:20.829 AM] {"info":{"match_info":{"location":{"x":"-301","y":"-290","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:21.330 AM] {"info":{"match_info":{"location":{"x":"-297","y":"-281","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:21.829 AM] {"info":{"match_info":{"location":{"x":"-293","y":"-272","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:22.329 AM] {"info":{"match_info":{"location":{"x":"-290","y":"-262","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:22.446 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"5"}}},"feature":"me"}
[2021-05-06 04:47:22.817 AM] {"info":{"match_info":{"location":{"x":"-286","y":"-253","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:23.321 AM] {"info":{"match_info":{"location":{"x":"-283","y":"-244","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:23.820 AM] {"info":{"match_info":{"location":{"x":"-279","y":"-235","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:24.324 AM] {"info":{"match_info":{"location":{"x":"-275","y":"-225","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:24.825 AM] {"info":{"match_info":{"location":{"x":"-272","y":"-216","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:25.324 AM] {"info":{"match_info":{"location":{"x":"-268","y":"-207","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:25.828 AM] {"info":{"match_info":{"location":{"x":"-265","y":"-197","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:26.319 AM] {"info":{"match_info":{"location":{"x":"-261","y":"-188","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:26.835 AM] {"info":{"match_info":{"location":{"x":"-257","y":"-179","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:27.324 AM] {"info":{"match_info":{"location":{"x":"-254","y":"-169","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:27.824 AM] {"info":{"match_info":{"location":{"x":"-250","y":"-160","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:28.321 AM] {"info":{"match_info":{"location":{"x":"-247","y":"-151","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:28.822 AM] {"info":{"match_info":{"location":{"x":"-243","y":"-141","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:29.315 AM] {"info":{"match_info":{"location":{"x":"-239","y":"-132","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:29.824 AM] {"info":{"match_info":{"location":{"x":"-236","y":"-123","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:30.316 AM] {"info":{"match_info":{"location":{"x":"-232","y":"-113","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:30.819 AM] {"info":{"match_info":{"location":{"x":"-229","y":"-104","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:31.323 AM] {"info":{"match_info":{"location":{"x":"-225","y":"-95","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:31.445 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"10"}}},"feature":"me"}
[2021-05-06 04:47:31.824 AM] {"info":{"match_info":{"location":{"x":"-221","y":"-85","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:32.325 AM] {"info":{"match_info":{"location":{"x":"-218","y":"-76","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:32.823 AM] {"info":{"match_info":{"location":{"x":"-214","y":"-67","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:33.330 AM] {"info":{"match_info":{"location":{"x":"-210","y":"-57","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:33.818 AM] {"info":{"match_info":{"location":{"x":"-207","y":"-48","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:34.323 AM] {"info":{"match_info":{"location":{"x":"-203","y":"-39","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:34.821 AM] {"info":{"match_info":{"location":{"x":"-200","y":"-29","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:35.327 AM] {"info":{"match_info":{"location":{"x":"-196","y":"-20","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:35.820 AM] {"info":{"match_info":{"location":{"x":"-192","y":"-11","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:36.318 AM] {"info":{"match_info":{"location":{"x":"-189","y":"-1","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:36.821 AM] {"info":{"match_info":{"location":{"x":"-185","y":"7","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:37.329 AM] {"info":{"match_info":{"location":{"x":"-182","y":"16","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:37.819 AM] {"info":{"match_info":{"location":{"x":"-178","y":"26","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:38.320 AM] {"info":{"match_info":{"location":{"x":"-174","y":"35","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:38.824 AM] {"info":{"match_info":{"location":{"x":"-171","y":"44","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:39.327 AM] {"info":{"match_info":{"location":{"x":"-167","y":"53","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:39.828 AM] {"info":{"match_info":{"location":{"x":"-164","y":"63","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:40.341 AM] {"info":{"match_info":{"location":{"x":"-160","y":"72","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:40.434 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"15"}}},"feature":"me"}
[2021-05-06 04:47:40.822 AM] {"info":{"match_info":{"location":{"x":"-156","y":"82","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:41.325 AM] {"info":{"match_info":{"location":{"x":"-153","y":"91","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:41.819 AM] {"info":{"match_info":{"location":{"x":"-149","y":"100","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:42.330 AM] {"info":{"match_info":{"location":{"x":"-145","y":"110","z":"119"}}},"feature":"location"}
[2021-05-06 04:47:42.660 AM] {"info":{"me":{"inventory_0":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:47:42.663 AM] {"info":{"me":{"inventory_1":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:47:42.820 AM] {"info":{"match_info":{"location":{"x":"-142","y":"119","z":"117"}}},"feature":"location"}
[2021-05-06 04:47:43.319 AM] {"info":{"match_info":{"location":{"x":"-142","y":"124","z":"113"}}},"feature":"location"}
[2021-05-06 04:47:43.822 AM] {"info":{"match_info":{"location":{"x":"-144","y":"128","z":"109"}}},"feature":"location"}
[2021-05-06 04:47:44.325 AM] {"info":{"match_info":{"location":{"x":"-146","y":"131","z":"104"}}},"feature":"location"}
[2021-05-06 04:47:44.823 AM] {"info":{"match_info":{"location":{"x":"-149","y":"135","z":"100"}}},"feature":"location"}
[2021-05-06 04:47:45.329 AM] {"info":{"match_info":{"location":{"x":"-152","y":"138","z":"95"}}},"feature":"location"}
[2021-05-06 04:47:45.825 AM] {"info":{"match_info":{"location":{"x":"-155","y":"142","z":"91"}}},"feature":"location"}
[2021-05-06 04:47:46.326 AM] {"info":{"match_info":{"location":{"x":"-158","y":"146","z":"86"}}},"feature":"location"}
[2021-05-06 04:47:46.821 AM] {"info":{"match_info":{"location":{"x":"-161","y":"149","z":"82"}}},"feature":"location"}
[2021-05-06 04:47:47.324 AM] {"info":{"match_info":{"location":{"x":"-165","y":"153","z":"78"}}},"feature":"location"}
[2021-05-06 04:47:47.827 AM] {"info":{"match_info":{"location":{"x":"-168","y":"157","z":"73"}}},"feature":"location"}
[2021-05-06 04:47:48.323 AM] {"info":{"match_info":{"location":{"x":"-171","y":"160","z":"69"}}},"feature":"location"}
[2021-05-06 04:47:48.818 AM] {"info":{"match_info":{"location":{"x":"-174","y":"164","z":"65"}}},"feature":"location"}
[2021-05-06 04:47:49.327 AM] {"info":{"match_info":{"location":{"x":"-178","y":"167","z":"60"}}},"feature":"location"}
[2021-05-06 04:47:49.441 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"20"}}},"feature":"me"}
[2021-05-06 04:47:49.820 AM] {"info":{"match_info":{"location":{"x":"-181","y":"171","z":"56"}}},"feature":"location"}
[2021-05-06 04:47:50.324 AM] {"info":{"match_info":{"location":{"x":"-184","y":"175","z":"52"}}},"feature":"location"}
[2021-05-06 04:47:50.816 AM] {"info":{"match_info":{"location":{"x":"-187","y":"178","z":"47"}}},"feature":"location"}
[2021-05-06 04:47:51.323 AM] {"info":{"match_info":{"location":{"x":"-190","y":"181","z":"42"}}},"feature":"location"}
[2021-05-06 04:47:51.817 AM] {"info":{"match_info":{"location":{"x":"-193","y":"184","z":"37"}}},"feature":"location"}
[2021-05-06 04:47:52.324 AM] {"info":{"match_info":{"location":{"x":"-196","y":"187","z":"32"}}},"feature":"location"}
[2021-05-06 04:47:52.829 AM] {"info":{"match_info":{"location":{"x":"-200","y":"190","z":"27"}}},"feature":"location"}
[2021-05-06 04:47:53.329 AM] {"info":{"match_info":{"location":{"x":"-203","y":"193","z":"22"}}},"feature":"location"}
[2021-05-06 04:47:53.820 AM] {"info":{"match_info":{"location":{"x":"-206","y":"196","z":"18"}}},"feature":"location"}
[2021-05-06 04:47:54.322 AM] {"info":{"match_info":{"location":{"x":"-209","y":"199","z":"13"}}},"feature":"location"}
[2021-05-06 04:47:54.823 AM] {"info":{"match_info":{"location":{"x":"-213","y":"202","z":"8"}}},"feature":"location"}
[2021-05-06 04:47:55.322 AM] {"info":{"match_info":{"location":{"x":"-216","y":"205","z":"3"}}},"feature":"location"}
[2021-05-06 04:47:55.824 AM] {"info":{"match_info":{"location":{"x":"-219","y":"208","z":"-1"}}},"feature":"location"}
[2021-05-06 04:47:56.343 AM] {"info":{"match_info":{"location":{"x":"-222","y":"211","z":"-6"}}},"feature":"location"}
[2021-05-06 04:47:56.820 AM] {"info":{"match_info":{"location":{"x":"-225","y":"214","z":"-11"}}},"feature":"location"}
[2021-05-06 04:47:57.326 AM] {"info":{"match_info":{"location":{"x":"-229","y":"217","z":"-16"}}},"feature":"location"}
[2021-05-06 04:47:57.820 AM] {"info":{"match_info":{"location":{"x":"-232","y":"220","z":"-20"}}},"feature":"location"}
[2021-05-06 04:47:58.327 AM] {"info":{"match_info":{"location":{"x":"-235","y":"223","z":"-25"}}},"feature":"location"}
[2021-05-06 04:47:58.436 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"25"}}},"feature":"me"}
[2021-05-06 04:47:58.444 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"Octane4904","victimName":"[LRZ] Pashoelpacman","weaponName":"wingman","action":"knockdown"}}
[2021-05-06 04:47:58.819 AM] {"info":{"match_info":{"location":{"x":"-238","y":"226","z":"-30"}}},"feature":"location"}
[2021-05-06 04:47:59.323 AM] {"info":{"match_info":{"location":{"x":"-242","y":"229","z":"-35"}}},"feature":"location"}
[2021-05-06 04:47:59.824 AM] {"info":{"match_info":{"location":{"x":"-245","y":"232","z":"-40"}}},"feature":"location"}
[2021-05-06 04:48:00.323 AM] {"info":{"match_info":{"location":{"x":"-248","y":"235","z":"-44"}}},"feature":"location"}
[2021-05-06 04:48:00.824 AM] {"info":{"match_info":{"location":{"x":"-251","y":"238","z":"-48"}}},"feature":"location"}
[2021-05-06 04:48:01.320 AM] {"info":{"match_info":{"location":{"x":"-254","y":"241","z":"-51"}}},"feature":"location"}
[2021-05-06 04:48:01.438 AM] {"name":"kill_feed","data":{"attackerName":"Octane4904","victimName":"[LRZ] Pashoelpacman","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-05-06 04:48:01.443 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[NAVI] SIN_Ukumpchee","victimName":"[LRZ] Raioou","weaponName":"flatline","action":"kill"}}
[2021-05-06 04:48:01.449 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":29,"players":54,"damage":0,"cash":0}}},"feature":"match_info"}
[2021-05-06 04:48:01.821 AM] {"info":{"match_info":{"location":{"x":"-256","y":"243","z":"-54"}}},"feature":"location"}
[2021-05-06 04:48:02.319 AM] {"info":{"match_info":{"location":{"x":"-259","y":"243","z":"-58"}}},"feature":"location"}
[2021-05-06 04:48:02.826 AM] {"info":{"match_info":{"location":{"x":"-261","y":"241","z":"-61"}}},"feature":"location"}
[2021-05-06 04:48:02.935 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2021-05-06 04:48:02.941 AM] {"name":"kill_feed","data":{"attackerName":"[ZOO] RoyUnbound","victimName":"[BTM] Jeeves","weaponName":"Melee","action":"Melee"}}
[2021-05-06 04:48:03.324 AM] {"info":{"match_info":{"location":{"x":"-262","y":"241","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:04.112 AM] {"info":{"me":{"inUse":{"inUse":"Melee"}}},"feature":"inventory"}
[2021-05-06 04:48:04.328 AM] {"info":{"match_info":{"location":{"x":"-261","y":"241","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:04.823 AM] {"info":{"match_info":{"location":{"x":"-260","y":"240","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:04.942 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":29,"players":54,"damage":0,"cash":5}}},"feature":"match_info"}
[2021-05-06 04:48:05.333 AM] {"info":{"match_info":{"location":{"x":"-259","y":"240","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:05.359 AM] {"info":{"me":{"inventory_0":{"name":"130","amount":"20"}}},"feature":"inventory"}
[2021-05-06 04:48:05.365 AM] {"info":{"me":{"inventory_1":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:05.371 AM] {"info":{"me":{"inventory_2":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:05.609 AM] {"info":{"me":{"weapons":{"weapon0":"R-301 Carbine"}}},"feature":"inventory"}
[2021-05-06 04:48:05.869 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2021-05-06 04:48:06.322 AM] {"info":{"match_info":{"location":{"x":"-259","y":"241","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:06.463 AM] {"info":{"me":{"inventory_2":{"name":"139","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:48:06.816 AM] {"info":{"match_info":{"location":{"x":"-258","y":"240","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:06.962 AM] {"info":{"me":{"inUse":{"inUse":"Melee"}}},"feature":"inventory"}
[2021-05-06 04:48:07.572 AM] {"info":{"match_info":{"roster_24":null}},"feature":"roster"}
[2021-05-06 04:48:07.820 AM] {"info":{"match_info":{"location":{"x":"-259","y":"239","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:08.321 AM] {"info":{"match_info":{"location":{"x":"-260","y":"239","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:08.439 AM] {"name":"kill_feed","data":{"attackerName":"[ZOO] RoyUnbound","victimName":"[BTM] Jeeves","weaponName":"Melee","action":"Melee"}}
[2021-05-06 04:48:08.449 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":29,"players":53,"damage":0,"cash":5}}},"feature":"match_info"}
[2021-05-06 04:48:08.782 AM] {"info":{"me":{"inventory_0":{"name":"130","amount":"40"}}},"feature":"inventory"}
[2021-05-06 04:48:08.820 AM] {"info":{"match_info":{"location":{"x":"-260","y":"240","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:09.324 AM] {"info":{"match_info":{"location":{"x":"-259","y":"239","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:09.440 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[GMRZ] night","victimName":"[NAVI] SIN_Ukumpchee","weaponName":"r45","action":"knockdown"}}
[2021-05-06 04:48:09.817 AM] {"info":{"match_info":{"location":{"x":"-259","y":"238","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:10.320 AM] {"info":{"match_info":{"location":{"x":"-258","y":"237","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:10.360 AM] {"info":{"me":{"inventory_1":{"name":"130","amount":"40"}}},"feature":"inventory"}
[2021-05-06 04:48:10.369 AM] {"info":{"me":{"inventory_0":{"name":"133","amount":"20"}}},"feature":"inventory"}
[2021-05-06 04:48:10.375 AM] {"info":{"me":{"inventory_3":{"name":"139","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:48:10.383 AM] {"info":{"me":{"inventory_2":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:10.823 AM] {"info":{"match_info":{"location":{"x":"-259","y":"236","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:10.954 AM] {"info":{"me":{"inventory_1":{"name":"131","amount":"20"}}},"feature":"inventory"}
[2021-05-06 04:48:10.960 AM] {"info":{"me":{"inventory_2":{"name":"130","amount":"40"}}},"feature":"inventory"}
[2021-05-06 04:48:10.964 AM] {"info":{"me":{"inventory_3":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:10.970 AM] {"info":{"me":{"inventory_4":{"name":"139","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:48:11.177 AM] {"info":{"me":{"weapons":{"weapon0":"R-301 Carbine","weapon1":"HAVOC"}}},"feature":"inventory"}
[2021-05-06 04:48:11.375 AM] {"info":{"me":{"inventory_1":{"name":"131","amount":"40"}}},"feature":"inventory"}
[2021-05-06 04:48:11.411 AM] {"info":{"me":{"inUse":{"inUse":"HAVOC"}}},"feature":"inventory"}
[2021-05-06 04:48:11.825 AM] {"info":{"match_info":{"location":{"x":"-258","y":"236","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:11.975 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"5"}}},"feature":"me"}
[2021-05-06 04:48:12.014 AM] {"info":{"me":{"inUse":{"inUse":"Melee"}}},"feature":"inventory"}
[2021-05-06 04:48:12.321 AM] {"info":{"match_info":{"location":{"x":"-257","y":"236","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:12.819 AM] {"info":{"match_info":{"location":{"x":"-256","y":"236","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:13.323 AM] {"info":{"match_info":{"location":{"x":"-254","y":"235","z":"-64"}}},"feature":"location"}
[2021-05-06 04:48:13.817 AM] {"info":{"match_info":{"location":{"x":"-253","y":"235","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:14.073 AM] {"info":{"me":{"weapons":{"weapon0":"R-301 Carbine","weapon1":"M600 Spitfire"}}},"feature":"inventory"}
[2021-05-06 04:48:14.336 AM] {"info":{"me":{"inUse":{"inUse":"M600 Spitfire"}}},"feature":"inventory"}
[2021-05-06 04:48:14.820 AM] {"info":{"match_info":{"location":{"x":"-252","y":"235","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:14.938 AM] {"name":"kill_feed","data":{"attackerName":" dMccDanielb","victimName":"[Sus] Xisorapex","weaponName":"Melee","action":"Melee"}}
[2021-05-06 04:48:14.950 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":28,"players":52,"damage":0,"cash":5}}},"feature":"match_info"}
[2021-05-06 04:48:14.966 AM] {"info":{"me":{"inventory_2":{"name":"130","amount":"60"}}},"feature":"inventory"}
[2021-05-06 04:48:15.256 AM] {"info":{"me":{"inventory_3":{"name":"130","amount":"20"}}},"feature":"inventory"}
[2021-05-06 04:48:15.263 AM] {"info":{"me":{"inventory_4":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:15.270 AM] {"info":{"me":{"inventory_5":{"name":"139","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:48:15.434 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[GMRZ] night","victimName":"[NAVI] SIN_Ukumpchee","weaponName":"r45","action":"headshot_kill"}}
[2021-05-06 04:48:15.443 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":28,"players":51,"damage":0,"cash":5}}},"feature":"match_info"}
[2021-05-06 04:48:15.937 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BTM] PharaohGod","victimName":"[CGC] Jalloh999","weaponName":"volt","action":"knockdown"}}
[2021-05-06 04:48:16.321 AM] {"info":{"match_info":{"location":{"x":"-253","y":"235","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:16.372 AM] {"info":{"me":{"inventory_0":{"name":"133","amount":"40"}}},"feature":"inventory"}
[2021-05-06 04:48:16.820 AM] {"info":{"match_info":{"location":{"x":"-253","y":"234","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:16.831 AM] {"info":{"me":{"inUse":{"inUse":"Melee"}}},"feature":"inventory"}
[2021-05-06 04:48:17.281 AM] {"info":{"match_info":{"roster_8":null}},"feature":"roster"}
[2021-05-06 04:48:17.318 AM] {"info":{"match_info":{"location":{"x":"-254","y":"233","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:17.853 AM] {"info":{"match_info":{"location":{"x":"-254","y":"232","z":"-64"}}},"feature":"location"}
[2021-05-06 04:48:18.029 AM] {"info":{"match_info":{"roster_25":null}},"feature":"roster"}
[2021-05-06 04:48:18.361 AM] {"info":{"match_info":{"location":{"x":"-254","y":"231","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:18.443 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":28,"players":51,"damage":0,"cash":10}}},"feature":"match_info"}
[2021-05-06 04:48:20.405 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"10"}}},"feature":"me"}
[2021-05-06 04:48:20.425 AM] {"info":{"match_info":{"location":{"x":"-253","y":"232","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:20.432 AM] {"name":"kill_feed","data":{"attackerName":"[LIKE] brandon","victimName":"[ZDC] Merp","weaponName":"Melee","action":"Melee"}}
[2021-05-06 04:48:21.455 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[ZOO] RoyUnbound","victimName":"[BTM] PharaohGod","weaponName":"p2020","action":"kill"}}
[2021-05-06 04:48:21.462 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":27,"players":50,"damage":0,"cash":10}}},"feature":"match_info"}
[2021-05-06 04:48:22.478 AM] {"info":{"match_info":{"location":{"x":"-253","y":"231","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:24.791 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[GMRZ] night","victimName":"Octane4904","weaponName":"charge_rifle","action":"kill"}}
[2021-05-06 04:48:24.797 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":26,"players":49,"damage":0,"cash":10}}},"feature":"match_info"}
[2021-05-06 04:48:24.841 AM] {"info":{"me":{"inventory_6":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:27.403 AM] {"info":{"match_info":{"roster_46":null}},"feature":"roster"}
[2021-05-06 04:48:28.582 AM] {"info":{"match_info":{"roster_16":null}},"feature":"roster"}
[2021-05-06 04:48:28.589 AM] {"info":{"match_info":{"roster_44":null}},"feature":"roster"}
[2021-05-06 04:48:29.519 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"15"}}},"feature":"me"}
[2021-05-06 04:48:29.531 AM] {"name":"kill_feed","data":{"attackerName":"[LIKE] brandon","victimName":"[ZDC] Merp","weaponName":"Finisher","action":"Finisher"}}
[2021-05-06 04:48:29.542 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":26,"players":48,"damage":0,"cash":10}}},"feature":"match_info"}
[2021-05-06 04:48:30.029 AM] {"info":{"match_info":{"location":{"x":"-254","y":"232","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:31.035 AM] {"info":{"match_info":{"location":{"x":"-255","y":"233","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:31.517 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" dMccDanielb","victimName":"[RUN] trent_the_ging","weaponName":"r45","action":"knockdown"}}
[2021-05-06 04:48:31.536 AM] {"info":{"match_info":{"location":{"x":"-256","y":"234","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:32.025 AM] {"info":{"match_info":{"location":{"x":"-257","y":"234","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:32.523 AM] {"info":{"match_info":{"location":{"x":"-256","y":"234","z":"-64"}}},"feature":"location"}
[2021-05-06 04:48:33.010 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[THL] kxngava","victimName":" dMccDanielb","weaponName":"rui/ordnance_icons/grenade_arc","action":"knockdown"}}
[2021-05-06 04:48:33.027 AM] {"info":{"match_info":{"location":{"x":"-255","y":"233","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:33.528 AM] {"info":{"match_info":{"location":{"x":"-254","y":"233","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:34.021 AM] {"info":{"match_info":{"location":{"x":"-254","y":"232","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:34.516 AM] {"name":"kill_feed","data":{"attackerName":"[THL] kxngava","victimName":" dMccDanielb","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-05-06 04:48:34.523 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[THL] kxngava","victimName":" TubaCat2017","weaponName":"alternator","action":"kill"}}
[2021-05-06 04:48:34.529 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":25,"players":46,"damage":0,"cash":10}}},"feature":"match_info"}
[2021-05-06 04:48:34.550 AM] {"info":{"match_info":{"location":{"x":"-253","y":"231","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:34.586 AM] {"info":{"me":{"inventory_7":{"name":"164","amount":"1"}}},"feature":"inventory"}
[2021-05-06 04:48:35.022 AM] {"info":{"match_info":{"location":{"x":"-254","y":"231","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:35.526 AM] {"info":{"match_info":{"location":{"x":"-255","y":"230","z":"-64"}}},"feature":"location"}
[2021-05-06 04:48:36.022 AM] {"info":{"match_info":{"location":{"x":"-256","y":"230","z":"-63"}}},"feature":"location"}
[2021-05-06 04:48:36.524 AM] {"info":{"match_info":{"location":{"x":"-257","y":"229","z":"-63"}}},"feature":"location"}
[2021-05-06 04:48:37.025 AM] {"info":{"match_info":{"location":{"x":"-258","y":"228","z":"-63"}}},"feature":"location"}
[2021-05-06 04:48:37.528 AM] {"info":{"match_info":{"location":{"x":"-260","y":"227","z":"-63"}}},"feature":"location"}
[2021-05-06 04:48:38.024 AM] {"info":{"match_info":{"location":{"x":"-261","y":"227","z":"-63"}}},"feature":"location"}
[2021-05-06 04:48:38.272 AM] {"info":{"match_info":{"roster_43":null}},"feature":"roster"}
[2021-05-06 04:48:38.512 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"20"}}},"feature":"me"}
[2021-05-06 04:48:38.531 AM] {"info":{"match_info":{"location":{"x":"-262","y":"225","z":"-64"}}},"feature":"location"}
[2021-05-06 04:48:39.027 AM] {"info":{"match_info":{"location":{"x":"-262","y":"224","z":"-65"}}},"feature":"location"}
[2021-05-06 04:48:39.035 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":25,"players":46,"damage":0,"cash":15}}},"feature":"match_info"}
[2021-05-06 04:48:39.962 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2021-05-06 04:48:40.105 AM] {"info":{"me":{"inventory_4":{"name":"141","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:48:40.384 AM] {"info":{"me":{"inventory_5":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:40.391 AM] {"info":{"me":{"inventory_6":{"name":"139","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:48:40.398 AM] {"info":{"me":{"inventory_7":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:40.405 AM] {"info":{"me":{"inventory_8":{"name":"164","amount":"1"}}},"feature":"inventory"}
[2021-05-06 04:48:40.980 AM] {"info":{"me":{"inventory_0":{"name":"133","amount":"60"}}},"feature":"inventory"}
[2021-05-06 04:48:40.988 AM] {"info":{"me":{"inventory_1":{"name":"133","amount":"20"}}},"feature":"inventory"}
[2021-05-06 04:48:40.995 AM] {"info":{"me":{"inventory_2":{"name":"131","amount":"40"}}},"feature":"inventory"}
[2021-05-06 04:48:41.002 AM] {"info":{"me":{"inventory_3":{"name":"130","amount":"60"}}},"feature":"inventory"}
[2021-05-06 04:48:41.008 AM] {"info":{"me":{"inventory_4":{"name":"130","amount":"20"}}},"feature":"inventory"}
[2021-05-06 04:48:41.014 AM] {"info":{"me":{"inventory_5":{"name":"141","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:48:41.021 AM] {"info":{"me":{"inventory_6":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:41.028 AM] {"info":{"me":{"inventory_7":{"name":"139","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:48:41.039 AM] {"info":{"me":{"inventory_8":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:48:41.046 AM] {"info":{"me":{"inventory_9":{"name":"164","amount":"1"}}},"feature":"inventory"}
[2021-05-06 04:48:42.804 AM] {"info":{"match_info":{"roster_28":null}},"feature":"roster"}
[2021-05-06 04:48:43.085 AM] {"info":{"match_info":{"roster_39":null}},"feature":"roster"}
[2021-05-06 04:48:46.738 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[FAST] Codescratch","victimName":"[Dumb] Lady Roketsu","weaponName":"peacekeeper","action":"knockdown"}}
[2021-05-06 04:48:47.238 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"25"}}},"feature":"me"}
[2021-05-06 04:48:55.902 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"30"}}},"feature":"me"}
[2021-05-06 04:48:58.448 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Umbra","victimName":" mamacita","weaponName":"wingman","action":"knockdown"}}
[2021-05-06 04:49:00.532 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"Bangalore7224","victimName":"[THL] kxngava","weaponName":"wingman","action":"knockdown"}}
[2021-05-06 04:49:05.763 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"35"}}},"feature":"me"}
[2021-05-06 04:49:08.873 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Azravir","victimName":" Centurion2701","weaponName":"eva8","action":"kill"}}
[2021-05-06 04:49:08.879 AM] {"name":"kill_feed","data":{"attackerName":" Umbra","victimName":" mamacita","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-05-06 04:49:08.885 AM] {"name":"kill_feed","data":{"attackerName":"[LIKE] brandon","victimName":" Amovyann","weaponName":"Missile Swarm","action":"Missile Swarm"}}
[2021-05-06 04:49:08.890 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":23,"players":43,"damage":0,"cash":15}}},"feature":"match_info"}
[2021-05-06 04:49:10.727 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[RUN] trent_the_ging","victimName":"Bangalore7224","weaponName":"r45","action":"kill"}}
[2021-05-06 04:49:10.738 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":22,"players":42,"damage":0,"cash":15}}},"feature":"match_info"}
[2021-05-06 04:49:13.128 AM] {"info":{"match_info":{"roster_22":null}},"feature":"roster"}
[2021-05-06 04:49:13.299 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"40"}}},"feature":"me"}
[2021-05-06 04:49:13.355 AM] {"info":{"match_info":{"roster_21":null}},"feature":"roster"}
[2021-05-06 04:49:17.790 AM] {"info":{"match_info":{"roster_54":null}},"feature":"roster"}
[2021-05-06 04:49:17.894 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" davidhizar96","victimName":"[girl] seanomite","weaponName":"spitfire","action":"knockdown"}}
[2021-05-06 04:49:21.453 AM] {"info":{"match_info":{"roster_20":null}},"feature":"roster"}
[2021-05-06 04:49:23.024 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"45"}}},"feature":"me"}
[2021-05-06 04:49:23.425 AM] {"info":{"match_info":{"roster_30":null}},"feature":"roster"}
[2021-05-06 04:49:30.657 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"50"}}},"feature":"me"}
[2021-05-06 04:49:37.229 AM] {"name":"kill_feed","data":{"attackerName":"[FAST] Codescratch","victimName":"[Dumb] Lady Roketsu","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-05-06 04:49:37.231 AM] {"name":"kill_feed","data":{"attackerName":"[FAST] Codescratch","victimName":"[Dumb] Noivern715","weaponName":"Melee","action":"Melee"}}
[2021-05-06 04:49:37.233 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":21,"players":40,"damage":0,"cash":15}}},"feature":"match_info"}
[2021-05-06 04:49:39.747 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"55"}}},"feature":"me"}
[2021-05-06 04:49:40.524 AM] {"info":{"match_info":{"roster_35":null}},"feature":"roster"}
[2021-05-06 04:49:40.814 AM] {"info":{"match_info":{"location":{"x":"-263","y":"224","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:41.262 AM] {"info":{"match_info":{"location":{"x":"-263","y":"225","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:41.648 AM] {"info":{"me":{"inUse":{"inUse":"Melee"}}},"feature":"inventory"}
[2021-05-06 04:49:41.760 AM] {"info":{"match_info":{"location":{"x":"-264","y":"224","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:42.259 AM] {"info":{"match_info":{"location":{"x":"-266","y":"224","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:42.370 AM] {"info":{"me":{"inventory_1":{"name":"133","amount":"40"}}},"feature":"inventory"}
[2021-05-06 04:49:42.765 AM] {"info":{"match_info":{"location":{"x":"-266","y":"225","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:43.263 AM] {"info":{"match_info":{"location":{"x":"-267","y":"226","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:43.974 AM] {"info":{"me":{"inventory_2":{"name":"130","amount":"60"}}},"feature":"inventory"}
[2021-05-06 04:49:43.976 AM] {"info":{"me":{"inventory_3":{"name":"130","amount":"20"}}},"feature":"inventory"}
[2021-05-06 04:49:43.977 AM] {"info":{"me":{"inventory_4":{"name":"141","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:49:43.980 AM] {"info":{"me":{"inventory_5":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:49:43.982 AM] {"info":{"me":{"inventory_6":{"name":"139","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:49:43.985 AM] {"info":{"me":{"inventory_7":{"name":"139","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:49:43.986 AM] {"info":{"me":{"inventory_8":{"name":"164","amount":"1"}}},"feature":"inventory"}
[2021-05-06 04:49:43.987 AM] {"info":{"me":{"inventory_9":null}},"feature":"inventory"}
[2021-05-06 04:49:44.555 AM] {"info":{"me":{"inventory_7":{"name":"139","amount":"1"}}},"feature":"inventory"}
[2021-05-06 04:49:44.764 AM] {"info":{"match_info":{"location":{"x":"-266","y":"226","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:44.769 AM] {"info":{"me":{"inventory_7":{"name":"164","amount":"1"}}},"feature":"inventory"}
[2021-05-06 04:49:44.771 AM] {"info":{"me":{"inventory_8":null}},"feature":"inventory"}
[2021-05-06 04:49:45.260 AM] {"info":{"match_info":{"location":{"x":"-267","y":"226","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:45.763 AM] {"info":{"match_info":{"location":{"x":"-268","y":"226","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:45.767 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":21,"players":40,"damage":0,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:49:46.594 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2021-05-06 04:49:46.752 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[GMRZ] night","victimName":"[RUN] trent_the_ging","weaponName":"r45","action":"knockdown"}}
[2021-05-06 04:49:46.975 AM] {"info":{"me":{"inventory_3":{"name":"130","amount":"60"}}},"feature":"inventory"}
[2021-05-06 04:49:47.575 AM] {"info":{"me":{"inventory_4":{"name":"130","amount":"40"}}},"feature":"inventory"}
[2021-05-06 04:49:47.576 AM] {"info":{"me":{"inventory_5":{"name":"141","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:49:47.577 AM] {"info":{"me":{"inventory_7":{"name":"139","amount":"4"}}},"feature":"inventory"}
[2021-05-06 04:49:47.578 AM] {"info":{"me":{"inventory_8":{"name":"164","amount":"1"}}},"feature":"inventory"}
[2021-05-06 04:49:47.579 AM] {"info":{"me":{"inventory_6":{"name":"141","amount":"2"}}},"feature":"inventory"}
[2021-05-06 04:49:48.298 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"60"}}},"feature":"me"}
[2021-05-06 04:49:48.804 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" davidhizar96","victimName":" shiggyqwq","weaponName":"spitfire","action":"knockdown"}}
[2021-05-06 04:49:49.136 AM] {"info":{"match_info":{"roster_11":null}},"feature":"roster"}
[2021-05-06 04:49:52.313 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" davidhizar96","victimName":"[girl] seanomite","weaponName":"wingman","action":"kill"}}
[2021-05-06 04:49:52.322 AM] {"name":"kill_feed","data":{"attackerName":" davidhizar96","victimName":" shiggyqwq","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-05-06 04:49:52.327 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":20,"players":38,"damage":0,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:49:54.345 AM] {"name":"kill_feed","data":{"attackerName":"[GMRZ] night","victimName":"[RUN] trent_the_ging","weaponName":"Melee","action":"Melee"}}
[2021-05-06 04:49:54.354 AM] {"info":{"match_info":{"roster_37":null}},"feature":"roster"}
[2021-05-06 04:49:57.339 AM] {"info":{"match_info":{"location":{"x":"-267","y":"225","z":"-65"}}},"feature":"location"}
[2021-05-06 04:49:58.327 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"65"}}},"feature":"me"}
[2021-05-06 04:49:58.836 AM] {"info":{"match_info":{"location":{"x":"-267","y":"224","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:00.341 AM] {"info":{"match_info":{"location":{"x":"-267","y":"223","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:01.327 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[GMRZ] Lily","victimName":"[THL] kxngava","weaponName":"mozambique","action":"kill"}}
[2021-05-06 04:50:01.339 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":20,"players":37,"damage":0,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:50:01.830 AM] {"name":"kill_feed","data":{"attackerName":"[GMRZ] night","victimName":"[RUN] trent_the_ging","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-05-06 04:50:01.838 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":19,"players":36,"damage":0,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:50:02.573 AM] {"info":{"match_info":{"roster_42":null}},"feature":"roster"}
[2021-05-06 04:50:04.567 AM] {"info":{"match_info":{"roster_19":null}},"feature":"roster"}
[2021-05-06 04:50:06.522 AM] {"info":{"me":{"inUse":{"inUse":"M600 Spitfire"}}},"feature":"inventory"}
[2021-05-06 04:50:06.828 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"70"}}},"feature":"me"}
[2021-05-06 04:50:08.969 AM] {"info":{"match_info":{"roster_36":null}},"feature":"roster"}
[2021-05-06 04:50:11.838 AM] {"info":{"match_info":{"location":{"x":"-266","y":"223","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:12.337 AM] {"info":{"match_info":{"location":{"x":"-266","y":"224","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:13.838 AM] {"info":{"match_info":{"location":{"x":"-266","y":"223","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:14.836 AM] {"info":{"match_info":{"location":{"x":"-267","y":"223","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:15.325 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"75"}}},"feature":"me"}
[2021-05-06 04:50:16.327 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[TTS] Hopps","victimName":" dsparkey","weaponName":"r301","action":"knockdown"}}
[2021-05-06 04:50:18.331 AM] {"name":"kill_feed","data":{"attackerName":"[Reap] razzrider17","victimName":" davidhizar96","weaponName":"Knuckle Cluster","action":"Knuckle Cluster"}}
[2021-05-06 04:50:18.359 AM] {"info":{"match_info":{"location":{"x":"-266","y":"223","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:19.831 AM] {"info":{"match_info":{"location":{"x":"-265","y":"224","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:20.326 AM] {"name":"kill_feed","data":{"attackerName":"[Slrp] SweetTeaSlurper","victimName":"[PTC] Xerphil","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-05-06 04:50:20.339 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Slrp] SweetTeaSlurper","victimName":"[PTC] ImperfectJustice","weaponName":"devotion","action":"kill"}}
[2021-05-06 04:50:20.349 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Slrp] SweetTeaSlurper","victimName":"[PTC] Xerphil","weaponName":"devotion","action":"knockdown"}}
[2021-05-06 04:50:20.357 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":18,"players":34,"damage":0,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:50:21.336 AM] {"info":{"match_info":{"location":{"x":"-264","y":"224","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:21.832 AM] {"info":{"match_info":{"location":{"x":"-264","y":"225","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:22.834 AM] {"info":{"match_info":{"location":{"x":"-263","y":"225","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:24.327 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"80"}}},"feature":"me"}
[2021-05-06 04:50:24.347 AM] {"info":{"match_info":{"location":{"x":"-262","y":"225","z":"-65"}}},"feature":"location"}
[2021-05-06 04:50:25.338 AM] {"info":{"match_info":{"location":{"x":"-261","y":"225","z":"-64"}}},"feature":"location"}
[2021-05-06 04:50:26.836 AM] {"info":{"match_info":{"location":{"x":"-260","y":"225","z":"-64"}}},"feature":"location"}
[2021-05-06 04:50:27.332 AM] {"info":{"match_info":{"location":{"x":"-260","y":"226","z":"-64"}}},"feature":"location"}
[2021-05-06 04:50:27.477 AM] {"info":{"match_info":{"roster_40":null}},"feature":"roster"}
[2021-05-06 04:50:28.836 AM] {"info":{"match_info":{"location":{"x":"-259","y":"226","z":"-64"}}},"feature":"location"}
[2021-05-06 04:50:29.335 AM] {"info":{"match_info":{"location":{"x":"-260","y":"227","z":"-64"}}},"feature":"location"}
[2021-05-06 04:50:30.721 AM] {"info":{"match_info":{"roster_18":null}},"feature":"roster"}
[2021-05-06 04:50:30.833 AM] {"info":{"match_info":{"location":{"x":"-260","y":"228","z":"-64"}}},"feature":"location"}
[2021-05-06 04:50:31.334 AM] {"info":{"match_info":{"location":{"x":"-260","y":"228","z":"-63"}}},"feature":"location"}
[2021-05-06 04:50:32.825 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"85"}}},"feature":"me"}
[2021-05-06 04:50:33.338 AM] {"info":{"match_info":{"location":{"x":"-259","y":"227","z":"-63"}}},"feature":"location"}
[2021-05-06 04:50:33.825 AM] {"name":"kill_feed","data":{"attackerName":"[TTS] Hopps","victimName":" dsparkey","weaponName":"Bleed Out","action":"Bleed Out"}}
[2021-05-06 04:50:33.841 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":17,"players":32,"damage":0,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:50:33.850 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[TTS] Hopps","victimName":"[Reap] razzrider17","weaponName":"r301","action":"kill"}}
[2021-05-06 04:50:35.335 AM] {"info":{"match_info":{"location":{"x":"-258","y":"226","z":"-63"}}},"feature":"location"}
[2021-05-06 04:50:36.334 AM] {"info":{"match_info":{"location":{"x":"-258","y":"226","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:36.835 AM] {"info":{"match_info":{"location":{"x":"-257","y":"226","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:37.337 AM] {"info":{"match_info":{"location":{"x":"-257","y":"225","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:38.334 AM] {"info":{"match_info":{"location":{"x":"-256","y":"225","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:39.839 AM] {"info":{"match_info":{"location":{"x":"-255","y":"225","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:40.337 AM] {"info":{"match_info":{"location":{"x":"-255","y":"224","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:41.335 AM] {"info":{"match_info":{"location":{"x":"-254","y":"224","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:42.334 AM] {"info":{"match_info":{"location":{"x":"-255","y":"224","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:42.828 AM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"90"}}},"feature":"me"}
[2021-05-06 04:50:43.653 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"19.000000","armor":true,"headshot":false}}
[2021-05-06 04:50:43.669 AM] {"info":{"me":{"totalDamageDealt":"19"}},"feature":"damage"}
[2021-05-06 04:50:43.785 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"19.000000","armor":true,"headshot":false}}
[2021-05-06 04:50:43.798 AM] {"info":{"me":{"totalDamageDealt":"38"}},"feature":"damage"}
[2021-05-06 04:50:43.836 AM] {"info":{"match_info":{"location":{"x":"-255","y":"223","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:43.849 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":17,"players":32,"damage":38,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:50:43.897 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"19.000000","armor":true,"headshot":false}}
[2021-05-06 04:50:43.905 AM] {"info":{"me":{"totalDamageDealt":"57"}},"feature":"damage"}
[2021-05-06 04:50:44.324 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":17,"players":32,"damage":57,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:50:44.446 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"14.000000","armor":true,"headshot":false}}
[2021-05-06 04:50:44.453 AM] {"info":{"me":{"totalDamageDealt":"71"}},"feature":"damage"}
[2021-05-06 04:50:44.539 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"4.000000","armor":true,"headshot":false}}
[2021-05-06 04:50:44.546 AM] {"info":{"me":{"totalDamageDealt":"75"}},"feature":"damage"}
[2021-05-06 04:50:44.554 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"15.000000","armor":false,"headshot":false}}
[2021-05-06 04:50:44.564 AM] {"info":{"me":{"totalDamageDealt":"90"}},"feature":"damage"}
[2021-05-06 04:50:44.642 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"19.000000","armor":false,"headshot":false}}
[2021-05-06 04:50:44.652 AM] {"info":{"me":{"totalDamageDealt":"109"}},"feature":"damage"}
[2021-05-06 04:50:44.789 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"19.000000","armor":false,"headshot":false}}
[2021-05-06 04:50:44.798 AM] {"info":{"me":{"totalDamageDealt":"128"}},"feature":"damage"}
[2021-05-06 04:50:44.832 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":17,"players":32,"damage":128,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:50:44.891 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"19.000000","armor":false,"headshot":false}}
[2021-05-06 04:50:44.899 AM] {"info":{"me":{"totalDamageDealt":"147"}},"feature":"damage"}
[2021-05-06 04:50:44.997 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"19.000000","armor":false,"headshot":false}}
[2021-05-06 04:50:45.005 AM] {"info":{"me":{"totalDamageDealt":"166"}},"feature":"damage"}
[2021-05-06 04:50:45.094 AM] {"info":{"me":{"totalDamageDealt":"185"}},"feature":"damage"}
[2021-05-06 04:50:45.104 AM] {"name":"damage","data":{"targetName":"brandon","damageAmount":"19.000000","armor":false,"headshot":false}}
[2021-05-06 04:50:45.336 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"MasterKriff","victimName":"[LIKE] brandon","weaponName":"spitfire","action":"knockdown"}}
[2021-05-06 04:50:45.347 AM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":17,"players":32,"damage":175,"cash":20}}},"feature":"match_info"}
[2021-05-06 04:50:45.836 AM] {"info":{"match_info":{"location":{"x":"-255","y":"224","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:46.337 AM] {"info":{"match_info":{"location":{"x":"-255","y":"225","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:46.602 AM] {"info":{"me":{"inUse":{"inUse":"R-301 Carbine"}}},"feature":"inventory"}
[2021-05-06 04:50:46.837 AM] {"info":{"match_info":{"location":{"x":"-254","y":"225","z":"-62"}}},"feature":"location"}
[2021-05-06 04:50:48.331 AM] {"name":"death","data":null}
[2021-05-06 04:50:48.340 AM] {"info":{"match_info":{"team_info":{"team_state":"eliminated"}}},"feature":"team"}
[2021-05-06 04:50:48.348 AM] {"info":{"match_info":{"victory":false}},"feature":"rank"}
[2021-05-06 04:50:48.364 AM] {"info":{"match_info":{"location":{"x":"-254","y":"225","z":"-61"}}},"feature":"location"}
[2021-05-06 04:50:48.372 AM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2021-05-06 04:50:48.381 AM] {"info":{"me":{"inUse":{"inUse":null}}},"feature":"inventory"}
[2021-05-06 04:50:48.389 AM] {"info":{"match_info":{"teammate_0":{"name":"MasterKriff","state":"dead"}}},"feature":"team"}
[2021-05-06 04:50:48.398 AM] {"info":{"match_info":{"roster_26":{"name":"MasterKriff","isTeammate":true,"team_id":28,"platform_hw":2,"platform_sw":7,"state":"dead"}}},"feature":"roster"}
[2021-05-06 04:50:48.770 AM] {"info":{"match_info":{"roster_4":null}},"feature":"roster"}
[2021-05-06 04:50:48.824 AM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[LIKE] THEJ0RY","victimName":"MasterKriff","weaponName":"r97","action":"kill"}}
[2021-05-06 04:50:49.921 AM] {"info":{"match_info":{"roster_34":null}},"feature":"roster"}
[2021-05-06 04:50:59.260 AM] {"info":{"match_info":{"pseudo_match_id":null}},"feature":"match_info"}
[2021-05-06 04:50:59.272 AM] {"info":{"match_info":{"team_info":{"team_state":null}}},"feature":"team"}
[2021-05-06 04:50:59.312 AM] {"info":{"game_info":{"match_state":"inactive"}},"feature":"match_state"}
[2021-05-06 04:50:59.319 AM] {"name":"match_end","data":null}
[2021-05-06 04:50:59.326 AM] {"info":{"match_info":{"roster_0":null}},"feature":"roster"}
[2021-05-06 04:50:59.334 AM] {"info":{"match_info":{"roster_2":null}},"feature":"roster"}
[2021-05-06 04:50:59.342 AM] {"info":{"match_info":{"roster_3":null}},"feature":"roster"}
[2021-05-06 04:50:59.350 AM] {"info":{"match_info":{"roster_5":null}},"feature":"roster"}
[2021-05-06 04:50:59.357 AM] {"info":{"match_info":{"roster_6":null}},"feature":"roster"}
[2021-05-06 04:50:59.363 AM] {"info":{"match_info":{"roster_7":null}},"feature":"roster"}
[2021-05-06 04:50:59.370 AM] {"info":{"match_info":{"roster_9":null}},"feature":"roster"}
[2021-05-06 04:50:59.377 AM] {"info":{"match_info":{"roster_10":null}},"feature":"roster"}
[2021-05-06 04:50:59.385 AM] {"info":{"match_info":{"roster_12":null}},"feature":"roster"}
[2021-05-06 04:50:59.392 AM] {"info":{"match_info":{"roster_1":null}},"feature":"roster"}
[2021-05-06 04:50:59.399 AM] {"info":{"match_info":{"roster_13":null}},"feature":"roster"}
[2021-05-06 04:50:59.406 AM] {"info":{"match_info":{"roster_15":null}},"feature":"roster"}
[2021-05-06 04:50:59.413 AM] {"info":{"match_info":{"roster_17":null}},"feature":"roster"}
[2021-05-06 04:50:59.420 AM] {"info":{"match_info":{"roster_23":null}},"feature":"roster"}
[2021-05-06 04:50:59.428 AM] {"info":{"match_info":{"teammate_0":null}},"feature":"team"}
[2021-05-06 04:50:59.436 AM] {"info":{"match_info":{"roster_26":null}},"feature":"roster"}
[2021-05-06 04:50:59.445 AM] {"info":{"match_info":{"roster_27":null}},"feature":"roster"}
[2021-05-06 04:50:59.452 AM] {"info":{"match_info":{"roster_29":null}},"feature":"roster"}
[2021-05-06 04:50:59.460 AM] {"info":{"match_info":{"roster_14":null}},"feature":"roster"}
[2021-05-06 04:50:59.467 AM] {"info":{"match_info":{"roster_31":null}},"feature":"roster"}
[2021-05-06 04:50:59.475 AM] {"info":{"match_info":{"roster_32":null}},"feature":"roster"}
[2021-05-06 04:50:59.487 AM] {"info":{"match_info":{"roster_38":null}},"feature":"roster"}
[2021-05-06 04:50:59.498 AM] {"info":{"match_info":{"roster_41":null}},"feature":"roster"}
[2021-05-06 04:50:59.506 AM] {"info":{"match_info":{"roster_45":null}},"feature":"roster"}
[2021-05-06 04:50:59.513 AM] {"info":{"match_info":{"roster_47":null}},"feature":"roster"}
[2021-05-06 04:50:59.520 AM] {"info":{"match_info":{"roster_48":null}},"feature":"roster"}
[2021-05-06 04:50:59.528 AM] {"info":{"match_info":{"roster_49":null}},"feature":"roster"}
[2021-05-06 04:50:59.536 AM] {"info":{"match_info":{"roster_50":null}},"feature":"roster"}
[2021-05-06 04:50:59.543 AM] {"info":{"match_info":{"roster_51":null}},"feature":"roster"}
[2021-05-06 04:50:59.554 AM] {"info":{"match_info":{"roster_52":null}},"feature":"roster"}
[2021-05-06 04:50:59.562 AM] {"info":{"match_info":{"roster_33":null}},"feature":"roster"}
[2021-05-06 04:50:59.569 AM] {"info":{"match_info":{"roster_53":null}},"feature":"roster"}
[2021-05-06 04:50:59.576 AM] {"info":{"match_info":{"roster_55":null}},"feature":"roster"}
[2021-05-06 04:50:59.583 AM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2021-05-06 04:50:59.590 AM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2021-05-06 04:50:59.597 AM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2021-05-06 04:50:59.605 AM] {"info":{"me":{"inventory_3":null}},"feature":"inventory"}
[2021-05-06 04:50:59.611 AM] {"info":{"me":{"inventory_4":null}},"feature":"inventory"}
[2021-05-06 04:50:59.618 AM] {"info":{"me":{"inventory_5":null}},"feature":"inventory"}
[2021-05-06 04:50:59.625 AM] {"info":{"me":{"inventory_6":null}},"feature":"inventory"}
[2021-05-06 04:50:59.632 AM] {"info":{"me":{"inventory_7":null}},"feature":"inventory"}
[2021-05-06 04:50:59.639 AM] {"info":{"me":{"inventory_8":null}},"feature":"inventory"}
[2021-05-06 04:51:01.262 AM] {"info":{"match_info":{"legendSelect_0":null}},"feature":"team"}
[2021-05-06 04:51:01.274 AM] {"info":{"match_info":{"tabs":null}},"feature":"match_info"}
`;
