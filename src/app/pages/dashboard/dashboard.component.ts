import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlideOutComponent } from "../../components/slide-out/slide-out.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, RouterOutlet, RouterLink, FormsModule, NgIf, SlideOutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  showSlideOut = false;

  toggleSlideOut() {
    this.showSlideOut = !this.showSlideOut;
  }

  constructor(){}




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
  openModal(): void {
    // this.isModalOpen = true;
    // this.openCreatePost()
    this.toggleSlideOut()
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
}
