import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { CurrentUser } from '../../models/blog';
import { ToastrService } from 'ngx-toastr';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  formData: any = {};
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private blogService: BlogService,
    private toastr: ToastrService,
    private rest: RestService
  ) {}


  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const id = target.id;
    const value = target.value.trim();

    this.formData = { ...this.formData, [id]: value };
  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }


  handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.formData.email || !this.formData.password) {
      this.errorMessage = 'Please fill all the fields';
      return;
    }
    this.loading = true;
    this.errorMessage = null;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post<any>(`${this.rest.apiUrl}/auth/signin`, this.formData, {
        headers,
      })
      .subscribe({
        next: (data) => {
          if (data.success === false) {
            this.errorMessage = data.message;
          } else {
            
            const currentUser: CurrentUser = {
              email: data?.email,
              isAdmin: data?.isAdmin,
              profilePicture: data?.profilePicture,
              username: data?.username,
              _id: data?._id,
              createdAt: data?.createdAt,
            };
            this.blogService.signInSuccess(currentUser);
            localStorage.setItem('angular_blog_token', data?.access_token);
            this.router.navigate(['/']);
          }
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.loading = false;
          this.toastr.error(err.error?.message || err.message);
        },
      });
  }
}
