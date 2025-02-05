import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';



@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit, OnChanges {
  // The comment data passed from the parent.
  @Input() comment: any;
  // The currently logged in user (if any).
  @Input() currentUser: any;
  
  // Output events for like, edit, and delete actions.
  @Output() like: any = new EventEmitter<any>();
  @Output() edit:any = new EventEmitter<any>();
  @Output() delete: any = new EventEmitter<any>();




  // Local state variables.
  user: any = {};
  isEditing: boolean = false;
  editedContent: string = '';

  constructor(private http: HttpClient) {
    console.log(this.currentUser)
  }

  ngOnInit(): void {
    if (this.comment) {
      this.fetchUser();
      this.editedContent = this.comment.content;

      // console.log(currentUser.isAdmin)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comment'] && this.comment) {
      this.fetchUser();
      this.editedContent = this.comment.content;
    }
  }

  // Fetch user info based on comment.userId.
  fetchUser(): void {
    this.http.get(`http://localhost:3000/api/user/${this.comment.userId}`).subscribe({
      next: (data) => { this.user = data; },
      error: (err) => { console.log(err.message); }
    });
  }

  // Switch to edit mode.
  handleEdit(): void {
    this.isEditing = true;
    this.editedContent = this.comment.content;
  }

  // Save the edited comment.
  handleSave(): void {
    this.http.put(`http://localhost:3000/api/comment/editComment/${this.comment._id}`, { content: this.editedContent }).subscribe({
      next: () => {
        this.isEditing = false;
        this.edit.emit({ comment: this.comment, editedContent: this.editedContent });
      },
      error: (err) => { console.log(err.message); }
    });
  }

  // Emit like event.
  onLike(): void {
    this.like.emit(this.comment._id);
  }

  // Emit delete event.
  onDelete(): void {
    this.delete.emit(this.comment._id);
  }

  // Return a relative time string using moment.
  getRelativeTime(date: string): string {
    return moment(date).fromNow();
  }
}

