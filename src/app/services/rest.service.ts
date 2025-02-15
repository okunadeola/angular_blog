import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  
  
  // --------------------------dashboard------------------------
  getUsers (): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/api/user/getusers?limit=5`)
  }
  getPosts (): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/api/post/getposts?limit=5`)
  }
  getComments (): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/api/comment/getcomments?limit=5`)
  }



  getAllComments (startIndex: any): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/api/comment/getcomments?startIndex=${startIndex}`)
  }
  getAllUsers (startIndex: any): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/api/user/getusers?startIndex=${startIndex}`)
  }
  getAllPosts (startIndex: any): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/api/post/getposts?startIndex=${startIndex}`)
  }
  deletePost (userId:any, postId:any ): Observable<any>{
    return this.http.delete<any>(this.apiUrl + `/api/post/deletepost/${postId}/${userId}`)
  }
  deleteUser (userId:any, ): Observable<any>{
    return this.http.delete<any>(this.apiUrl + `/api/user/delete/${userId}`)
  }
  deleteComment (commentId:any): Observable<any>{
    return this.http.delete<any>(this.apiUrl + `/api/comment/deleteComment/${commentId}`)
  }
  // --------------------------dashboard------------------------
  

  // --------------------------editor------------------------
  fetchPostByID (postId:any ): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/api/post/getposts?postId=${postId}`)
  }
  createPost (formData:any ): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl + `/api/post/create`, formData, { headers})
  }
  updatePost (formData:any , postId: any, userId: any ): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.apiUrl + `/api/post/updatepost/${postId}/${userId}`, formData , { headers})
  }
  // --------------------------editor------------------------
}
