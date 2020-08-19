import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let modifiedReq;
    const globalCookie = this.cookieService.get('globals');
    const parsedGlobalCookie = globalCookie ? JSON.parse(globalCookie) : {};
    if (!parsedGlobalCookie['currentUser']) {
      modifiedReq = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Basic ' + parsedGlobalCookie['currentUser']['authdata']
        ),
      });
    } else {
      modifiedReq = request.clone({
        headers: request.headers.set('Authorization', 'Basic'),
      });
    }
    console.log(modifiedReq);
    return next.handle(modifiedReq);
  }
}
