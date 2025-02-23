import { Component, OnInit } from '@angular/core';
import { WarningPopupComponent } from "../../../../components/warning-popup/warning-popup.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CurrentUser } from '../../../../models/blog';
import { RestService } from '../../../../services/rest.service';
import { BlogService } from '../../../../services/blog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, WarningPopupComponent],
  templateUrl: './admin-comments.component.html',
  styleUrl: './admin-comments.component.css'
})
export class AdminCommentsComponent implements OnInit {
  comments: any[] = [];
  filteredComments: any[] = [];
  showMore: boolean = true;
  showModal: boolean = false;
  commentIdToDelete: string = '';
  loading: boolean = false;
  filterText: string = '';

  
  currentUser: CurrentUser | null  = null;

  constructor(private _restService: RestService, private _blogService: BlogService, private router: Router,  private toastr: ToastrService) {}

  ngOnInit(): void {
    this._blogService.currentUser.subscribe(dt =>{
      this.currentUser = dt;
    })
    this.fetchComment();
  }

  fetchComment(): void {
    this.loading = true;
    this._restService.getAllComments(0)
      .subscribe({
        next: data => {
          this.comments = data.comments;
          this.applyFilter();
          if (data.comments.length < 9) {
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
    const startIndex = this.comments.length;
    this._restService.getAllComments(startIndex)
      .subscribe({
        next: data => {
          const newComments = data.comments;
          this.comments = [...this.comments, ...newComments];
          this.applyFilter();
          if (newComments.length < 9) {
            this.showMore = false;
          }
        },
        error: err => console.error(err.message)
      });
  }



  handleDeleteComment(): void {
    this.showModal = false;
    this._restService.deleteComment(this.commentIdToDelete)
      .subscribe({
        next: data => {
          this.comments = this.comments.filter(comment => comment._id !== this.commentIdToDelete);
          this.applyFilter();
          this.toastr.success("Comment deleted successfully");
        },
        error: err => {
          console.error(err.message)
          this.toastr.error(err.error?.message || err.message);
        }
      });
  }

  confirmDelete(commentId: string): void {
    this.commentIdToDelete = commentId;
    this.showModal = true;
  }




  applyFilter(): void {
    if (!this.filterText) {
      this.filteredComments = this.comments;
    } else {
      const filter = this.filterText.toLowerCase();
      this.filteredComments = this.comments.filter(comment =>
        comment.content.toLowerCase().includes(filter) ||
        (comment.postId && comment.postId.toLowerCase().includes(filter)) ||
        (comment.userId && comment.userId.toLowerCase().includes(filter))
      );
    }
  }
}
