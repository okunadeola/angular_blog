import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostCommentsComponent } from "../../components/post-comments/post-comments.component";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RestService } from '../../services/rest.service';
import { Blog, User } from '../../models/blog';
import { Subscription } from 'rxjs';
import { CheckCircle, LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCommentsComponent, HeaderComponent, FooterComponent, LucideAngularModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute)
  constructor(private restService: RestService){}
  readonly CheckCircle = CheckCircle;
   private toastr = inject(ToastrService)

  isCopying = false
  post: Blog|null = null;
  recentPosts: Array<Blog> | null = null;
  subscriptionList: Subscription[] = []
  postData: any = {
    _id: '12345',
    title: 'Sample Article Title',
    subtitle: 'A short subtitle for the article',
    category: 'Tech',
    image: 'assets/sample-article.jpg',
    createdAt: new Date(),
    content: JSON.stringify({
      blocks: [
        { type: 'header', data: { level: 2, text: 'Introduction' } },
        { type: 'paragraph', data: { text: 'This is a sample paragraph for the article.' } },
        { type: 'image', data: { file: { url: 'assets/sample-image.jpg' }, caption: 'A sample caption' } },
        { type: 'list', data: { style: 'unordered', items: ['Point one', 'Point two'] } },
        { type: 'quote', data: { text: 'A sample quote goes here.', caption: 'Famous Person' } },
        { type: 'code', data: { code: 'console.log("Hello, Angular!")' } },
        { type: 'table', data: { content: [['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']] } },
        { type: 'link', data: { link: 'https://example.com', text: 'Visit Example.com' } },
        { type: 'relatedPost', data: { url: 'https://related.com', title: 'Related Post', description: 'A brief description' } }
      ]
    }),
    tags: 'Angular,Web,JavaScript',
    userId: {
      username: 'johndoe',
      name: 'John Doe',
      profilePicture: 'assets/user.jpg'
    },
    contentLength: 3500 
  };


  recentPostData: any[] = [
    {
      image: 'assets/related1.jpg',
      title: 'Related Post 1',
      excerpt: 'A short excerpt for related post 1',
      author: 'Jane Doe',
      createdAt: new Date()
    },
    {
      image: 'assets/related2.jpg',
      title: 'Related Post 2',
      excerpt: 'A short excerpt for related post 2',
      author: 'Sam Smith',
      createdAt: new Date()
    }
  ];

  author: any = {
    bio: 'This is a short author bio that gives some background information.'
  };


  blocks: any;

  ngOnInit(): void {
    const slug = this.activatedRoute.snapshot.paramMap.get("slug") as string;
    var  sub = this.restService.getPostBySlug(slug).subscribe((data: any) => {
      let dt = data?.posts?.map((item:any) => ({
          title: item.title,
          subtitle: item.subtitle,
          tags: item.tags,
          image: item.image,
          createdAt: item.createdAt,
          status: item.status,
          content:  item.content,
          category: item.category,
          slug: item.slug,
          _id: item._id,
          user: new User(item.userId)
        }))
      this.post = dt[0];
      if (this.post && this.post.content) {
        this.blocks = JSON.parse(this.post.content);
      }
    }
  )
    this.subscriptionList.push(sub)
    this.getRecentPost()
  }

  getRecentPost(){
    var  sub  = this.restService.getRecentPost().subscribe((data: any) => {
         var dt =   data?.posts?.map((item:any) => ({
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
          }))
        this.recentPosts = dt
    }

    
    
  )
  this.subscriptionList.push(sub)
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.isCopying  = true;
      setTimeout(() => {
        this.isCopying = false;
      }, 2000); 
    } catch (err) {
      console.error('Failed to copy text: ', err);
      this.toastr.error('Failed to copy text: ', );
    }
  }


  ngOnDestroy(): void {
    this.subscriptionList.forEach(elm =>{
      elm.unsubscribe()
    })
  }

}

