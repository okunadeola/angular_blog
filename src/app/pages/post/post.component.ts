import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { map, Observable, Subscription } from 'rxjs';
import { Blog, User } from '../../models/blog';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormatdatePipe } from '../../pipes/formatdate.pipe';
import { PostLargeComponent } from "../../components/post-large/post-large.component";
import { PostMdComponent } from "../../components/post-md/post-md.component";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { Router } from '@angular/router';
import { LucideAngularModule, FilePlus, CalendarDays, Clock, ChevronLeft, ChevronRight } from 'lucide-angular';


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormatdatePipe, AsyncPipe, PostLargeComponent, PostMdComponent, HeaderComponent, FooterComponent, LucideAngularModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit, OnDestroy {
  readonly FilePlus = FilePlus;
  readonly CalendarDays = CalendarDays;
  readonly Clock = Clock;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  restService = inject(RestService)
  router = inject(Router)
  subscriptionList: Subscription[] = []
  blogList$: Observable<Blog[]> = new Observable<Blog[]>()
  featuresPost = signal<Blog | null>(null); 


  ngOnInit(): void {
    this. blogList$ = this.restService.getAllPost().pipe(
      map(response => response?.posts?.map((item:any) => ({
        title: item.title,
        subtitle: item.subtitle,
        tags: item.tags,
        image: item.image,
        createdAt: item.createdAt,
        status: item.status,
        content: item.content,
        category: item.category,
        slug: item.slug,
        _id: item._id,
        user: new User(item.userId)
      })))
    );
    // this.blogList$.subscribe(el=> console.log(el))
    this.loadFeatured()
  }

  loadFeatured(){
    var sub = this.restService.getFeaturedPost().subscribe((res:any)=>{
        this.blogList$.subscribe((el)=>{
        const init = el?.find(e => e._id === res?.postId)
        if(init){
         return  this.featuresPost.set(init);
        }
      }) 
    })
    // console.log(this.featuresPost());
     this.subscriptionList.push(sub)
   }




   showNextRecentPosts = false;
   showNextRelatedPosts = false;

 
   // Carousel navigation functions
   handleNextRecentPosts = () => {
    this.showNextRecentPosts = !this.showNextRecentPosts
   };
   handleNextRelatedPosts = () => {
     this.showNextRelatedPosts = !this.showNextRelatedPosts;
   };


   viewDetail(slug: any){
      this.router.navigate([`postdetail/${slug}`])
   }


   ngOnDestroy(): void {
    this.subscriptionList.forEach(elm =>{
      elm.unsubscribe()
    })
}

}
