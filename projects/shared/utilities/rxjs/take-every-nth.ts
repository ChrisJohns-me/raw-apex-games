import { filter } from "rxjs/operators";

export const takeEveryNth = (n: number) => filter((value, index) => index % n === 0);
