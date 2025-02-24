import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponsemodel } from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  // apiUrl: string = "http://localhost:3000";

  apiUrl: string = 'http://localhost:3000/api'


  getAllPost (): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/post/getPosts')
  }

  getFeaturedPost (): Observable<APIResponsemodel>{
    return this.http.get<APIResponsemodel>(this.apiUrl + '/featured/get')
  }

  getPostBySlug (postSlug:string): Observable<APIResponsemodel>{
    return this.http.get<APIResponsemodel>(this.apiUrl + `/post/getposts?slug=${postSlug}`)
  }
  getRecentPost (): Observable<APIResponsemodel>{
    return this.http.get<APIResponsemodel>(this.apiUrl + `/post/getposts?limit=3`)
  }
  
  
  // --------------------------dashboard------------------------
  getUsers (): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/user/getusers?limit=5`)
  }
  getPosts (): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/post/getposts?limit=5`)
  }
  getComments (): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/comment/getcomments?limit=5`)
  }



  getAllComments (startIndex: any): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/comment/getcomments?startIndex=${startIndex}`)
  }
  getAllUsers (startIndex: any): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/user/getusers?startIndex=${startIndex}`)
  }
  getAllPosts (startIndex: any): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/post/getposts?startIndex=${startIndex}`)
  }
  deletePost (userId:any, postId:any ): Observable<any>{
    return this.http.delete<any>(this.apiUrl + `/post/deletepost/${postId}/${userId}`)
  }
  deleteUser (userId:any, ): Observable<any>{
    return this.http.delete<any>(this.apiUrl + `/user/delete/${userId}`)
  }
  deleteComment (commentId:any): Observable<any>{
    return this.http.delete<any>(this.apiUrl + `/comment/deleteComment/${commentId}`)
  }
  // --------------------------dashboard------------------------
  

  // --------------------------editor------------------------
  fetchPostByID (postId:any ): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/post/getposts?postId=${postId}`)
  }
  createPost (formData:any ): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl + `/post/create`, formData, { headers})
  }
  updatePost (formData:any , postId: any, userId: any ): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.apiUrl + `/post/updatepost/${postId}/${userId}`, formData , { headers})
  }
  // --------------------------editor------------------------
}
