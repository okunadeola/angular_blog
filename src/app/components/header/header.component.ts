import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlogService } from '../../services/blog.service';
import { Subscription } from 'rxjs';
import { CurrentUser } from '../../models/blog';
import { RestService } from '../../services/rest.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements  OnInit, OnDestroy {

  @Input() fromSearch : boolean = false

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  subscriptionList: Subscription[] = []

  constructor (private themeService: ThemeService, private http: HttpClient, private blogService: BlogService, private rest: RestService){
  }

  isScrolled = false;
  navbarOpen = false;
  modalOpen = false;
  searchTerm = '';

  currentUser: CurrentUser | null = null;
  theme = 'light';
  dropdownOpen = false;
  path = '';

  ngOnInit(): void {
    this.path = window.location.pathname;

   var subs= this.themeService.theme.subscribe(el =>{
      this.theme = el
    })

    this.subscriptionList.push(subs)

    var sub =   this.blogService.currentUser.subscribe(el =>{
      return this.currentUser = el

    })

    this.subscriptionList.push(sub)
  }

  // Use ViewChild to get a reference to the dropdown element
  @ViewChild('dropdown') dropdownElement!: ElementRef;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.dropdownElement && !this.dropdownElement.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }





  openModal(): void {
    this.modalOpen = true;
  }

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  toggleTheme(): void {
    const nextVal = this.theme === 'light' ? 'dark' : 'light'
    this.themeService.theme.next(nextVal)
  }

  toggleThemeLight(): void {
    const nextVal = 'light'
    this.themeService.theme.next(nextVal)
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    // Get existing query params
    const currentParams = { ...this.activatedRoute.snapshot.queryParams };
    // Update or add the searchTerm
    currentParams['searchTerm'] = this.searchTerm;
    // Navigate to /search with updated query parameters
    this.router.navigate(['/search'], { queryParams: currentParams });

  }

  handleSignout(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<any>(`${this.rest.apiUrl}/user/signout`, { headers })
      .subscribe({
        next: (data) => {
            this.blogService.signOut()
            this.router.navigate(['/sign-in']);
        },
        error: (err) => {
          console.log(err.message);
        }
      });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(elm =>{
      elm.unsubscribe()
    })

  }


}
