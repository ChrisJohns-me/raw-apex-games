import { Subject } from "rxjs";

/**
 * Gets the generic type of a RxJS's Subject
 */
type ExtractSubjectType<P> = P extends Subject<infer T> ? T : never;
