import { animate, style, transition, trigger } from "@angular/animations";

export const fadeInOutAnimation = trigger("fadeInOut", [
    transition(":enter", [style({ opacity: 0 }), animate("350ms ease-in-out", style({ opacity: 1 }))]),
    transition(":leave", [animate("350ms ease-in-out", style({ opacity: 0 }))]),
]);
