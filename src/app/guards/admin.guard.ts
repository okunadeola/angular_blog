import { CanActivateFn, Router } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) : boolean => {
  
 var authService = inject(BlogService);
 var router = inject(Router);


 const user = authService.currentUser.value; // synchronous check

 if (user && user.isAdmin) {
  return true;
} else {
  router.navigate(['/home']);
  return false;
}

};
