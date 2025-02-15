import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToolConstructable, BlockToolConstructable } from '@editorjs/editorjs';
import { RelatedPostTool } from '../../../../tools/related-post.tool';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RestService } from '../../../../services/rest.service';
import { CurrentUser } from '../../../../models/blog';
import { BlogService } from '../../../../services/blog.service';
import { Subscription } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

interface EditorTools {
  [key: string]: {
    class: ToolConstructable;
    inlineToolbar?: boolean | string[];
    config?: Record<string, any>;
  };
}

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('500ms ease-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CreatePostComponent implements OnInit, OnDestroy {
  editor: any;
  EditorJS: any;
  editorData: any = { blocks: [] };

  subList: Subscription[] = [];

  // Post content fields
  today = new Date();
  title: string = '';
  subTitle: string = '';
  loading: boolean = false;
  postId?: string;

  // For preview panel
  previewContent: any;
  showPreview: boolean = false;

  // Featured image state
  featuredImage: any = null;

  // Categories
  inputCategory: string = '';
  categories: string[] = [];

  // Featured flag
  featured: boolean = false;

  // Tags
  inputTag: string = '';
  tags: string[] = [];

  // Post status
  status: string = 'draft';

  currentUser: CurrentUser | null = null;

  // Recent blogs (for sidebar "Recent Posts")
  recentBlogs: any[] = [
    // Dummy data; replace with your actual recent posts.
    {
      id: 1,
      title: 'First Blog Post',
      excerpt: 'This is a short excerpt.',
      tags: ['Angular', 'Tutorial'],
    },
    {
      id: 2,
      title: 'Second Blog Post',
      excerpt: 'Another excerpt goes here.',
      tags: ['Tech'],
    },
  ];

  // Optional flag to track drag-over state for styling
  isDragOver: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private activatedRoute: ActivatedRoute,
    private _restService: RestService,
    private blogService: BlogService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  fetchPost(postId: string): void {
    this.http
      .get(`http://localhost:3000/api/post/getposts?postId=${postId}`)
      .subscribe({
        next: (data: any) => {
          if (data && data.posts && data.posts.length > 0) {
            const res = data.posts[0];
            this.autoPopulateData(res?.content);
            this.title = res?.title;
            this.subTitle = res?.subtitle;
            this.featuredImage = { url: res?.image };
            this.inputCategory = res?.category;
            this.tags = res?.tags ? res.tags.split(',') : [];
            this.status = res?.status;

            this.loadFeatured(res?._id)
          }
        },
        error: (error) => {
          this.toastr.error(error.error?.message || error.message);
        },
      });
  }


  loadFeatured(id : string){
    var sub = this._restService.getFeaturedPost().subscribe((res:any)=>{
         this.featured = id === res?.postId
      }) 
     this.subList.push(sub)
   }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const snapshot = this.activatedRoute.snapshot.paramMap.get('id');
      this.postId = snapshot === '0' ? undefined : snapshot!;

      // Initialize EditorJS with default (empty) data
      this.initEditor(this.editorData);

      if (this.postId) {
        this.fetchPost(this.postId);
      }

      const sub = this.blogService.currentUser.subscribe((dt) => {
        this.currentUser = dt;
      });

      this.subList.push(sub);
    }
  }

  autoPopulateData(content: string): void {
    let data;
    try {
      data = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing content JSON', error);
      return;
    }

    // Wait 5 seconds before updating the editor (if needed)
    setTimeout(() => {
    if (this.editor && typeof this.editor.destroy === 'function') {
        this.editor.destroy();
        this.initEditor(data);
    } else {
      // If there's no editor instance, simply initialize it
      this.initEditor(data);
    }
  }, 5000);
  }

  async initEditor(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically import EditorJS only in browser
      const EditorJS = (await import('@editorjs/editorjs')).default;
      const Header = (await import('@editorjs/header')).default;
      const List = (await import('@editorjs/list')).default;
      const Image = (await import('@editorjs/image')).default;
      const Quote = (await import('@editorjs/quote')).default;
      const CodeTool = (await import('@editorjs/code')).default;
      const Table = (await import('@editorjs/table')).default;

      const tools: EditorTools = {
        header: {
          class: Header as unknown as ToolConstructable,
          // inlineToolbar: ['link'],
          config: {
            placeholder: 'Enter a header',
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        list: {
          class: List as unknown as ToolConstructable,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        image: {
          class: Image as unknown as ToolConstructable,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                // -------------------------- base64-----------------
                // return new Promise((resolve) => {
                //   const reader = new FileReader();
                //   reader.onload = (e) => {
                //     resolve({
                //       success: 1,
                //       file: {
                //         url: e.target.result
                //       }
                //     });
                //   };
                //   reader.readAsDataURL(file);
                // });
                // -------------------------- base64-----------------
                try {
                  const imageUrl = await this.uploadToCloudinary(file);
                  return {
                    success: 1,
                    file: {
                      url: imageUrl,
                    },
                  };
                } catch (error) {
                  console.error('Image upload failed:', error);
                  return {
                    success: 0,
                    error: 'Image upload failed',
                  };
                }
              },
            },
            // endpoints: {
            //   byFile: 'your-upload-endpoint-url',
            //   byUrl: 'your-url-fetch-endpoint'
            // }
          },
        },
        quote: {
          class: Quote,
        },
        code: {
          class: CodeTool,
        },
        table: {
          class: Table as unknown as BlockToolConstructable,
        },
        relatedPost: {
          class: RelatedPostTool, //custom tools
          inlineToolbar: false,
        },
      };

      this.editor = new EditorJS({
        holder: 'editorjs',
        placeholder: "Let's write an awesome story!",
        tools,
        data: data || { blocks: [] },
      });
    }
  }

  // Function to upload image to Cloudinary
  async uploadToCloudinary(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', '...'); // Replace with your Cloudinary upload preset

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/.../image/upload`, // Replace with your Cloudinary cloud name
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  }

  async saveData() {
    if (isPlatformBrowser(this.platformId) && this.editor) {
      try {
        const savedData = await this.editor.save();
        const postData = {
          title: this.title,
          status: this.status,
          content: JSON.stringify(savedData),
          image: this.featuredImage,
          tags: this.tags?.join(','),
          category: this.inputCategory,
          subtitle: this.subTitle,
          featured: this.featured,
        };
        // console.log('Saved data:', savedData, postData);
        await this.handleSubmit(postData);
      } catch (error) {
        console.error('Saving error:', error);
      }
    }
  }

  async handleSubmit(formData: any) {
    let sub;
    if(this.loading ) return 
    this.loading = true
    if (this.postId) {
      sub = this._restService
        .updatePost(formData, this.postId, this.currentUser?._id)
        .subscribe({
          next: (data) => {
            console.log('Post updated successfully');
            this.toastr.success('Post updated successfully', 'Success');
            this.clearData()
          },
          error: (err) => {
            console.log(err.message);
          },
        });
    } else {
      this._restService.createPost(formData).subscribe({
        next: (data) => {
          console.log('Post created successfully');
          this.toastr.success('Post created successfully', 'Success');
          this.clearData()
        },
        error: (err) => {
          console.log(err?.message);
          this.toastr.error(err?.message, 'Error');
        },
      });
    }
    this.subList.push(sub!);
    this.loading = false
  }



  clearData(){
    this.title = ""
    this.status = ""
    this.featuredImage = ""
    this.tags = []
    this.inputCategory = ""
    this.subTitle = ""
    this.featured =false
    this.postId =undefined


    this.editor.destroy();
    this.initEditor({ blocks: [] })
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.editor) {
      this.editor.destroy();

      this.subList.forEach((el) => {
        el.unsubscribe();
      });
    }
  }

  // -------------------------------------

  // --- Methods ---
  async handlePreview(): Promise<void> {
    // Toggle preview panel visibility
    this.previewContent = await this.editor.save();
    this.showPreview = true;
  }

  async handleFeaturedImageUpload(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      // For simplicity, we create an object URL for preview purposes.
      // this.featuredImage =    { url: URL.createObjectURL(file) };

      const res = await this.uploadToCloudinary(file);
      this.featuredImage = { url: res, name: file.name };
    }
  }

  // Remove the featured image
  removeFeaturedImage(): void {
    this.featuredImage = null;
  }

  // Tag methods
  handleAddTag(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.inputTag && !this.tags.includes(this.inputTag)) {
        this.tags.push(this.inputTag);
        this.inputTag = '';
      }
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  // Toggle featured flag
  toggleFeatured(): void {
    this.featured = !this.featured;
  }
  // -------------------------------------

  // Process the file, here we just create an object URL for preview.
  processFile(file: File): void {
    // this.featuredImage = { url: URL.createObjectURL(file), name: file.name };
    this.uploadToCloudinary(file)
  }

  // Drag and drop event handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.processFile(file);
      event.dataTransfer.clearData();
    }
  }
}
