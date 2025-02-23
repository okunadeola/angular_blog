import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlideOutComponent } from "../../components/slide-out/slide-out.component";
import { File, Home, LogOut, LucideAngularModule, MessageSquareText, UserRoundPen } from 'lucide-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlogService } from '../../services/blog.service';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, NgIf, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  readonly Home = Home
  readonly File = File
  readonly UserRoundPen = UserRoundPen
  readonly MessageSquareText = MessageSquareText
  readonly LogOut = LogOut

  showSlideOut = false;

  toggleSlideOut() {
    this.showSlideOut = !this.showSlideOut;
  }

  constructor(private router: Router, private http: HttpClient, private blogService: BlogService, private rest:RestService) {
     // Listen for route changes
     this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && window.innerWidth < 1024) {
        this.isSidebarOpen = false; // Close sidebar on small screens when navigating
      }
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }


  isSidebarOpen = false;
  isModalOpen = false;


  newPost = {
    title: '',
    content: ''
  };



  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  toCreatePost(): void {
    this.router.navigate([`admin/create/${0}`])
  }


  signOut() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<any>(`$this.rest.apiUrl}/user/signout`, { headers })
      .subscribe({
        next: (data) => {
            // On success navigate to sign in
            this.blogService.signOut()
            this.router.navigate(['/sign-in']);
        },
        error: (err) => {
          console.log(err.message);
        }
      });
  }
}
