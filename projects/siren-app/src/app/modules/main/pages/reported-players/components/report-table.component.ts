import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-report-table",
    templateUrl: "./report-table.component.html",
    styleUrls: ["./report-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportTableComponent {}
