import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostMdComponent } from "../post-md/post-md.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PostMdComponent, HeaderComponent, FooterComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  sidebarData = {
    searchTerm: '',
    sort: 'desc',
    category: ''
  };

  posts: any[] = [];
  loading: boolean = false;
  showMore: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private rest: RestService
  ) {}

  ngOnInit(): void {
    // When query parameters change, update the sidebar filters and fetch posts.
    this.route.queryParams.subscribe(params => {
      // Update sidebarData if present in URL
      this.sidebarData = {
        searchTerm: params['searchTerm'] || '',
        sort: params['sort'] || 'desc',
        category: params['category'] || ''
      };
      this.fetchPosts();
    });
  }

  fetchPosts(): void {
    this.loading = true;
    // Build a query string from the current URL query parameters
    const currentParams = this.route.snapshot.queryParams;
    const searchQuery = new URLSearchParams(currentParams).toString();

    this.http.get<any>(`${this.rest.apiUrl}/post/getposts?${searchQuery}`).subscribe({
      next: data => {
        this.posts = data.posts;
        this.loading = false;
        this.showMore = data.posts.length === 9;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    // Create new query parameters from the sidebarData
    const newParams = {
      searchTerm: this.sidebarData.searchTerm,
      sort: this.sidebarData.sort,
      category: this.sidebarData.category
    };
    // Navigate to the same route with updated query parameters
    this.router.navigate(['/search'], { queryParams: newParams });
  }

  handleShowMore(): void {
    const startIndex = this.posts.length;
    // Get current parameters and add startIndex
    const currentParams = { ...this.route.snapshot.queryParams, startIndex: startIndex.toString() };
    const searchQuery = new URLSearchParams(currentParams).toString();

    this.http.get<any>(`${this.rest.apiUrl}/post/getposts?${searchQuery}`).subscribe({
      next: data => {
        this.posts = [...this.posts, ...data.posts];
        this.showMore = data.posts.length === 9;
      },
      error: err => {
        console.error(err);
      }
    });
  }
}

