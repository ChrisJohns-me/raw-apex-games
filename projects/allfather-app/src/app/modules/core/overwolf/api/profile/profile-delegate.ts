import { bindCallback, Observable } from "rxjs";

export class ProfileDelegate {
    /**
     * The currently logged-in Overwolf user.
     * @returns {success} = false if user is not logged in
     */
    public getCurrentUser(): Observable<overwolf.profile.GetCurrentUserResult> {
        const getCurrentUserObs = bindCallback(overwolf.profile.getCurrentUser);
        return getCurrentUserObs();
    }
}
