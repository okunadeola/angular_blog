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
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, WarningPopupComponent],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css'
})
export class AdminUserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  showMore: boolean = true;
  showModal: boolean = false;
  userIdToDelete: string = '';
  loading: boolean = false;
  filterText: string = '';

  // Simulated current admin user; in a real app inject an auth service.
  currentUser: CurrentUser | null  = null;

  constructor(private _restService: RestService, private _blogService: BlogService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this._blogService.currentUser.subscribe(dt =>{
      this.currentUser = dt;
    })
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this._restService.getAllUsers(0)
      .subscribe({
        next: data => {
          this.users = data?.users;
          this.applyFilter();
          if (data.users.length < 9) {
            this.showMore = false;
          }
          this.loading = false;
        },
        error: err => {
          console.error(err.message);
          this.loading = false;
          this.toastr.error(err.error?.message || err.message);
        }
      });
  }

  handleShowMore(): void {
    const startIndex = this.users.length;
    this._restService.getAllUsers(startIndex)
      .subscribe({
        next: data => {
          const newPosts = data.users;
          this.users = [...this.users, ...newPosts];
          this.applyFilter();
          if (newPosts.length < 9) {
            this.showMore = false;
          }
        },
        error: err => console.error(err.message)
      });
  }

  handleDeleteUser(): void {
    this.showModal = false;
    this._restService.deleteUser(this.currentUser?._id)
      .subscribe({
        next: data => {
          this.users = this.users.filter(usr => usr._id !== this.userIdToDelete);
          this.applyFilter();
          this.toastr.success("User deleted successfully");
        },
        error: err => {
          console.error(err.message)
          this.toastr.error(err.error?.message || err.message);
        }
      });
  }

  confirmDelete(userId: string): void {
    this.userIdToDelete = userId;
    this.showModal = true;
  }

  editPost(post: any): void {
    this.router.navigate([`/create-post/${post._id}`]);
  }

  // Update filtered posts based on filterText
  applyFilter(): void {
    if (!this.filterText) {
      this.filteredUsers = this.users;
    } else {
      const filter = this.filterText.toLowerCase();
      this.filteredUsers = this.users.filter(usr =>
        usr.username.toLowerCase().includes(filter) ||
        usr.email.toLowerCase().includes(filter)
      );
    }
  }
}
