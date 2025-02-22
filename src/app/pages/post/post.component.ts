import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
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


  private scrollAmount = 500;
  restService = inject(RestService)
  router = inject(Router)
  subscriptionList: Subscription[] = []
  blogList$: Observable<Blog[]> = new Observable<Blog[]>()
  featuresPost = signal<Blog | null>(null); 



  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef<HTMLDivElement>;


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
    this.loadFeatured()
  }

  loadFeatured(){
    var sub = this.restService.getFeaturedPost().subscribe((res:any)=>{
        this.blogList$.subscribe((el)=>{
        const init = el?.find(e => e._id === res?.postId)
        if(init){
         return  this.featuresPost.set(init);
        }else{
          this.featuresPost.set(el[0]);
        }
      }) 
    })
    // console.log(this.featuresPost());
     this.subscriptionList.push(sub)
   }





   showNextRelatedPosts = false;

 
  


   scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: -this.scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: this.scrollAmount,
      });
    }
  }

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
