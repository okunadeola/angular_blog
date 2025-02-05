import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  theme: Subject<string>  = new Subject<string>();

  toggleTheme(state: string) {
    this.theme.next(state === 'light' ? 'dark' : 'light')
  }
}
