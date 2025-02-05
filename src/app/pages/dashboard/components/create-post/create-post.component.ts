import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import  { ToolConstructable, BlockToolConstructable }  from '@editorjs/editorjs';
import { RelatedPostTool } from '../../../../tools/related-post.tool';



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
  imports: [],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit, OnDestroy  {
  // editor! :EditorJS;
  editor: any;
  EditorJS: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}




  async ngOnInit() {

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
            defaultLevel: 3
          }
        },
        list: {
          class: List as unknown as ToolConstructable,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        image: {
          class: Image as unknown as ToolConstructable,
          config: {
            uploader: {
              uploadByFile: async (file: File)=> {
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
                      url: imageUrl
                    }
                  };
                } catch (error) {
                  console.error('Image upload failed:', error);
                  return {
                    success: 0,
                    error: 'Image upload failed'
                  };
                }
              }
            },
            // endpoints: {
            //   byFile: 'your-upload-endpoint-url',
            //   byUrl: 'your-url-fetch-endpoint'
            // }
          }
        },
        quote:  {
          class: Quote
        },
        code:{
          class: CodeTool
        },
        table: {
          class: Table as unknown as BlockToolConstructable
        },
        relatedPost: {
          class: RelatedPostTool,
          inlineToolbar: false
        }
      };

      this.editor = new EditorJS({
        holder: 'editorjs',
        placeholder: 'Let\'s write an awesome story!',
        tools,
        data: {
          blocks: []
        }
      });

    }
  }

    // Function to upload image to Cloudinary
    async uploadToCloudinary (file: File) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', '...'); // Replace with your Cloudinary upload preset
  
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/.../image/upload`, // Replace with your Cloudinary cloud name
        {
          method: 'POST',
          body: formData
        }
      );
  
      const data = await response.json();
      return data.secure_url;
    };


  async saveData() {
    if (isPlatformBrowser(this.platformId) && this.editor) {
      try {
        const savedData = await this.editor.save();
        console.log('Saved data:', savedData);
      } catch (error) {
        console.error('Saving error:', error);
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.editor) {
      this.editor.destroy();
    }
  }


}
