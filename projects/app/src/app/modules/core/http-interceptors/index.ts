import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpUserDataInterceptor } from "./user-data.interceptor";

export const httpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: HttpUserDataInterceptor, multi: true }];
