import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RestService } from '../../../../services/rest.service';
import { BlogService } from '../../../../services/blog.service';
import { CurrentUser } from '../../../../models/blog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  users: any[] = [];
  comments: any[] = [];
  posts: any[] = [];
  totalUsers: number = 0;
  totalPosts: number = 0;
  totalComments: number = 0;
  lastMonthUsers: number = 0;
  lastMonthPosts: number = 0;
  lastMonthComments: number = 0;
  currentUser : CurrentUser | null = null
  subscriptionList : Subscription[] = []

  constructor(private _restService :RestService, private blogService:BlogService   ) {}

  ngOnInit(): void {
    var sub = this.blogService.currentUser.subscribe((dt) =>{
      this.currentUser = dt
    })
      this.subscriptionList.push(sub);
      this.fetchUsers();
      this.fetchPosts();
      this.fetchComments();
  }

  fetchUsers(): void {
    this._restService.getUsers().subscribe({
      next: (data: any) => {
        this.users = data.users;
        this.totalUsers = data.totalUsers;
        this.lastMonthUsers = data.lastMonthUsers;
      },
      error: (err: any) => console.error(err.message)
    });
  }

  fetchPosts(): void {
    this._restService.getPosts().subscribe({
      next: (data: any) => {
        this.posts = data.posts;
        this.totalPosts = data.totalPosts;
        this.lastMonthPosts = data.lastMonthPosts;
      },
      error: (err: any) => console.error(err.message)
    });
  }

  fetchComments(): void {
    this._restService.getComments().subscribe({
      next: (data: any) => {
        this.comments = data.comments;
        this.totalComments = data.totalComments;
        this.lastMonthComments = data.lastMonthComments;
      },
      error: (err: any) => console.error(err.message)
    });
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(el =>{
      el.unsubscribe()
    })
  }
}
