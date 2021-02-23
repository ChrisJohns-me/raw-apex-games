import { Injectable } from "@angular/core";
import { UIWindow } from "@core/ui-window";

interface Window {
    references: any;
}

@Injectable({
    providedIn: "root",
})
export class ProcessStorageService {
    private references: any;

    public get<TType>(name: string, createFn: () => TType): TType {
        if (!this.references) {
            const window = (UIWindow.getMainWindow() as any) as Window;
            this.references = window.references ?? (window.references = {});
        }
        return this.references[name] ?? (this.references[name] = createFn());
    }
}
