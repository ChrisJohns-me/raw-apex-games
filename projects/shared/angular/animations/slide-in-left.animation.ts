import { animate, style, transition, trigger } from "@angular/animations";

export const slideInLeftAnimation = trigger("slideInLeft", [
    transition(":enter", [style({ transform: "translateX(100%)" }), animate("350ms ease-in-out", style({ transform: "translateX(0%)" }))]),
    transition(":leave", [animate("350ms ease-in-out", style({ transform: "translateX(100%)" }))]),
]);
