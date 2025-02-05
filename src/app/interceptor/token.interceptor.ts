import { HttpInterceptorFn } from '@angular/common/http';


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

 const API_TOKEN = window.localStorage.getItem("angular_blog_token") || ''
 const requestCopy = req.clone({setHeaders: {access_token: API_TOKEN!} })

  return next(requestCopy);

};
