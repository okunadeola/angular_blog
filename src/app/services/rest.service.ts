import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponsemodel } from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  apiUrl: string = "http://localhost:3000";


  getAllPost (): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/api/post/getPosts')
  }

  getFeaturedPost (): Observable<APIResponsemodel>{
    return this.http.get<APIResponsemodel>(this.apiUrl + '/api/featured/get')
  }

  getPostBySlug (postSlug:string): Observable<APIResponsemodel>{
    return this.http.get<APIResponsemodel>(this.apiUrl + `/api/post/getposts?slug=${postSlug}`)
  }
  getRecentPost (): Observable<APIResponsemodel>{
    return this.http.get<APIResponsemodel>(this.apiUrl + `/api/post/getposts?limit=3`)
  }

}
