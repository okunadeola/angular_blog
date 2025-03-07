import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { RestService } from '../../services/rest.service';



@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() comment: any;
  @Input() currentUser: any;

  @Output() like: any = new EventEmitter<any>();
  @Output() edit:any = new EventEmitter<any>();
  @Output() delete: any = new EventEmitter<any>();




 
  user: any = {};
  isEditing: boolean = false;
  editedContent: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService, private rest: RestService) {
  }

  ngOnInit(): void {
    if (this.comment) {
      this.fetchUser();
      this.editedContent = this.comment.content;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comment'] && this.comment) {
      this.fetchUser();
      this.editedContent = this.comment.content;
    }
  }

  fetchUser(): void {
    this.http.get(`${this.rest.apiUrl}/user/${this.comment.userId}`).subscribe({
      next: (data) => { this.user = data; },
      error: (err) => { console.log(err.message); }
    });
  }


  handleEdit(): void {
    this.isEditing = true;
    this.editedContent = this.comment.content;
  }


  handleSave(): void {
    this.http.put(`${this.rest.apiUrl}/comment/editComment/${this.comment._id}`, { content: this.editedContent }).subscribe({
      next: () => {
        this.isEditing = false;
        this.edit.emit({ comment: this.comment, editedContent: this.editedContent });
        this.toastr.success("Comment edited successfully");
      },
      error: (err) => { console.log(err.message);  
        this.toastr.error(err.error?.message || err.message); }
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


  getRelativeTime(date: string): string {
    return moment(date).fromNow();
  }
}

