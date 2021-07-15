import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from "@angular/platform-browser";

/**
 * @param {'html' | 'style' | 'script' | 'url' | 'resourceUrl'} type Resource type to bypass.
 * @see https://angular.io/api/platform-browser/DomSanitizer
 * @example
 *  - <div [innerHtml]="htmlSnippet | safe: 'html'"></div>
 *  - <a [href]="linkUrl | safe: 'url'">Link</a>
 */
@Pipe({ name: "safe" })
export class SafePipe implements PipeTransform {
    constructor(protected sanitizer: DomSanitizer) {}

    public transform(
        value: any,
        type: "html" | "style" | "script" | "url" | "resourceUrl"
    ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        switch (type) {
            case "html":
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case "style":
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case "script":
                return this.sanitizer.bypassSecurityTrustScript(value);
            case "url":
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case "resourceUrl":
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error(`Invalid safe type specified: ${type}`);
        }
    }
}
