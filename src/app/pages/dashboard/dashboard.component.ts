import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlideOutComponent } from "../../components/slide-out/slide-out.component";
import { File, Home, LogOut, LucideAngularModule, MessageSquareText, UserRoundPen } from 'lucide-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, NgIf, SlideOutComponent, LucideAngularModule],
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

  constructor(private router: Router, private http: HttpClient, private blogService: BlogService) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }





  isSidebarOpen = false;
  isModalOpen = false;

  // Model for the new post
  newPost = {
    title: '',
    content: ''
  };


  // Toggle the sidebar on small screens
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Open the create post modal
  toCreatePost(): void {
    // this.isModalOpen = true;
    // this.openCreatePost()
    // this.toggleSlideOut()

    this.router.navigate([`admin/create/${0}`])
  }

  // Close the create post modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Handle form submission for creating a post
  createPost(): void {
    // Here you can add your logic to save the post,
    // for demonstration we simply log it to the console.
    console.log('New Post:', this.newPost);
    // Optionally, clear the form fields:
    this.newPost = { title: '', content: '' };
    // Close the modal
    this.closeModal();
  }

  onPostCreated(post: any) {
    console.log('New post:', post);
    // Handle the new post
  }
  signOut() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<any>('http://localhost:3000/api/user/signout', { headers })
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
