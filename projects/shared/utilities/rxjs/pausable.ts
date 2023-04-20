import { BehaviorSubject, NEVER, Observable } from "rxjs";
import { dematerialize, materialize, switchMap } from "rxjs/operators";

export class PausableObservable<T> extends Observable<T> {
    private pauser!: BehaviorSubject<boolean>;

    public pause(): void {
        this.pauser.next(true);
    }

    public resume(): void {
        this.pauser.next(false);
    }
}

export function pausable() {
    return function pauseFn<T>(source: Observable<T>): PausableObservable<T> {
        const pausableProto = PausableObservable.prototype;

        const pauser = new BehaviorSubject(false);
        const newSource = pauser.pipe(
            switchMap((paused) => (paused ? NEVER : source.pipe(materialize()))),
            dematerialize()
        );

        const pausable = Object.create(newSource, {
            pause: { value: pausableProto.pause },
            resume: { value: pausableProto.resume },
            pauser: { value: pauser },
        });
        return pausable as PausableObservable<T>;
    };
}
