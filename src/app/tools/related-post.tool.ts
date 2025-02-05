// src/app/tools/related-post.tool.ts
import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';

interface RelatedPostData {
  title: string;
  url: string;
  description: string;
}

export class RelatedPostTool implements BlockTool {
  private data: RelatedPostData;
  private api: API;

  static get toolbox() {
    return {
      title: 'Related Post',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  constructor({ data, api }: { data: RelatedPostData; api: API }) {
    this.data = {
      title: data.title || '',
      url: data.url || '',
      description: data.description || ''
    };
    this.api = api;
  }

  render(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('ce-related-post');

    const titleInput = document.createElement('input');
    titleInput.classList.add('ce-related-post__title');
    titleInput.placeholder = 'Post Title';
    titleInput.value = this.data.title;
    titleInput.addEventListener('input', (e: Event) => {
      this.data.title = (e.target as HTMLInputElement).value;
    });

    const urlInput = document.createElement('input');
    urlInput.classList.add('ce-related-post__url');
    urlInput.placeholder = 'Post URL';
    urlInput.value = this.data.url;
    urlInput.addEventListener('input', (e: Event) => {
      this.data.url = (e.target as HTMLInputElement).value;
    });

    const descriptionInput = document.createElement('textarea');
    descriptionInput.classList.add('ce-related-post__description');
    descriptionInput.placeholder = 'Brief description';
    descriptionInput.value = this.data.description;
    descriptionInput.addEventListener('input', (e: Event) => {
      this.data.description = (e.target as HTMLTextAreaElement).value;
    });

    container.appendChild(titleInput);
    container.appendChild(urlInput);
    container.appendChild(descriptionInput);

    return container;
  }

  save(blockContent: HTMLElement): RelatedPostData {
    const title = (blockContent.querySelector('.ce-related-post__title') as HTMLInputElement).value;
    const url = (blockContent.querySelector('.ce-related-post__url') as HTMLInputElement).value;
    const description = (blockContent.querySelector('.ce-related-post__description') as HTMLTextAreaElement).value;

    return {
      title,
      url,
      description
    };
  }
}