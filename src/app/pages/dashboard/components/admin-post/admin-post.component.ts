import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../../services/rest.service';
import { BlogService } from '../../../../services/blog.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarningPopupComponent } from "../../../../components/warning-popup/warning-popup.component";
import { CurrentUser } from '../../../../models/blog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, WarningPopupComponent],
  templateUrl: './admin-post.component.html',
  styleUrl: './admin-post.component.css'
})
export class AdminPostComponent implements OnInit {
  userPosts: any[] = [];
  filteredPosts: any[] = [];
  showMore: boolean = true;
  showModal: boolean = false;
  postIdToDelete: string = '';
  loading: boolean = false;
  filterText: string = '';

  // Simulated current admin user; in a real app inject an auth service.
  currentUser: CurrentUser | null  = null;

  constructor(private _restService: RestService, private _blogService: BlogService, private router: Router, private toastr: ToastrService ) {}

  ngOnInit(): void {
    this._blogService.currentUser.subscribe(dt =>{
      this.currentUser = dt;
    })
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.loading = true;
    this._restService.getAllPosts(0)
      .subscribe({
        next: data => {
          this.userPosts = data.posts;
          this.applyFilter();
          if (data.posts.length < 9) {
            this.showMore = false;
          }
          this.loading = false;
        },
        error: err => {
          console.error(err.message);
          this.loading = false;
        }
      });
  }

  handleShowMore(): void {
    const startIndex = this.userPosts.length;
    this._restService.getAllPosts(startIndex)
      .subscribe({
        next: data => {
          const newPosts = data.posts;
          this.userPosts = [...this.userPosts, ...newPosts];
          this.applyFilter();
          if (newPosts.length < 9) {
            this.showMore = false;
          }
        },
        error: err => console.error(err.message)
      });
  }

  handleDeletePost(): void {
    this.showModal = false;
    this._restService.deletePost(this.currentUser?._id, this.postIdToDelete)
      .subscribe({
        next: data => {
          this.userPosts = this.userPosts.filter(post => post._id !== this.postIdToDelete);
          this.applyFilter();

          this.toastr.success("Post created successfully");
        },
        error: err => {
          console.error(err.message)
          this.toastr.error(err.error?.message || err.message);
        }
      });
  }

  confirmDelete(postId: string): void {
    this.postIdToDelete = postId;
    this.showModal = true;
  }

  editPost(post: any): void {
    this.router.navigate([`/admin/create/${post._id}`]);
  }

  // Update filtered posts based on filterText
  applyFilter(): void {
    if (!this.filterText) {
      this.filteredPosts = this.userPosts;
    } else {
      const filter = this.filterText.toLowerCase();
      this.filteredPosts = this.userPosts.filter(post =>
        post.title.toLowerCase().includes(filter) ||
        post.category.toLowerCase().includes(filter)
      );
    }
  }
}

