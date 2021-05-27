import { animate, AnimationTriggerMetadata, style, transition, trigger } from "@angular/animations";

/**
 * Applies CSS transform-scale for an element entering and leaving the DOM.
 * @param scaleAmount
 * @param scaleOutAmount Defaults to scaleOutAmount's value
 * @param duration CSS string value; eg. "350ms", "3s"
 */
export function scaleInOutAnimationFactory(
    scaleAmount = 0.5,
    scaleOutAmount = scaleAmount,
    inDuration = "350ms",
    outDuration = "350ms"
): AnimationTriggerMetadata {
    return trigger("scaleInOut", [
        transition(":enter", [style({ transform: `scale(${scaleAmount})` }), animate(`${inDuration} ease-in-out`, style({ opacity: 1 }))]),
        transition(":leave", [animate(`${outDuration} ease-in-out`, style({ transform: `scale(${scaleOutAmount})` }))]),
    ]);
}
