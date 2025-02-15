import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  router = inject(Router)
  formData: any = {};
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.formData.username || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<any>('http://localhost:3000/api/auth/signup', this.formData, { headers })
      .subscribe({
        next: (data) => {
          if (data.success === false) {
            this.errorMessage = data.message;
          } else {
            this.toastr.success("User created successfully");
            // On success navigate to sign in
            this.router.navigate(['/sign-in']);
          }
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.loading = false;
          this.toastr.error(err.error?.message || err.message);
        }
      });
  }
}
