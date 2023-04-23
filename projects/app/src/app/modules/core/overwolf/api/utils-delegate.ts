export class UtilsDelegate {
    /**
     * Copies the given string to the clipboard.
     */
    public placeOnClipboard(data: string): void {
        overwolf.utils.placeOnClipboard(data);
    }
}
