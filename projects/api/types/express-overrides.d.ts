import { UserData } from "#shared/models/user-data.js";

declare global {
    namespace Express {
        interface Request {
            userData: UserData;
        }
    }
}
