import { v4 as uuid } from "uuid";

export const s12Quick = (): string => `
[2022-04-19 09:53:20.462 PM] {"info":{"match_info":{"game_mode":"#PL_TRIO"}},"feature":"match_info"}
[2022-04-19 09:53:25.922 PM] {"info":{"match_info":{"game_mode":"#CAMPFIRE_MODE"}},"feature":"match_info"}
[2022-04-19 09:53:48.669 PM] {"info":{"match_info":{"location":{"x":"-154","y":"-213","z":"-48"}}},"feature":"location"}
[2022-04-19 09:53:48.673 PM] {"info":{"match_info":{"roster_18":{"name":"All Kool no Aid","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.718 PM] {"info":{"match_info":{"roster_0":{"name":"Germy Enjoyer","isTeammate":false,"team_id":15,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.720 PM] {"info":{"match_info":{"roster_1":{"name":"NukeyHD | Twitch","isTeammate":false,"team_id":21,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.722 PM] {"info":{"match_info":{"roster_2":{"name":"MrCoffee","isTeammate":false,"team_id":12,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.724 PM] {"info":{"match_info":{"roster_3":{"name":"loedro2.0","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.725 PM] {"info":{"match_info":{"roster_4":{"name":"TierTekno","isTeammate":false,"team_id":18,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.727 PM] {"info":{"match_info":{"roster_5":{"name":"Zamblar","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.729 PM] {"info":{"match_info":{"roster_6":{"name":"achillesheelys","isTeammate":false,"team_id":6,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.730 PM] {"info":{"match_info":{"roster_7":{"name":"IMrcud","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.732 PM] {"info":{"match_info":{"roster_8":{"name":"breakerx2x","isTeammate":false,"team_id":19,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.733 PM] {"info":{"match_info":{"roster_9":{"name":"TTV_Confixes","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.734 PM] {"info":{"match_info":{"roster_10":{"name":"eitak","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.735 PM] {"info":{"match_info":{"roster_11":{"name":"MadPK","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.736 PM] {"info":{"match_info":{"roster_13":{"name":"robtheshoemaker","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.737 PM] {"info":{"match_info":{"roster_15":{"name":"PapaJPowell","isTeammate":false,"team_id":12,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.739 PM] {"info":{"match_info":{"roster_16":{"name":"MeloMarko","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.740 PM] {"info":{"match_info":{"roster_17":{"name":"Feintless","isTeammate":false,"team_id":12,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.741 PM] {"info":{"match_info":{"roster_19":{"name":"BugSmuggler","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.742 PM] {"info":{"match_info":{"roster_20":{"name":"ScIy","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.743 PM] {"info":{"match_info":{"roster_21":{"name":"msys","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.744 PM] {"info":{"match_info":{"roster_22":{"name":"Syruphi","isTeammate":false,"team_id":16,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.745 PM] {"info":{"match_info":{"teammate_0":{"name":"SDCore.Tv","state":"respawn"}}},"feature":"team"}
[2022-04-19 09:53:48.747 PM] {"info":{"match_info":{"roster_23":{"name":"SDCore.Tv","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.749 PM] {"info":{"match_info":{"roster_25":{"name":"BigMusclySweatyBlackMenForJesus","isTeammate":false,"team_id":9,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.751 PM] {"info":{"match_info":{"roster_26":{"name":"DEDSTATIK","isTeammate":false,"team_id":6,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.753 PM] {"info":{"match_info":{"roster_27":{"name":"blakely","isTeammate":false,"team_id":21,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.754 PM] {"info":{"match_info":{"roster_28":{"name":"peen_machine420","isTeammate":false,"team_id":3,"platform_hw":8,"platform_sw":8,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.756 PM] {"info":{"match_info":{"teammate_1":{"name":"MasterKriff","state":"respawn"}}},"feature":"team"}
[2022-04-19 09:53:48.758 PM] {"info":{"match_info":{"roster_30":{"name":"MasterKriff","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"1"}}},"feature":"roster"}
[2022-04-19 09:53:48.759 PM] {"info":{"match_info":{"roster_31":{"name":"10q","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.761 PM] {"info":{"match_info":{"roster_33":{"name":"Drunknmnkey622","isTeammate":false,"team_id":4,"platform_hw":10,"platform_sw":10,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.763 PM] {"info":{"match_info":{"roster_35":{"name":"Chorgi","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.765 PM] {"info":{"match_info":{"roster_36":{"name":"Hensuki","isTeammate":false,"team_id":19,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.766 PM] {"info":{"match_info":{"roster_37":{"name":"LazyWhisper1","isTeammate":false,"team_id":6,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.768 PM] {"info":{"match_info":{"roster_38":{"name":"Uzibek09","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.770 PM] {"info":{"match_info":{"roster_39":{"name":"swetsalt","isTeammate":false,"team_id":17,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.771 PM] {"info":{"match_info":{"roster_42":{"name":"honey NUT cheerios","isTeammate":false,"team_id":7,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.773 PM] {"info":{"match_info":{"roster_43":{"name":"三菜一汤","isTeammate":false,"team_id":2,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.803 PM] {"info":{"match_info":{"roster_44":{"name":"TheBigBadPiggy","isTeammate":false,"team_id":5,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.805 PM] {"info":{"match_info":{"roster_45":{"name":"Hayoh332","isTeammate":false,"team_id":19,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.808 PM] {"info":{"match_info":{"roster_46":{"name":"xonut | KC is dogshit","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.811 PM] {"info":{"match_info":{"roster_47":{"name":"SuperRatGirl","isTeammate":false,"team_id":21,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.813 PM] {"info":{"match_info":{"roster_51":{"name":"crazytorts","isTeammate":false,"team_id":8,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.815 PM] {"info":{"match_info":{"roster_52":{"name":"JAGOS","isTeammate":false,"team_id":4,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.817 PM] {"info":{"match_info":{"roster_53":{"name":"seniorcornsmut","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.819 PM] {"info":{"match_info":{"roster_54":{"name":"Nitrogen Peroxide","isTeammate":false,"team_id":3,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.823 PM] {"info":{"match_info":{"roster_55":{"name":"Jakequake","isTeammate":false,"team_id":20,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.825 PM] {"info":{"match_info":{"roster_57":{"name":"Onastraz","isTeammate":false,"team_id":15,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.827 PM] {"info":{"match_info":{"roster_58":{"name":"NOHLogiic","isTeammate":false,"team_id":14,"platform_hw":2,"platform_sw":2,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.843 PM] {"info":{"match_info":{"teammate_2":{"name":"Fishlyne","state":"respawn"}}},"feature":"team"}
[2022-04-19 09:53:48.846 PM] {"info":{"match_info":{"roster_29":{"name":"Fishlyne","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"respawn","is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.848 PM] {"info":{"match_info":{"roster_32":{"name":"BUBBA","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:48.850 PM] {"info":{"match_info":{"roster_41":{"name":"chorizo3389","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:49.159 PM] {"info":{"match_info":{"roster_34":{"name":"ThundrBuddyX","isTeammate":false,"team_id":4,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:49.387 PM] {"info":{"match_info":{"roster_56":{"name":"WiggleDong","isTeammate":false,"team_id":9,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:49.776 PM] {"info":{"match_info":{"roster_14":{"name":"MrMoby1","isTeammate":false,"team_id":7,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:50.020 PM] {"info":{"match_info":{"roster_12":{"name":"Iwaxumin","isTeammate":false,"team_id":15,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:50.073 PM] {"info":{"match_info":{"roster_50":{"name":"JagersPine716","isTeammate":false,"team_id":7,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:50.269 PM] {"info":{"match_info":{"roster_40":{"name":"D3ATHSTROKE4720","isTeammate":false,"team_id":14,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:50.424 PM] {"info":{"match_info":{"roster_48":{"name":"Chumpattie","isTeammate":false,"team_id":10,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:55.312 PM] {"info":{"match_info":{"roster_24":{"name":"bald dingus","isTeammate":false,"team_id":9,"platform_hw":0,"platform_sw":0,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:53:59.109 PM] {"info":{"match_info":{"roster_49":{"name":"Daikimei","isTeammate":false,"team_id":11,"platform_hw":2,"platform_sw":7,"is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:54:04.011 PM] {"info":{"match_info":{"roster_16":null}},"feature":"roster"}
[2022-04-19 09:54:45.550 PM] {"info":{"match_info":{"legendSelect_0":{"playerName":"Fishlyne","legendName":"#character_lifeline_NAME","selectionOrder":"0","lead":true}}},"feature":"team"}
[2022-04-19 09:54:53.021 PM] {"info":{"match_info":{"legendSelect_0":{"playerName":"Fishlyne","legendName":"#character_lifeline_NAME","selectionOrder":"0","lead":false}}},"feature":"team"}
[2022-04-19 09:54:53.073 PM] {"info":{"match_info":{"legendSelect_1":{"playerName":"[tohT] SDCore.Tv","legendName":"#character_wattson_NAME","selectionOrder":"1","lead":true}}},"feature":"team"}
[2022-04-19 09:54:59.413 PM] {"info":{"match_info":{"legendSelect_1":{"playerName":"[tohT] SDCore.Tv","legendName":"#character_wattson_NAME","selectionOrder":"1","lead":false}}},"feature":"team"}
[2022-04-19 09:54:59.465 PM] {"info":{"match_info":{"legendSelect_2":{"playerName":"MasterKriff","legendName":"#character_bangalore_NAME","selectionOrder":"2","lead":true}}},"feature":"team"}
[2022-04-19 09:55:10.205 PM] {"info":{"match_info":{"location":{"x":"-62","y":"-61","z":"-60"}}},"feature":"location"}
[2022-04-19 09:55:17.604 PM] {"info":{"match_info":{"pseudo_match_id":"${uuid}"}},"feature":"match_info"}
[2022-04-19 09:55:17.610 PM] {"name":"match_start","data":null}
[2022-04-19 09:55:17.613 PM] {"info":{"me":{"totalDamageDealt":"0"}},"feature":"damage"}
[2022-04-19 09:55:17.614 PM] {"info":{"game_info":{"match_state":"active"}},"feature":"match_state"}
[2022-04-19 09:55:17.617 PM] {"info":{"me":{"inUse":{"inUse":"mp_ability_mobile_respawn_beacon"}}},"feature":"inventory"}
[2022-04-19 09:55:17.619 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":20,"players":58,"damage":0,"cash":0}}},"feature":"match_info"}
[2022-04-19 09:55:17.623 PM] {"info":{"me":{"weapons":null}},"feature":"inventory"}
[2022-04-19 09:55:17.625 PM] {"info":{"match_info":{"victory":null}},"feature":"rank"}
[2022-04-19 09:55:17.626 PM] {"info":{"match_info":{"team_info":{"team_state":"active"}}},"feature":"team"}
[2022-04-19 09:55:17.628 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-19 09:55:17.654 PM] {"info":{"match_info":{"location":{"x":"97","y":"-521","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:18.201 PM] {"info":{"match_info":{"location":{"x":"93","y":"-509","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:18.704 PM] {"info":{"match_info":{"location":{"x":"89","y":"-500","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:19.217 PM] {"info":{"match_info":{"location":{"x":"86","y":"-490","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:19.735 PM] {"info":{"match_info":{"location":{"x":"82","y":"-480","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:20.254 PM] {"info":{"match_info":{"location":{"x":"79","y":"-471","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:20.772 PM] {"info":{"match_info":{"location":{"x":"75","y":"-461","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:21.297 PM] {"info":{"match_info":{"location":{"x":"71","y":"-451","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:21.824 PM] {"info":{"match_info":{"location":{"x":"68","y":"-441","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:22.345 PM] {"info":{"match_info":{"location":{"x":"64","y":"-431","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:22.869 PM] {"info":{"match_info":{"location":{"x":"61","y":"-421","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:23.393 PM] {"info":{"match_info":{"location":{"x":"57","y":"-411","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:23.911 PM] {"info":{"match_info":{"location":{"x":"54","y":"-402","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:24.404 PM] {"info":{"match_info":{"location":{"x":"50","y":"-392","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:24.904 PM] {"info":{"match_info":{"location":{"x":"47","y":"-382","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:25.408 PM] {"info":{"match_info":{"location":{"x":"43","y":"-373","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:25.909 PM] {"info":{"match_info":{"location":{"x":"40","y":"-363","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:25.964 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"5"}}},"feature":"me"}
[2022-04-19 09:55:26.464 PM] {"info":{"match_info":{"location":{"x":"37","y":"-355","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:26.953 PM] {"info":{"match_info":{"location":{"x":"33","y":"-344","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:27.477 PM] {"info":{"match_info":{"location":{"x":"30","y":"-335","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:27.999 PM] {"info":{"match_info":{"location":{"x":"26","y":"-325","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:28.535 PM] {"info":{"match_info":{"location":{"x":"23","y":"-315","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:29.054 PM] {"info":{"match_info":{"location":{"x":"19","y":"-305","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:29.575 PM] {"info":{"match_info":{"location":{"x":"15","y":"-295","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:30.098 PM] {"info":{"match_info":{"location":{"x":"12","y":"-285","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:30.623 PM] {"info":{"match_info":{"location":{"x":"8","y":"-275","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:31.141 PM] {"info":{"match_info":{"location":{"x":"5","y":"-266","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:31.661 PM] {"info":{"match_info":{"location":{"x":"1","y":"-256","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:32.178 PM] {"info":{"match_info":{"location":{"x":"-1","y":"-246","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:32.696 PM] {"info":{"match_info":{"location":{"x":"-5","y":"-236","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:33.209 PM] {"info":{"match_info":{"location":{"x":"-8","y":"-227","z":"119"}}},"feature":"location"}
[2022-04-19 09:55:33.730 PM] {"info":{"match_info":{"location":{"x":"-12","y":"-217","z":"116"}}},"feature":"location"}
[2022-04-19 09:55:34.234 PM] {"info":{"match_info":{"location":{"x":"-13","y":"-212","z":"113"}}},"feature":"location"}
[2022-04-19 09:55:34.739 PM] {"info":{"match_info":{"location":{"x":"-8","y":"-209","z":"111"}}},"feature":"location"}
[2022-04-19 09:55:34.796 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"10"}}},"feature":"me"}
[2022-04-19 09:55:35.248 PM] {"info":{"match_info":{"location":{"x":"-6","y":"-205","z":"108"}}},"feature":"location"}
[2022-04-19 09:55:35.760 PM] {"info":{"match_info":{"location":{"x":"-3","y":"-201","z":"105"}}},"feature":"location"}
[2022-04-19 09:55:36.265 PM] {"info":{"match_info":{"location":{"x":"0","y":"-198","z":"101"}}},"feature":"location"}
[2022-04-19 09:55:36.764 PM] {"info":{"match_info":{"location":{"x":"3","y":"-194","z":"97"}}},"feature":"location"}
[2022-04-19 09:55:37.264 PM] {"info":{"match_info":{"location":{"x":"6","y":"-190","z":"93"}}},"feature":"location"}
[2022-04-19 09:55:37.774 PM] {"info":{"match_info":{"location":{"x":"9","y":"-186","z":"89"}}},"feature":"location"}
[2022-04-19 09:55:38.281 PM] {"info":{"match_info":{"location":{"x":"12","y":"-182","z":"85"}}},"feature":"location"}
[2022-04-19 09:55:38.787 PM] {"info":{"match_info":{"location":{"x":"15","y":"-177","z":"81"}}},"feature":"location"}
[2022-04-19 09:55:39.293 PM] {"info":{"match_info":{"location":{"x":"18","y":"-173","z":"77"}}},"feature":"location"}
[2022-04-19 09:55:39.799 PM] {"info":{"match_info":{"location":{"x":"21","y":"-169","z":"74"}}},"feature":"location"}
[2022-04-19 09:55:40.305 PM] {"info":{"match_info":{"location":{"x":"24","y":"-164","z":"70"}}},"feature":"location"}
[2022-04-19 09:55:40.809 PM] {"info":{"match_info":{"location":{"x":"27","y":"-160","z":"66"}}},"feature":"location"}
[2022-04-19 09:55:41.309 PM] {"info":{"match_info":{"location":{"x":"30","y":"-156","z":"62"}}},"feature":"location"}
[2022-04-19 09:55:41.811 PM] {"info":{"match_info":{"location":{"x":"32","y":"-151","z":"58"}}},"feature":"location"}
[2022-04-19 09:55:42.313 PM] {"info":{"match_info":{"location":{"x":"35","y":"-147","z":"55"}}},"feature":"location"}
[2022-04-19 09:55:42.811 PM] {"info":{"match_info":{"location":{"x":"38","y":"-142","z":"51"}}},"feature":"location"}
[2022-04-19 09:55:43.310 PM] {"info":{"match_info":{"location":{"x":"41","y":"-138","z":"46"}}},"feature":"location"}
[2022-04-19 09:55:43.386 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"15"}}},"feature":"me"}
[2022-04-19 09:55:43.816 PM] {"info":{"match_info":{"location":{"x":"44","y":"-133","z":"43"}}},"feature":"location"}
[2022-04-19 09:55:44.309 PM] {"info":{"match_info":{"location":{"x":"47","y":"-129","z":"39"}}},"feature":"location"}
[2022-04-19 09:55:44.808 PM] {"info":{"match_info":{"location":{"x":"50","y":"-124","z":"35"}}},"feature":"location"}
[2022-04-19 09:55:45.312 PM] {"info":{"match_info":{"location":{"x":"52","y":"-120","z":"31"}}},"feature":"location"}
[2022-04-19 09:55:45.812 PM] {"info":{"match_info":{"location":{"x":"55","y":"-116","z":"27"}}},"feature":"location"}
[2022-04-19 09:55:46.310 PM] {"info":{"match_info":{"location":{"x":"58","y":"-111","z":"24"}}},"feature":"location"}
[2022-04-19 09:55:46.811 PM] {"info":{"match_info":{"location":{"x":"61","y":"-107","z":"20"}}},"feature":"location"}
[2022-04-19 09:55:47.314 PM] {"info":{"match_info":{"location":{"x":"64","y":"-102","z":"16"}}},"feature":"location"}
[2022-04-19 09:55:47.810 PM] {"info":{"match_info":{"location":{"x":"67","y":"-98","z":"13"}}},"feature":"location"}
[2022-04-19 09:55:48.312 PM] {"info":{"match_info":{"location":{"x":"70","y":"-94","z":"10"}}},"feature":"location"}
[2022-04-19 09:55:48.813 PM] {"info":{"match_info":{"location":{"x":"73","y":"-89","z":"7"}}},"feature":"location"}
[2022-04-19 09:55:49.311 PM] {"info":{"match_info":{"location":{"x":"76","y":"-85","z":"4"}}},"feature":"location"}
[2022-04-19 09:55:49.811 PM] {"info":{"match_info":{"location":{"x":"79","y":"-81","z":"0"}}},"feature":"location"}
[2022-04-19 09:55:50.311 PM] {"info":{"match_info":{"location":{"x":"83","y":"-77","z":"-3"}}},"feature":"location"}
[2022-04-19 09:55:50.808 PM] {"info":{"match_info":{"location":{"x":"87","y":"-72","z":"-6"}}},"feature":"location"}
[2022-04-19 09:55:51.310 PM] {"info":{"match_info":{"location":{"x":"91","y":"-68","z":"-9"}}},"feature":"location"}
[2022-04-19 09:55:51.808 PM] {"info":{"match_info":{"location":{"x":"95","y":"-64","z":"-12"}}},"feature":"location"}
[2022-04-19 09:55:52.311 PM] {"info":{"match_info":{"location":{"x":"98","y":"-59","z":"-14"}}},"feature":"location"}
[2022-04-19 09:55:52.316 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"20"}}},"feature":"me"}
[2022-04-19 09:55:52.811 PM] {"info":{"match_info":{"location":{"x":"101","y":"-55","z":"-17"}}},"feature":"location"}
[2022-04-19 09:55:53.310 PM] {"info":{"match_info":{"location":{"x":"104","y":"-50","z":"-19"}}},"feature":"location"}
[2022-04-19 09:55:53.808 PM] {"info":{"match_info":{"location":{"x":"107","y":"-46","z":"-21"}}},"feature":"location"}
[2022-04-19 09:55:54.310 PM] {"info":{"match_info":{"location":{"x":"110","y":"-41","z":"-23"}}},"feature":"location"}
[2022-04-19 09:55:54.750 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[RAGE] LazyWhisper1","victimName":"[YAGO] 10q","weaponName":"car","action":"knockdown"}}
[2022-04-19 09:55:54.807 PM] {"info":{"match_info":{"location":{"x":"114","y":"-37","z":"-25"}}},"feature":"location"}
[2022-04-19 09:55:55.309 PM] {"info":{"match_info":{"location":{"x":"117","y":"-33","z":"-27"}}},"feature":"location"}
[2022-04-19 09:55:55.809 PM] {"info":{"match_info":{"location":{"x":"120","y":"-30","z":"-31"}}},"feature":"location"}
[2022-04-19 09:55:56.309 PM] {"info":{"match_info":{"location":{"x":"123","y":"-27","z":"-33"}}},"feature":"location"}
[2022-04-19 09:55:56.587 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"0"}}},"feature":"me"}
[2022-04-19 09:55:56.810 PM] {"info":{"match_info":{"location":{"x":"125","y":"-24","z":"-37"}}},"feature":"location"}
[2022-04-19 09:55:57.308 PM] {"info":{"match_info":{"location":{"x":"127","y":"-22","z":"-37"}}},"feature":"location"}
[2022-04-19 09:55:57.811 PM] {"info":{"match_info":{"location":{"x":"128","y":"-21","z":"-36"}}},"feature":"location"}
[2022-04-19 09:55:58.037 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:55:58.312 PM] {"info":{"match_info":{"location":{"x":"128","y":"-21","z":"-37"}}},"feature":"location"}
[2022-04-19 09:55:58.594 PM] {"info":{"me":{"weapons":{"weapon1":"Frag Grenade"}}},"feature":"inventory"}
[2022-04-19 09:55:58.643 PM] {"info":{"me":{"inventory_0":{"name":"unknown_191","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:55:58.810 PM] {"info":{"match_info":{"location":{"x":"129","y":"-21","z":"-37"}}},"feature":"location"}
[2022-04-19 09:55:58.837 PM] {"info":{"me":{"inventory_0":{"name":"unknown_121","amount":"20"}}},"feature":"inventory"}
[2022-04-19 09:55:58.842 PM] {"info":{"me":{"inventory_1":{"name":"unknown_191","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:55:58.863 PM] {"info":{"me":{"inUse":{"inUse":"Frag Grenade"}}},"feature":"inventory"}
[2022-04-19 09:55:58.942 PM] {"info":{"me":{"weapons":{"weapon0":"P2020"}}},"feature":"inventory"}
[2022-04-19 09:55:58.945 PM] {"info":{"me":{"inUse":{"inUse":"P2020"}}},"feature":"inventory"}
[2022-04-19 09:55:59.142 PM] {"info":{"me":{"inventory_0":{"name":"unknown_121","amount":"40"}}},"feature":"inventory"}
[2022-04-19 09:56:00.070 PM] {"info":{"me":{"inventory_0":{"name":"unknown_124","amount":"20"}}},"feature":"inventory"}
[2022-04-19 09:56:00.075 PM] {"info":{"me":{"inventory_1":{"name":"unknown_121","amount":"40"}}},"feature":"inventory"}
[2022-04-19 09:56:00.080 PM] {"info":{"me":{"inventory_2":{"name":"unknown_191","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:00.241 PM] {"info":{"me":{"inventory_3":{"name":"unknown_226","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:00.309 PM] {"info":{"match_info":{"location":{"x":"129","y":"-20","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:00.840 PM] {"info":{"me":{"inventory_3":{"name":"unknown_213","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:00.845 PM] {"info":{"me":{"inventory_4":{"name":"unknown_226","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:01.266 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BOH] Zamblar","victimName":"[RAGE] LazyWhisper1","weaponName":"mozambique","action":"knockdown"}}
[2022-04-19 09:56:01.310 PM] {"info":{"match_info":{"location":{"x":"129","y":"-19","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:01.363 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:56:01.764 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Daikimei","victimName":"[RAGE] DEDSTATIK","weaponName":"rui/ordnance_icons/grenade_frag","action":"knockdown"}}
[2022-04-19 09:56:01.770 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" blakely","victimName":"[TTP] Feintless","weaponName":"3030repeater","action":"knockdown"}}
[2022-04-19 09:56:01.808 PM] {"info":{"match_info":{"location":{"x":"128","y":"-18","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:02.309 PM] {"info":{"match_info":{"location":{"x":"128","y":"-17","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:02.645 PM] {"info":{"me":{"inventory_1":{"name":"unknown_121","amount":"60"}}},"feature":"inventory"}
[2022-04-19 09:56:02.764 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" blakely","victimName":"[MrC] MrCoffee","weaponName":"3030repeater","action":"knockdown"}}
[2022-04-19 09:56:02.808 PM] {"info":{"match_info":{"location":{"x":"128","y":"-16","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:03.310 PM] {"info":{"match_info":{"location":{"x":"127","y":"-16","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:03.723 PM] {"info":{"me":{"inUse":{"inUse":"P2020"}}},"feature":"inventory"}
[2022-04-19 09:56:03.812 PM] {"info":{"match_info":{"location":{"x":"126","y":"-16","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:04.310 PM] {"info":{"match_info":{"location":{"x":"124","y":"-16","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:04.809 PM] {"info":{"match_info":{"location":{"x":"123","y":"-16","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:04.945 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":20,"players":57,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:56:04.950 PM] {"info":{"me":{"inventory_1":{"name":"unknown_121","amount":"58"}}},"feature":"inventory"}
[2022-04-19 09:56:05.264 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" NukeyHD | Twitch","victimName":"[TTP] Feintless","weaponName":"dragon","action":"kill"}}
[2022-04-19 09:56:05.308 PM] {"info":{"match_info":{"location":{"x":"123","y":"-17","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:05.339 PM] {"info":{"me":{"inventory_1":{"name":"unknown_121","amount":"60"}}},"feature":"inventory"}
[2022-04-19 09:56:05.345 PM] {"info":{"me":{"inventory_2":{"name":"unknown_121","amount":"18"}}},"feature":"inventory"}
[2022-04-19 09:56:05.350 PM] {"info":{"me":{"inventory_3":{"name":"unknown_191","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:05.355 PM] {"info":{"me":{"inventory_4":{"name":"unknown_213","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:05.359 PM] {"info":{"me":{"inventory_5":{"name":"unknown_226","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:05.416 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"5"}}},"feature":"me"}
[2022-04-19 09:56:05.809 PM] {"info":{"match_info":{"location":{"x":"122","y":"-18","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:05.942 PM] {"info":{"me":{"inventory_4":{"name":"unknown_191","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:05.947 PM] {"info":{"me":{"inventory_5":{"name":"unknown_213","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:05.951 PM] {"info":{"me":{"inventory_6":{"name":"unknown_226","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:06.649 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":20,"players":56,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:56:06.747 PM] {"info":{"me":{"inventory_3":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:06.751 PM] {"info":{"me":{"inventory_5":{"name":"unknown_191","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:06.755 PM] {"info":{"me":{"inventory_6":{"name":"unknown_213","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:06.760 PM] {"info":{"me":{"inventory_7":{"name":"unknown_226","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:06.768 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BUST] SuperRatGirl","victimName":"[MrC] MrCoffee","weaponName":"energy_ar","action":"headshot_kill"}}
[2022-04-19 09:56:06.809 PM] {"info":{"match_info":{"location":{"x":"122","y":"-17","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:06.945 PM] {"info":{"me":{"inventory_1":{"name":"unknown_122","amount":"40"}}},"feature":"inventory"}
[2022-04-19 09:56:06.950 PM] {"info":{"me":{"inventory_2":{"name":"unknown_121","amount":"60"}}},"feature":"inventory"}
[2022-04-19 09:56:06.954 PM] {"info":{"me":{"inventory_3":{"name":"unknown_121","amount":"18"}}},"feature":"inventory"}
[2022-04-19 09:56:06.959 PM] {"info":{"me":{"inventory_4":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:06.965 PM] {"info":{"me":{"inventory_6":{"name":"unknown_191","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:06.970 PM] {"info":{"me":{"inventory_7":{"name":"unknown_213","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:06.974 PM] {"info":{"me":{"inventory_8":{"name":"unknown_226","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:06.999 PM] {"info":{"me":{"weapons":{"weapon0":"P2020","weapon1":"Triple Take"}}},"feature":"inventory"}
[2022-04-19 09:56:07.037 PM] {"info":{"me":{"inUse":{"inUse":"Triple Take"}}},"feature":"inventory"}
[2022-04-19 09:56:07.310 PM] {"info":{"match_info":{"location":{"x":"121","y":"-18","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:07.561 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:56:07.812 PM] {"info":{"match_info":{"location":{"x":"122","y":"-19","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:08.311 PM] {"info":{"match_info":{"location":{"x":"122","y":"-20","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:08.812 PM] {"info":{"match_info":{"location":{"x":"123","y":"-22","z":"-36"}}},"feature":"location"}
[2022-04-19 09:56:09.308 PM] {"info":{"match_info":{"location":{"x":"125","y":"-22","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:09.500 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":20,"players":55,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:56:09.577 PM] {"info":{"me":{"inUse":{"inUse":"Triple Take"}}},"feature":"inventory"}
[2022-04-19 09:56:09.764 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BOH] Zamblar","victimName":"[RAGE] LazyWhisper1","weaponName":"mozambique","action":"headshot_kill"}}
[2022-04-19 09:56:09.811 PM] {"info":{"match_info":{"location":{"x":"126","y":"-22","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:10.189 PM] {"info":{"match_info":{"roster_2":null}},"feature":"roster"}
[2022-04-19 09:56:10.308 PM] {"info":{"match_info":{"location":{"x":"127","y":"-22","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:10.811 PM] {"info":{"match_info":{"location":{"x":"129","y":"-22","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:11.307 PM] {"info":{"match_info":{"location":{"x":"131","y":"-22","z":"-36"}}},"feature":"location"}
[2022-04-19 09:56:11.809 PM] {"info":{"match_info":{"location":{"x":"132","y":"-21","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:12.808 PM] {"info":{"match_info":{"location":{"x":"133","y":"-21","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:13.744 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":19,"players":54,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:56:13.764 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"Octane5839","victimName":" PapaJPowell","weaponName":"eva8","action":"headshot_kill"}}
[2022-04-19 09:56:14.310 PM] {"info":{"match_info":{"location":{"x":"133","y":"-20","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:14.414 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"10"}}},"feature":"me"}
[2022-04-19 09:56:17.308 PM] {"info":{"match_info":{"location":{"x":"132","y":"-20","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:17.742 PM] {"info":{"match_info":{"roster_17":null}},"feature":"roster"}
[2022-04-19 09:56:17.808 PM] {"info":{"match_info":{"location":{"x":"133","y":"-19","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:20.810 PM] {"info":{"match_info":{"location":{"x":"133","y":"-18","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:23.335 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:56:23.417 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"15"}}},"feature":"me"}
[2022-04-19 09:56:23.811 PM] {"info":{"match_info":{"location":{"x":"133","y":"-20","z":"-37"}}},"feature":"location"}
[2022-04-19 09:56:24.311 PM] {"info":{"match_info":{"location":{"x":"133","y":"-22","z":"-38"}}},"feature":"location"}
[2022-04-19 09:56:24.808 PM] {"info":{"match_info":{"location":{"x":"132","y":"-24","z":"-39"}}},"feature":"location"}
[2022-04-19 09:56:25.314 PM] {"info":{"match_info":{"location":{"x":"131","y":"-23","z":"-39"}}},"feature":"location"}
[2022-04-19 09:56:25.807 PM] {"info":{"match_info":{"location":{"x":"130","y":"-22","z":"-40"}}},"feature":"location"}
[2022-04-19 09:56:26.134 PM] {"info":{"me":{"inUse":{"inUse":"P2020"}}},"feature":"inventory"}
[2022-04-19 09:56:26.311 PM] {"info":{"match_info":{"location":{"x":"128","y":"-20","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:26.940 PM] {"info":{"match_info":{"roster_15":null}},"feature":"roster"}
[2022-04-19 09:56:27.310 PM] {"info":{"match_info":{"location":{"x":"128","y":"-21","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:27.643 PM] {"info":{"me":{"weapons":{"weapon0":"C.A.R. SMG","weapon1":"Triple Take"}}},"feature":"inventory"}
[2022-04-19 09:56:27.650 PM] {"info":{"me":{"inventory_0":{"name":"unknown_124","amount":"18"}}},"feature":"inventory"}
[2022-04-19 09:56:27.655 PM] {"info":{"me":{"inventory_3":{"name":"unknown_121","amount":"20"}}},"feature":"inventory"}
[2022-04-19 09:56:27.659 PM] {"info":{"me":{"inventory_8":null}},"feature":"inventory"}
[2022-04-19 09:56:27.679 PM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-19 09:56:27.737 PM] {"info":{"me":{"inUse":{"inUse":"Triple Take"}}},"feature":"inventory"}
[2022-04-19 09:56:27.812 PM] {"info":{"match_info":{"location":{"x":"128","y":"-22","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:28.309 PM] {"info":{"match_info":{"location":{"x":"129","y":"-21","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:28.808 PM] {"info":{"match_info":{"location":{"x":"129","y":"-22","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:29.311 PM] {"info":{"match_info":{"location":{"x":"130","y":"-22","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:29.358 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:56:29.810 PM] {"info":{"match_info":{"location":{"x":"129","y":"-20","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:30.267 PM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-19 09:56:30.309 PM] {"info":{"match_info":{"location":{"x":"129","y":"-19","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:30.810 PM] {"info":{"match_info":{"location":{"x":"129","y":"-18","z":"-40"}}},"feature":"location"}
[2022-04-19 09:56:31.308 PM] {"info":{"match_info":{"location":{"x":"129","y":"-18","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:31.809 PM] {"info":{"match_info":{"location":{"x":"129","y":"-19","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:31.938 PM] {"info":{"me":{"inventory_5":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:31.944 PM] {"info":{"me":{"inventory_7":{"name":"unknown_191","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:31.949 PM] {"info":{"me":{"inventory_8":{"name":"unknown_213","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:32.308 PM] {"info":{"match_info":{"location":{"x":"130","y":"-19","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:32.336 PM] {"info":{"me":{"inventory_8":{"name":"unknown_190","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:32.342 PM] {"info":{"me":{"inventory_9":{"name":"unknown_213","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:32.415 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"20"}}},"feature":"me"}
[2022-04-19 09:56:32.811 PM] {"info":{"match_info":{"location":{"x":"131","y":"-19","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:32.940 PM] {"info":{"me":{"inventory_3":{"name":"unknown_121","amount":"60"}}},"feature":"inventory"}
[2022-04-19 09:56:33.768 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[FMBJ] Hensuki","victimName":"[MINT] seniorcornsmut","weaponName":"lstar","action":"knockdown"}}
[2022-04-19 09:56:33.808 PM] {"info":{"match_info":{"location":{"x":"130","y":"-19","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:34.342 PM] {"info":{"me":{"inventory_9":null}},"feature":"inventory"}
[2022-04-19 09:56:36.812 PM] {"info":{"match_info":{"location":{"x":"130","y":"-18","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:37.309 PM] {"info":{"match_info":{"location":{"x":"131","y":"-19","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:37.333 PM] {"info":{"me":{"inventory_0":{"name":"unknown_124","amount":"13"}}},"feature":"inventory"}
[2022-04-19 09:56:37.763 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" chorizo3389","victimName":" msys","weaponName":"r97","action":"knockdown"}}
[2022-04-19 09:56:38.192 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":19,"players":53,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:56:38.199 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:56:38.265 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BOH] Zamblar","victimName":"[RAGE] achillesheelys","weaponName":"rui/ordnance_icons/grenade_incendiary","action":"kill"}}
[2022-04-19 09:56:38.309 PM] {"info":{"match_info":{"location":{"x":"132","y":"-18","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:38.693 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":18,"players":52,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:56:38.766 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Daikimei","victimName":"[RAGE] DEDSTATIK","weaponName":null,"action":"kill"}}
[2022-04-19 09:56:38.811 PM] {"info":{"match_info":{"location":{"x":"132","y":"-17","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:39.307 PM] {"info":{"match_info":{"location":{"x":"132","y":"-16","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:39.809 PM] {"info":{"match_info":{"location":{"x":"131","y":"-15","z":"-40"}}},"feature":"location"}
[2022-04-19 09:56:40.308 PM] {"info":{"match_info":{"location":{"x":"130","y":"-13","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:40.808 PM] {"info":{"match_info":{"location":{"x":"131","y":"-12","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:40.840 PM] {"info":{"me":{"inventory_4":{"name":"unknown_121","amount":"60"}}},"feature":"inventory"}
[2022-04-19 09:56:40.848 PM] {"info":{"me":{"inventory_6":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:40.855 PM] {"info":{"me":{"inventory_8":{"name":"unknown_191","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:40.861 PM] {"info":{"me":{"inventory_9":{"name":"unknown_190","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:56:41.310 PM] {"info":{"match_info":{"location":{"x":"132","y":"-13","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:41.419 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"25"}}},"feature":"me"}
[2022-04-19 09:56:41.440 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":18,"players":51,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:56:41.483 PM] {"info":{"me":{"inUse":{"inUse":"Triple Take"}}},"feature":"inventory"}
[2022-04-19 09:56:41.768 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" BUBBA","victimName":" msys","weaponName":"wingman","action":"kill"}}
[2022-04-19 09:56:42.810 PM] {"info":{"match_info":{"location":{"x":"132","y":"-14","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:42.840 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:56:43.310 PM] {"info":{"match_info":{"location":{"x":"132","y":"-15","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:43.743 PM] {"info":{"match_info":{"roster_37":null}},"feature":"roster"}
[2022-04-19 09:56:43.809 PM] {"info":{"match_info":{"location":{"x":"132","y":"-17","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:44.265 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[xiv] peen_machine420","victimName":"[LADY] 三菜一汤","weaponName":"mozambique","action":"knockdown"}}
[2022-04-19 09:56:44.293 PM] {"info":{"match_info":{"roster_26":null}},"feature":"roster"}
[2022-04-19 09:56:44.310 PM] {"info":{"match_info":{"location":{"x":"132","y":"-18","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:44.813 PM] {"info":{"match_info":{"location":{"x":"131","y":"-19","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:45.310 PM] {"info":{"match_info":{"location":{"x":"130","y":"-20","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:45.808 PM] {"info":{"match_info":{"location":{"x":"130","y":"-21","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:45.936 PM] {"info":{"match_info":{"roster_6":null}},"feature":"roster"}
[2022-04-19 09:56:46.310 PM] {"info":{"match_info":{"location":{"x":"129","y":"-22","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:46.808 PM] {"info":{"match_info":{"location":{"x":"129","y":"-24","z":"-40"}}},"feature":"location"}
[2022-04-19 09:56:47.309 PM] {"info":{"match_info":{"location":{"x":"130","y":"-23","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:47.532 PM] {"info":{"me":{"inUse":{"inUse":"Triple Take"}}},"feature":"inventory"}
[2022-04-19 09:56:47.809 PM] {"info":{"match_info":{"location":{"x":"131","y":"-23","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:48.244 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":18,"players":50,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:56:48.267 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[xiv] IMrcud","victimName":"[LADY] 三菜一汤","weaponName":"wingman","action":"kill"}}
[2022-04-19 09:56:48.309 PM] {"info":{"match_info":{"location":{"x":"132","y":"-23","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:49.309 PM] {"info":{"match_info":{"location":{"x":"133","y":"-23","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:49.809 PM] {"info":{"match_info":{"location":{"x":"133","y":"-22","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:50.422 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"30"}}},"feature":"me"}
[2022-04-19 09:56:50.808 PM] {"info":{"match_info":{"location":{"x":"134","y":"-22","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:51.143 PM] {"info":{"match_info":{"roster_43":null}},"feature":"roster"}
[2022-04-19 09:56:51.538 PM] {"info":{"match_info":{"roster_21":null}},"feature":"roster"}
[2022-04-19 09:56:52.809 PM] {"info":{"match_info":{"location":{"x":"134","y":"-21","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:53.112 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:56:53.311 PM] {"info":{"match_info":{"location":{"x":"135","y":"-22","z":"-41"}}},"feature":"location"}
[2022-04-19 09:56:53.492 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":18,"players":49,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:56:53.768 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[FMBJ] Hensuki","victimName":"[MINT] seniorcornsmut","weaponName":null,"action":"kill"}}
[2022-04-19 09:56:53.807 PM] {"info":{"match_info":{"location":{"x":"136","y":"-22","z":"-43"}}},"feature":"location"}
[2022-04-19 09:56:54.308 PM] {"info":{"match_info":{"location":{"x":"137","y":"-22","z":"-47"}}},"feature":"location"}
[2022-04-19 09:56:55.308 PM] {"info":{"match_info":{"location":{"x":"138","y":"-22","z":"-47"}}},"feature":"location"}
[2022-04-19 09:56:55.811 PM] {"info":{"match_info":{"location":{"x":"139","y":"-23","z":"-47"}}},"feature":"location"}
[2022-04-19 09:56:56.308 PM] {"info":{"match_info":{"location":{"x":"139","y":"-24","z":"-47"}}},"feature":"location"}
[2022-04-19 09:56:56.674 PM] {"info":{"me":{"inUse":{"inUse":"Triple Take"}}},"feature":"inventory"}
[2022-04-19 09:56:56.811 PM] {"info":{"match_info":{"location":{"x":"139","y":"-26","z":"-47"}}},"feature":"location"}
[2022-04-19 09:56:57.309 PM] {"info":{"match_info":{"location":{"x":"139","y":"-28","z":"-46"}}},"feature":"location"}
[2022-04-19 09:56:57.808 PM] {"info":{"match_info":{"location":{"x":"139","y":"-29","z":"-47"}}},"feature":"location"}
[2022-04-19 09:56:58.243 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:56:58.311 PM] {"info":{"match_info":{"location":{"x":"140","y":"-30","z":"-47"}}},"feature":"location"}
[2022-04-19 09:56:58.768 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Bobo] Chumpattie","victimName":"[xiv] IMrcud","weaponName":"mozambique","action":"knockdown"}}
[2022-04-19 09:56:58.809 PM] {"info":{"match_info":{"location":{"x":"140","y":"-32","z":"-46"}}},"feature":"location"}
[2022-04-19 09:56:59.112 PM] {"info":{"me":{"inUse":{"inUse":"Triple Take"}}},"feature":"inventory"}
[2022-04-19 09:56:59.311 PM] {"info":{"match_info":{"location":{"x":"141","y":"-33","z":"-47"}}},"feature":"location"}
[2022-04-19 09:56:59.807 PM] {"info":{"match_info":{"location":{"x":"141","y":"-34","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:00.309 PM] {"info":{"match_info":{"location":{"x":"141","y":"-33","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:00.421 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"35"}}},"feature":"me"}
[2022-04-19 09:57:01.765 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[KTAR] eitak","victimName":"[FEET] Onastraz","weaponName":"prowler","action":"knockdown"}}
[2022-04-19 09:57:02.263 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" breakerx2x","victimName":"[999J] D3ATHSTROKE4720","weaponName":"peacekeeper","action":"knockdown"}}
[2022-04-19 09:57:02.309 PM] {"info":{"match_info":{"location":{"x":"140","y":"-33","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:02.808 PM] {"info":{"match_info":{"location":{"x":"141","y":"-33","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:03.627 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:57:03.810 PM] {"info":{"match_info":{"location":{"x":"142","y":"-34","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:04.307 PM] {"info":{"match_info":{"location":{"x":"144","y":"-34","z":"-48"}}},"feature":"location"}
[2022-04-19 09:57:04.809 PM] {"info":{"match_info":{"location":{"x":"145","y":"-35","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:05.265 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Gayb] Nitrogen Peroxide","victimName":"[Bobo] Chumpattie","weaponName":"eva8","action":"knockdown"}}
[2022-04-19 09:57:05.311 PM] {"info":{"match_info":{"location":{"x":"147","y":"-35","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:05.807 PM] {"info":{"match_info":{"location":{"x":"150","y":"-36","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:06.185 PM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-19 09:57:06.310 PM] {"info":{"match_info":{"location":{"x":"152","y":"-37","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:06.811 PM] {"info":{"match_info":{"location":{"x":"153","y":"-38","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:07.311 PM] {"info":{"match_info":{"location":{"x":"154","y":"-38","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:07.636 PM] {"info":{"me":{"inventory_0":{"name":"unknown_124","amount":"40"}}},"feature":"inventory"}
[2022-04-19 09:57:07.812 PM] {"info":{"match_info":{"location":{"x":"155","y":"-39","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:08.308 PM] {"info":{"match_info":{"location":{"x":"156","y":"-40","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:08.423 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"40"}}},"feature":"me"}
[2022-04-19 09:57:08.789 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":18,"players":48,"damage":0,"cash":10}}},"feature":"match_info"}
[2022-04-19 09:57:08.808 PM] {"info":{"match_info":{"location":{"x":"157","y":"-40","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:09.268 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" Hayoh332","victimName":"[999J] D3ATHSTROKE4720","weaponName":"wingman","action":"kill"}}
[2022-04-19 09:57:09.308 PM] {"info":{"match_info":{"location":{"x":"157","y":"-40","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:09.811 PM] {"info":{"match_info":{"location":{"x":"158","y":"-41","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:10.312 PM] {"info":{"match_info":{"location":{"x":"159","y":"-41","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:10.808 PM] {"info":{"match_info":{"location":{"x":"160","y":"-42","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:10.843 PM] {"info":{"me":{"inventory_4":{"name":"unknown_121","amount":"33"}}},"feature":"inventory"}
[2022-04-19 09:57:11.309 PM] {"info":{"match_info":{"location":{"x":"162","y":"-43","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:11.810 PM] {"info":{"match_info":{"location":{"x":"163","y":"-44","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:12.433 PM] {"info":{"me":{"inventory_0":{"name":"unknown_124","amount":"60"}}},"feature":"inventory"}
[2022-04-19 09:57:12.736 PM] {"info":{"me":{"inventory_4":{"name":"unknown_121","amount":"53"}}},"feature":"inventory"}
[2022-04-19 09:57:12.810 PM] {"info":{"match_info":{"location":{"x":"164","y":"-45","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:13.812 PM] {"info":{"match_info":{"location":{"x":"164","y":"-46","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:14.308 PM] {"info":{"match_info":{"location":{"x":"164","y":"-45","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:14.811 PM] {"info":{"match_info":{"location":{"x":"164","y":"-46","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:15.309 PM] {"info":{"match_info":{"location":{"x":"165","y":"-46","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:15.330 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:57:15.809 PM] {"info":{"match_info":{"location":{"x":"166","y":"-47","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:16.312 PM] {"info":{"match_info":{"location":{"x":"168","y":"-47","z":"-48"}}},"feature":"location"}
[2022-04-19 09:57:16.811 PM] {"info":{"match_info":{"location":{"x":"170","y":"-47","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:17.309 PM] {"info":{"match_info":{"location":{"x":"171","y":"-47","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:17.811 PM] {"info":{"match_info":{"location":{"x":"173","y":"-46","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:17.839 PM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-19 09:57:18.308 PM] {"info":{"match_info":{"location":{"x":"174","y":"-46","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:18.421 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"45"}}},"feature":"me"}
[2022-04-19 09:57:18.807 PM] {"info":{"match_info":{"location":{"x":"174","y":"-47","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:19.263 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"10.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:19.270 PM] {"info":{"me":{"totalDamageDealt":"10"}},"feature":"damage"}
[2022-04-19 09:57:19.286 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":18,"players":48,"damage":10,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:19.309 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"10.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:19.315 PM] {"info":{"me":{"totalDamageDealt":"20"}},"feature":"damage"}
[2022-04-19 09:57:19.336 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":18,"players":48,"damage":20,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:20.016 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:20.023 PM] {"info":{"me":{"totalDamageDealt":"33"}},"feature":"damage"}
[2022-04-19 09:57:20.040 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":18,"players":48,"damage":33,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:20.804 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":17,"players":47,"damage":33,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:20.812 PM] {"info":{"match_info":{"location":{"x":"174","y":"-46","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:21.266 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Dady] bald dingus","victimName":"[MONK] Jakequake","weaponName":"prowler","action":"knockdown"}}
[2022-04-19 09:57:21.273 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" breakerx2x","victimName":" NOHLogiic","weaponName":"peacekeeper","action":"kill"}}
[2022-04-19 09:57:21.310 PM] {"info":{"match_info":{"location":{"x":"175","y":"-45","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:21.838 PM] {"info":{"me":{"inventory_4":{"name":"unknown_121","amount":"30"}}},"feature":"inventory"}
[2022-04-19 09:57:22.312 PM] {"info":{"match_info":{"location":{"x":"175","y":"-44","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:22.762 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Dady] WiggleDong","victimName":"[MONK] Chorgi","weaponName":"r97","action":"knockdown"}}
[2022-04-19 09:57:22.809 PM] {"info":{"match_info":{"location":{"x":"176","y":"-45","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:23.311 PM] {"info":{"match_info":{"location":{"x":"175","y":"-44","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:23.809 PM] {"info":{"match_info":{"location":{"x":"175","y":"-43","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:24.309 PM] {"info":{"match_info":{"location":{"x":"174","y":"-42","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:24.763 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[gem] Germy Enjoyer","victimName":"[KTAR] Syruphi","weaponName":"mastiff","action":"knockdown"}}
[2022-04-19 09:57:24.808 PM] {"info":{"match_info":{"location":{"x":"174","y":"-41","z":"-48"}}},"feature":"location"}
[2022-04-19 09:57:24.871 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:57:25.239 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":17,"players":46,"damage":33,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:25.266 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Dady] bald dingus","victimName":"[MONK] Jakequake","weaponName":"prowler","action":"kill"}}
[2022-04-19 09:57:25.309 PM] {"info":{"match_info":{"location":{"x":"174","y":"-40","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:25.811 PM] {"info":{"match_info":{"location":{"x":"174","y":"-39","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:26.309 PM] {"info":{"match_info":{"location":{"x":"174","y":"-41","z":"-48"}}},"feature":"location"}
[2022-04-19 09:57:26.427 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"50"}}},"feature":"me"}
[2022-04-19 09:57:26.812 PM] {"info":{"match_info":{"location":{"x":"175","y":"-43","z":"-48"}}},"feature":"location"}
[2022-04-19 09:57:27.040 PM] {"info":{"match_info":{"roster_40":null}},"feature":"roster"}
[2022-04-19 09:57:27.312 PM] {"info":{"match_info":{"location":{"x":"174","y":"-45","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:27.810 PM] {"info":{"match_info":{"location":{"x":"175","y":"-45","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:28.311 PM] {"info":{"match_info":{"location":{"x":"176","y":"-45","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:28.812 PM] {"info":{"match_info":{"location":{"x":"177","y":"-46","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:29.312 PM] {"info":{"match_info":{"location":{"x":"178","y":"-46","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:29.809 PM] {"info":{"match_info":{"location":{"x":"179","y":"-47","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:30.266 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[KTAR] eitak","victimName":"[gem] Germy Enjoyer","weaponName":"prowler","action":"knockdown"}}
[2022-04-19 09:57:30.312 PM] {"info":{"match_info":{"location":{"x":"181","y":"-48","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:30.589 PM] {"info":{"match_info":{"roster_53":null}},"feature":"roster"}
[2022-04-19 09:57:30.811 PM] {"info":{"match_info":{"location":{"x":"183","y":"-48","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:31.767 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"Wraith8987","victimName":"[Dady] BigMusclySweatyBlackMenForJesus","weaponName":"dragon","action":"knockdown"}}
[2022-04-19 09:57:31.789 PM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-19 09:57:31.807 PM] {"info":{"match_info":{"location":{"x":"184","y":"-49","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:32.311 PM] {"info":{"match_info":{"location":{"x":"185","y":"-50","z":"-48"}}},"feature":"location"}
[2022-04-19 09:57:32.808 PM] {"info":{"match_info":{"location":{"x":"186","y":"-50","z":"-48"}}},"feature":"location"}
[2022-04-19 09:57:32.922 PM] {"info":{"me":{"inUse":{"inUse":"Frag Grenade"}}},"feature":"inventory"}
[2022-04-19 09:57:33.312 PM] {"info":{"match_info":{"location":{"x":"187","y":"-50","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:33.812 PM] {"info":{"match_info":{"location":{"x":"188","y":"-50","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:33.924 PM] {"info":{"me":{"inventory_8":{"name":"unknown_190","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:57:33.931 PM] {"info":{"me":{"inventory_9":null}},"feature":"inventory"}
[2022-04-19 09:57:34.312 PM] {"info":{"match_info":{"location":{"x":"187","y":"-50","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:34.538 PM] {"info":{"match_info":{"roster_58":null}},"feature":"roster"}
[2022-04-19 09:57:35.311 PM] {"info":{"match_info":{"location":{"x":"188","y":"-51","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:35.426 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"55"}}},"feature":"me"}
[2022-04-19 09:57:35.535 PM] {"info":{"match_info":{"teammate_0":{"name":"SDCore.Tv","state":"knocked_out"}}},"feature":"team"}
[2022-04-19 09:57:35.542 PM] {"info":{"match_info":{"roster_23":{"name":"SDCore.Tv","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"knocked_out","is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:57:35.719 PM] {"info":{"me":{"inventory_7":{"name":"unknown_190","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:57:35.727 PM] {"info":{"me":{"inventory_8":null}},"feature":"inventory"}
[2022-04-19 09:57:35.764 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[MNYB] TheBigBadPiggy","victimName":"[tohT] SDCore.Tv","weaponName":"car","action":"knockdown"}}
[2022-04-19 09:57:36.069 PM] {"info":{"me":{"inUse":{"inUse":"Arc Star"}}},"feature":"inventory"}
[2022-04-19 09:57:36.308 PM] {"info":{"match_info":{"location":{"x":"188","y":"-51","z":"-46"}}},"feature":"location"}
[2022-04-19 09:57:36.811 PM] {"info":{"match_info":{"location":{"x":"189","y":"-51","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:37.308 PM] {"info":{"match_info":{"location":{"x":"190","y":"-51","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:37.517 PM] {"info":{"me":{"inventory_6":{"name":"unknown_190","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:57:37.525 PM] {"info":{"me":{"inventory_7":null}},"feature":"inventory"}
[2022-04-19 09:57:37.807 PM] {"info":{"match_info":{"location":{"x":"191","y":"-51","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:38.310 PM] {"info":{"match_info":{"location":{"x":"192","y":"-50","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:38.489 PM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-19 09:57:38.813 PM] {"info":{"match_info":{"location":{"x":"193","y":"-49","z":"-46"}}},"feature":"location"}
[2022-04-19 09:57:39.811 PM] {"info":{"match_info":{"location":{"x":"193","y":"-48","z":"-46"}}},"feature":"location"}
[2022-04-19 09:57:40.628 PM] {"info":{"me":{"inUse":{"inUse":"mp_weapon_bangalore_heirloom_primary"}}},"feature":"inventory"}
[2022-04-19 09:57:40.808 PM] {"info":{"match_info":{"location":{"x":"193","y":"-47","z":"-46"}}},"feature":"location"}
[2022-04-19 09:57:41.307 PM] {"info":{"match_info":{"location":{"x":"192","y":"-46","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:41.589 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":17,"players":45,"damage":33,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:41.690 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":16,"players":44,"damage":33,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:41.765 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[gem] Germy Enjoyer","victimName":"[KTAR] Syruphi","weaponName":null,"action":"kill"}}
[2022-04-19 09:57:41.775 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Fate] Iwaxumin","victimName":"[KTAR] eitak","weaponName":"r45","action":"headshot_kill"}}
[2022-04-19 09:57:41.812 PM] {"info":{"match_info":{"location":{"x":"193","y":"-45","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:42.307 PM] {"info":{"match_info":{"location":{"x":"193","y":"-44","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:42.487 PM] {"info":{"match_info":{"roster_29":{"name":"Fishlyne","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"knocked_out","is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:57:42.495 PM] {"info":{"match_info":{"teammate_2":{"name":"Fishlyne","state":"knocked_out"}}},"feature":"team"}
[2022-04-19 09:57:42.763 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[MNYB] BugSmuggler","victimName":" Fishlyne","weaponName":"r301","action":"knockdown"}}
[2022-04-19 09:57:42.810 PM] {"info":{"match_info":{"location":{"x":"194","y":"-42","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:43.310 PM] {"info":{"match_info":{"location":{"x":"194","y":"-40","z":"-46"}}},"feature":"location"}
[2022-04-19 09:57:43.748 PM] {"info":{"me":{"inUse":{"inUse":"C.A.R. SMG"}}},"feature":"inventory"}
[2022-04-19 09:57:43.810 PM] {"info":{"match_info":{"location":{"x":"193","y":"-39","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:44.094 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":16,"players":43,"damage":33,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:44.102 PM] {"info":{"match_info":{"teammate_0":{"name":"SDCore.Tv","state":"death"}}},"feature":"team"}
[2022-04-19 09:57:44.110 PM] {"info":{"match_info":{"roster_23":{"name":"SDCore.Tv","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:57:44.262 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":" All Kool no Aid","victimName":"[tohT] SDCore.Tv","weaponName":"wingman","action":"kill"}}
[2022-04-19 09:57:44.310 PM] {"info":{"match_info":{"location":{"x":"192","y":"-37","z":"-48"}}},"feature":"location"}
[2022-04-19 09:57:44.426 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"60"}}},"feature":"me"}
[2022-04-19 09:57:44.810 PM] {"info":{"match_info":{"location":{"x":"192","y":"-36","z":"-47"}}},"feature":"location"}
[2022-04-19 09:57:45.188 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":16,"players":42,"damage":33,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:45.264 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Dady] WiggleDong","victimName":"Wraith8987","weaponName":"hemlock","action":"kill"}}
[2022-04-19 09:57:45.308 PM] {"info":{"match_info":{"location":{"x":"192","y":"-34","z":"-49"}}},"feature":"location"}
[2022-04-19 09:57:45.490 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":41,"damage":33,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:45.762 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Dady] WiggleDong","victimName":"[MONK] Chorgi","weaponName":null,"action":"kill"}}
[2022-04-19 09:57:45.806 PM] {"info":{"match_info":{"location":{"x":"192","y":"-33","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:46.308 PM] {"info":{"match_info":{"location":{"x":"193","y":"-33","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:46.806 PM] {"info":{"match_info":{"location":{"x":"193","y":"-34","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:47.310 PM] {"info":{"match_info":{"location":{"x":"194","y":"-33","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:47.385 PM] {"info":{"match_info":{"teammate_0":null}},"feature":"team"}
[2022-04-19 09:57:47.394 PM] {"info":{"match_info":{"roster_23":null}},"feature":"roster"}
[2022-04-19 09:57:47.958 PM] {"name":"damage","data":{"targetName":"All Kool no Aid","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:47.967 PM] {"info":{"me":{"totalDamageDealt":"46"}},"feature":"damage"}
[2022-04-19 09:57:47.976 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":41,"damage":46,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:48.006 PM] {"name":"damage","data":{"targetName":"All Kool no Aid","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:48.014 PM] {"info":{"me":{"totalDamageDealt":"59"}},"feature":"damage"}
[2022-04-19 09:57:48.023 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":41,"damage":59,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:48.256 PM] {"name":"damage","data":{"targetName":"All Kool no Aid","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:48.265 PM] {"info":{"me":{"totalDamageDealt":"72"}},"feature":"damage"}
[2022-04-19 09:57:48.274 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":41,"damage":72,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:48.307 PM] {"info":{"match_info":{"location":{"x":"193","y":"-33","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:48.763 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[YAGO] 10q","victimName":"[BRep] honey NUT cheerios","weaponName":"car","action":"knockdown"}}
[2022-04-19 09:57:48.809 PM] {"info":{"match_info":{"location":{"x":"192","y":"-32","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:49.109 PM] {"name":"damage","data":{"targetName":"BugSmuggler","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:49.118 PM] {"info":{"me":{"totalDamageDealt":"85"}},"feature":"damage"}
[2022-04-19 09:57:49.126 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":41,"damage":85,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:49.137 PM] {"info":{"match_info":{"roster_46":null}},"feature":"roster"}
[2022-04-19 09:57:49.307 PM] {"info":{"match_info":{"location":{"x":"192","y":"-31","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:49.763 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[BRep] MrMoby1","victimName":"[BOH] Zamblar","weaponName":"prowler","action":"knockdown"}}
[2022-04-19 09:57:49.810 PM] {"info":{"match_info":{"location":{"x":"193","y":"-31","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:49.839 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":85,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:49.849 PM] {"info":{"match_info":{"roster_57":null}},"feature":"roster"}
[2022-04-19 09:57:50.309 PM] {"info":{"match_info":{"location":{"x":"194","y":"-29","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:50.722 PM] {"info":{"me":{"inventory_4":{"name":"unknown_121","amount":"5"}}},"feature":"inventory"}
[2022-04-19 09:57:50.810 PM] {"info":{"match_info":{"location":{"x":"196","y":"-28","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:51.308 PM] {"info":{"match_info":{"location":{"x":"197","y":"-28","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:51.412 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:51.421 PM] {"info":{"me":{"totalDamageDealt":"98"}},"feature":"damage"}
[2022-04-19 09:57:51.429 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":98,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:51.757 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:51.766 PM] {"info":{"me":{"totalDamageDealt":"111"}},"feature":"damage"}
[2022-04-19 09:57:51.774 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":111,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:51.810 PM] {"info":{"match_info":{"location":{"x":"196","y":"-28","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:51.818 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:51.826 PM] {"info":{"me":{"totalDamageDealt":"124"}},"feature":"damage"}
[2022-04-19 09:57:51.834 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":124,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:51.888 PM] {"info":{"match_info":{"roster_35":null}},"feature":"roster"}
[2022-04-19 09:57:52.057 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"18.000000","armor":true,"headshot":true}}
[2022-04-19 09:57:52.067 PM] {"info":{"me":{"totalDamageDealt":"142"}},"feature":"damage"}
[2022-04-19 09:57:52.075 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":142,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:52.159 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"13.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:52.169 PM] {"info":{"me":{"totalDamageDealt":"155"}},"feature":"damage"}
[2022-04-19 09:57:52.177 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":155,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:52.311 PM] {"info":{"match_info":{"location":{"x":"195","y":"-28","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:52.812 PM] {"info":{"match_info":{"location":{"x":"195","y":"-29","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:53.289 PM] {"info":{"match_info":{"roster_22":null}},"feature":"roster"}
[2022-04-19 09:57:53.313 PM] {"info":{"match_info":{"location":{"x":"194","y":"-30","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:53.808 PM] {"info":{"match_info":{"location":{"x":"192","y":"-31","z":"-50"}}},"feature":"location"}
[2022-04-19 09:57:53.935 PM] {"info":{"me":{"inventory_3":{"name":"unknown_121","amount":"41"}}},"feature":"inventory"}
[2022-04-19 09:57:53.944 PM] {"info":{"me":{"inventory_4":{"name":"unknown_192","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:57:53.953 PM] {"info":{"me":{"inventory_5":{"name":"unknown_190","amount":"1"}}},"feature":"inventory"}
[2022-04-19 09:57:53.962 PM] {"info":{"me":{"inventory_6":null}},"feature":"inventory"}
[2022-04-19 09:57:54.307 PM] {"info":{"match_info":{"location":{"x":"190","y":"-32","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:54.428 PM] {"info":{"me":{"ultimate_cooldown":{"ultimate_cooldown":"65"}}},"feature":"me"}
[2022-04-19 09:57:54.456 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"5.000000","armor":true,"headshot":false}}
[2022-04-19 09:57:54.466 PM] {"info":{"me":{"totalDamageDealt":"160"}},"feature":"damage"}
[2022-04-19 09:57:54.476 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"8.000000","armor":false,"headshot":false}}
[2022-04-19 09:57:54.485 PM] {"info":{"me":{"totalDamageDealt":"168"}},"feature":"damage"}
[2022-04-19 09:57:54.496 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":168,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:54.636 PM] {"info":{"match_info":{"roster_10":null}},"feature":"roster"}
[2022-04-19 09:57:54.705 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-19 09:57:54.715 PM] {"info":{"me":{"totalDamageDealt":"181"}},"feature":"damage"}
[2022-04-19 09:57:54.730 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":181,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:54.758 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-19 09:57:54.767 PM] {"info":{"me":{"totalDamageDealt":"194"}},"feature":"damage"}
[2022-04-19 09:57:54.785 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":194,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:54.806 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"13.000000","armor":false,"headshot":false}}
[2022-04-19 09:57:54.815 PM] {"info":{"me":{"totalDamageDealt":"207"}},"feature":"damage"}
[2022-04-19 09:57:54.825 PM] {"info":{"match_info":{"location":{"x":"190","y":"-33","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:54.838 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":207,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:54.914 PM] {"name":"damage","data":{"targetName":"TheBigBadPiggy","damageAmount":"18.000000","armor":false,"headshot":true}}
[2022-04-19 09:57:54.923 PM] {"info":{"me":{"totalDamageDealt":"225"}},"feature":"damage"}
[2022-04-19 09:57:54.934 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":15,"players":40,"damage":225,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:55.309 PM] {"info":{"match_info":{"location":{"x":"190","y":"-32","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:55.585 PM] {"info":{"match_info":{"roster_55":null}},"feature":"roster"}
[2022-04-19 09:57:55.636 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":14,"players":39,"damage":225,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:55.766 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[Gayb] Nitrogen Peroxide","victimName":" ScIy","weaponName":"prowler","action":"kill"}}
[2022-04-19 09:57:55.776 PM] {"name":"kill_feed","data":{"local_player_name":"MasterKriff","attackerName":"[YAGO] 10q","victimName":"[MILK] JagersPine716","weaponName":"charge_rifle","action":"knockdown"}}
[2022-04-19 09:57:55.807 PM] {"info":{"match_info":{"location":{"x":"191","y":"-32","z":"-51"}}},"feature":"location"}
[2022-04-19 09:57:56.289 PM] {"name":"death","data":null}
[2022-04-19 09:57:56.299 PM] {"info":{"match_info":{"tabs":{"kills":0,"assists":0,"spectators":0,"teams":14,"players":38,"damage":225,"cash":40}}},"feature":"match_info"}
[2022-04-19 09:57:56.308 PM] {"info":{"match_info":{"teammate_1":{"name":"MasterKriff","state":"death"}}},"feature":"team"}
[2022-04-19 09:57:56.316 PM] {"info":{"match_info":{"roster_30":{"name":"MasterKriff","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"1"}}},"feature":"roster"}
[2022-04-19 09:57:56.593 PM] {"info":{"match_info":{"teammate_2":{"name":"Fishlyne","state":"death"}}},"feature":"team"}
[2022-04-19 09:57:56.603 PM] {"info":{"match_info":{"roster_29":{"name":"Fishlyne","isTeammate":true,"team_id":13,"platform_hw":2,"platform_sw":7,"state":"death","is_local":"0"}}},"feature":"roster"}
[2022-04-19 09:57:56.611 PM] {"info":{"match_info":{"team_info":{"team_state":"eliminated"}}},"feature":"team"}
[2022-04-19 09:57:56.620 PM] {"info":{"match_info":{"victory":false}},"feature":"rank"}
[2022-04-19 09:57:57.348 PM] {"info":{"match_info":{"match_summary":{"rank":"14","teams":"20","squadKills":"0"}}},"feature":"match_summary"}
[2022-04-19 09:58:04.193 PM] {"info":{"match_info":{"pseudo_match_id":null}},"feature":"match_info"}
[2022-04-19 09:58:04.202 PM] {"info":{"match_info":{"team_info":{"team_state":null}}},"feature":"team"}
[2022-04-19 09:58:04.227 PM] {"name":"match_end","data":null}
[2022-04-19 09:58:04.238 PM] {"info":{"game_info":{"match_state":"inactive"}},"feature":"match_state"}
[2022-04-19 09:58:04.247 PM] {"info":{"match_info":{"location":{"x":"0","y":"0","z":"0"}}},"feature":"location"}
[2022-04-19 09:58:04.255 PM] {"info":{"match_info":{"roster_0":null}},"feature":"roster"}
[2022-04-19 09:58:04.263 PM] {"info":{"match_info":{"roster_1":null}},"feature":"roster"}
[2022-04-19 09:58:04.271 PM] {"info":{"match_info":{"roster_3":null}},"feature":"roster"}
[2022-04-19 09:58:04.278 PM] {"info":{"match_info":{"roster_4":null}},"feature":"roster"}
[2022-04-19 09:58:04.286 PM] {"info":{"match_info":{"roster_5":null}},"feature":"roster"}
[2022-04-19 09:58:04.294 PM] {"info":{"match_info":{"roster_7":null}},"feature":"roster"}
[2022-04-19 09:58:04.301 PM] {"info":{"match_info":{"roster_8":null}},"feature":"roster"}
[2022-04-19 09:58:04.309 PM] {"info":{"match_info":{"roster_9":null}},"feature":"roster"}
[2022-04-19 09:58:04.316 PM] {"info":{"match_info":{"roster_11":null}},"feature":"roster"}
[2022-04-19 09:58:04.324 PM] {"info":{"match_info":{"roster_12":null}},"feature":"roster"}
[2022-04-19 09:58:04.332 PM] {"info":{"match_info":{"roster_18":null}},"feature":"roster"}
[2022-04-19 09:58:04.340 PM] {"info":{"match_info":{"roster_13":null}},"feature":"roster"}
[2022-04-19 09:58:04.348 PM] {"info":{"match_info":{"roster_20":null}},"feature":"roster"}
[2022-04-19 09:58:04.355 PM] {"info":{"match_info":{"roster_24":null}},"feature":"roster"}
[2022-04-19 09:58:04.363 PM] {"info":{"match_info":{"roster_25":null}},"feature":"roster"}
[2022-04-19 09:58:04.370 PM] {"info":{"match_info":{"roster_27":null}},"feature":"roster"}
[2022-04-19 09:58:04.378 PM] {"info":{"match_info":{"roster_28":null}},"feature":"roster"}
[2022-04-19 09:58:04.385 PM] {"info":{"match_info":{"roster_19":null}},"feature":"roster"}
[2022-04-19 09:58:04.393 PM] {"info":{"match_info":{"teammate_2":null}},"feature":"team"}
[2022-04-19 09:58:04.400 PM] {"info":{"match_info":{"roster_29":null}},"feature":"roster"}
[2022-04-19 09:58:04.408 PM] {"info":{"match_info":{"teammate_1":null}},"feature":"team"}
[2022-04-19 09:58:04.415 PM] {"info":{"match_info":{"roster_30":null}},"feature":"roster"}
[2022-04-19 09:58:04.423 PM] {"info":{"match_info":{"roster_31":null}},"feature":"roster"}
[2022-04-19 09:58:04.431 PM] {"info":{"match_info":{"roster_14":null}},"feature":"roster"}
[2022-04-19 09:58:04.438 PM] {"info":{"match_info":{"roster_32":null}},"feature":"roster"}
[2022-04-19 09:58:04.447 PM] {"info":{"match_info":{"roster_33":null}},"feature":"roster"}
[2022-04-19 09:58:04.455 PM] {"info":{"match_info":{"roster_34":null}},"feature":"roster"}
[2022-04-19 09:58:04.463 PM] {"info":{"match_info":{"roster_36":null}},"feature":"roster"}
[2022-04-19 09:58:04.471 PM] {"info":{"match_info":{"roster_38":null}},"feature":"roster"}
[2022-04-19 09:58:04.478 PM] {"info":{"match_info":{"roster_39":null}},"feature":"roster"}
[2022-04-19 09:58:04.486 PM] {"info":{"match_info":{"roster_41":null}},"feature":"roster"}
[2022-04-19 09:58:04.494 PM] {"info":{"match_info":{"roster_42":null}},"feature":"roster"}
[2022-04-19 09:58:04.502 PM] {"info":{"match_info":{"roster_44":null}},"feature":"roster"}
[2022-04-19 09:58:04.509 PM] {"info":{"match_info":{"roster_45":null}},"feature":"roster"}
[2022-04-19 09:58:04.517 PM] {"info":{"match_info":{"roster_47":null}},"feature":"roster"}
[2022-04-19 09:58:04.525 PM] {"info":{"match_info":{"roster_48":null}},"feature":"roster"}
[2022-04-19 09:58:04.533 PM] {"info":{"match_info":{"roster_49":null}},"feature":"roster"}
[2022-04-19 09:58:04.540 PM] {"info":{"match_info":{"roster_50":null}},"feature":"roster"}
[2022-04-19 09:58:04.549 PM] {"info":{"match_info":{"roster_51":null}},"feature":"roster"}
[2022-04-19 09:58:04.557 PM] {"info":{"match_info":{"roster_52":null}},"feature":"roster"}
[2022-04-19 09:58:04.565 PM] {"info":{"match_info":{"roster_54":null}},"feature":"roster"}
[2022-04-19 09:58:04.573 PM] {"info":{"match_info":{"roster_56":null}},"feature":"roster"}
[2022-04-19 09:58:04.581 PM] {"info":{"me":{"inventory_0":null}},"feature":"inventory"}
[2022-04-19 09:58:04.590 PM] {"info":{"me":{"inventory_1":null}},"feature":"inventory"}
[2022-04-19 09:58:04.597 PM] {"info":{"me":{"inventory_2":null}},"feature":"inventory"}
[2022-04-19 09:58:04.606 PM] {"info":{"me":{"inventory_3":null}},"feature":"inventory"}
[2022-04-19 09:58:04.614 PM] {"info":{"me":{"inventory_4":null}},"feature":"inventory"}
[2022-04-19 09:58:04.623 PM] {"info":{"me":{"inventory_5":null}},"feature":"inventory"}
[2022-04-19 09:58:06.205 PM] {"info":{"match_info":{"legendSelect_0":null}},"feature":"team"}
[2022-04-19 09:58:06.215 PM] {"info":{"match_info":{"legendSelect_1":null}},"feature":"team"}
[2022-04-19 09:58:06.223 PM] {"info":{"match_info":{"legendSelect_2":null}},"feature":"team"}
[2022-04-19 09:58:06.230 PM] {"info":{"match_info":{"tabs":null}},"feature":"match_info"}
`;
