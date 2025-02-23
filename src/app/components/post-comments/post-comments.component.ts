import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommentComponent } from "../comment/comment.component";
import { CurrentUser } from '../../models/blog';
import { BlogService } from '../../services/blog.service';
import { Subscription } from 'rxjs';
import { WarningPopupComponent } from "../warning-popup/warning-popup.component";
import { RestService } from '../../services/rest.service';


@Component({
  selector: 'app-post-comments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CommentComponent, WarningPopupComponent],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css'
})
export class PostCommentsComponent implements OnInit, OnDestroy {
  @Input() postId: string |null = null;

  // For demonstration, we simulate a current user.
  // In a real app, use a user service or state management.
  
  comment: string = '';
  comments: any[] = [];
  showModal: boolean = false;
  commentToDelete: string | null = null;
  currentUser : CurrentUser | null = null
  subscriptionList : Subscription[] = []

  constructor(private http: HttpClient, private router: Router, private blogService: BlogService, private rest:RestService) {}
  

  ngOnInit(): void {
    this.getComments();

    var sub = this.blogService.currentUser.subscribe(dt =>{
      this.currentUser = dt
    })
    this.subscriptionList.push(sub);

  }

  getComments(): void {
    this.http.get<any[]>(`${this.rest.apiUrl}/comment/getPostComments/${this.postId}`).subscribe({
      next: (data) => { this.comments = data; },
      error: (err) => { console.error(err); }
    });
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.comment.length > 200) {
      return;
    }
    const payload = {
      content: this.comment,
      postId: this.postId,
      userId: this.currentUser?._id
    };
    this.http.post<any>('${this.rest.apiUrl}/comment/create', payload).subscribe({
      next: (data) => {
        this.comment = '';
        this.comments = [data, ...this.comments];
      },
      error: (err) => {
        console.log(err.message)
      }
    });
  }

  handleLike(commentId: string): void {
    if (!this.currentUser) {
      this.router.navigate(['/sign-in']);
      return;
    }
    this.http.put<any>(`${this.rest.apiUrl}/comment/likeComment/${commentId}`, {}).subscribe({
      next: (data) => {
        this.comments = this.comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: data.likes, numberOfLikes: data.likes.length }
            : comment
        );
      },
      error: (err) => { console.error(err?.error?.message); }
    });
  }

  handleEdit(income: any): void {
    let comment = income.comment
    let  editedContent = income.editedContent
    this.comments = this.comments.map((c) =>
      c._id === comment._id ? { ...c, content: editedContent } : c
    );
  }

  openDeleteModal(commentId: string): void {
    this.showModal = true;
    this.commentToDelete = commentId;
  }

  handleDelete(commentId: string): void {
    this.showModal = false;
    if (!this.currentUser) {
      this.router.navigate(['/sign-in']);
      return;
    }
    this.http.delete<any>(`${this.rest.apiUrl}/comment/deleteComment/${commentId}`).subscribe({
      next: (_) => {
        this.comments = this.comments.filter((comment) => comment._id !== commentId);
      },
      error: (err) => { console.error(err.message); }
    });
  }


  ngOnDestroy(): void {
    this.subscriptionList.forEach(el =>{
      el.unsubscribe()
    })
  }
}
