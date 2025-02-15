import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminPostComponent } from './pages/dashboard/components/admin-post/admin-post.component';
import { AdminUserComponent } from './pages/dashboard/components/admin-user/admin-user.component';
import { AdminCommentsComponent } from './pages/dashboard/components/admin-comments/admin-comments.component';
import { AdminDashboardComponent } from './pages/dashboard/components/admin-dashboard/admin-dashboard.component';
import { CreatePostComponent } from './pages/dashboard/components/create-post/create-post.component';
import { PostComponent } from './pages/post/post.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { adminGuard } from './guards/admin.guard';


export const routes: Routes = [
    { path: 'home', component: PostComponent },
    { path: 'postdetail/:slug', component: PostDetailComponent },
    { path: 'sign-in', component: LoginComponent },
    { path: 'sign-up', component: RegisterComponent },
    { path: 'search', component: SearchComponent },
    { path: 'admin', component: DashboardComponent, canActivate: [adminGuard], children : [

        { path: '', component: AdminDashboardComponent },
        { path: 'posts', component: AdminPostComponent },
        { path: 'users', component: AdminUserComponent },
        { path: 'comments', component: AdminCommentsComponent },
        { path: 'create/:id', component: CreatePostComponent },
    ] },
    
    // ... other admin routes
    { path: '', redirectTo: 'home', pathMatch: 'full' },
  
];
