type EventListenerFunc = (...args: any[]) => void;
export interface OverwolfEventListenerDelegate {
    eventListeners: { [key: string]: EventListenerFunc };
    startEventListeners(): void;
    stopEventListeners(): void;
}
