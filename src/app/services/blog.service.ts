import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CurrentUser } from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  storedData = window.localStorage.getItem('blog_auth_angular') as string | null
  initialData = this.storedData ? JSON.parse(this.storedData) as CurrentUser  : null

  constructor() {
   }



  currentUser: BehaviorSubject<CurrentUser | null> = new BehaviorSubject<CurrentUser | null>(this.initialData);

  signInSuccess(payload: CurrentUser) {
    this.currentUser.next(payload);
    window.localStorage.setItem('blog_auth_angular', JSON.stringify(payload))
  }
  signOut() {
    this.currentUser.next(null);
    window.localStorage.setItem('blog_auth_angular', JSON.stringify(null))
  }
}
