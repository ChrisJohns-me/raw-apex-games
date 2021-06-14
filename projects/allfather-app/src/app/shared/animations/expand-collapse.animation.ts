import { animate, state, style, transition, trigger } from "@angular/animations";

export const expandCollapseAnimation = trigger("expandCollapse", [
    transition(":enter", [style({ opacity: 0, height: 0 }), animate("350ms ease-in-out", style({ opacity: 1, height: "*" }))]),
    transition(":leave", [animate("350ms ease-in-out", style({ opacity: 1, height: 0 }))]),
    state("*", style({ overflow: "hidden" })),
]);
