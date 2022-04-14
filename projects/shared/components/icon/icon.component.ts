import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { mdiAlert } from "@mdi/js";

/**
 * @class IconComponent
 * @classdesc Temporary component to handle Material Design Icons from "@mdi/js"
 * @see https://dev.materialdesignicons.com/getting-started/angular
 * @example
 *  <icon [path]="mdiAlert"></icon>
 */
@Component({
    selector: "icon",
    template: `
        <svg version="1.1" viewBox="0 0 24 24" style="display:inline-block;width:1.5rem">
            <path [attr.d]="data" d="" [style]="pathStyle" #path />
        </svg>
    `,
})
export class IconComponent {
    @ViewChild("path") public path?: ElementRef;
    @Input("path") public data = mdiAlert;
    @Input() public set inStack(value: boolean) {
        this._inStack = value;
        this.updateStack();
    }
    @Input() public set color(value: string) {
        if (value !== null) this.pathStyle.fill = value;
    }
    @Input() public set size(value: number | string) {
        this._size = value;
        this.updateStack();
    }

    private _inStack = false;
    private _size?: number | string;

    constructor() {}

    public pathStyle: any = {
        fill: "currentColor",
    };

    private updateStack(): void {
        // if (this._inStack) {
        //     transform.push(`scale(${size})`);
        // } else {
        //     style.width = typeof size === "string" ? size : `${size * 1.5}rem`;
        //     style.height = style.width;
        // }
    }
}
