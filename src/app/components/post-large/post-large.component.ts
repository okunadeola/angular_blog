import { Component, inject, Input } from '@angular/core';
import { Blog } from '../../models/blog';
import { FormatdatePipe } from '../../pipes/formatdate.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-large',
  standalone: true,
  imports: [FormatdatePipe],
  templateUrl: './post-large.component.html',
  styleUrl: './post-large.component.css'
})
export class PostLargeComponent {
  @Input() post : Blog | null = null
  router = inject(Router)


  viewDetail(slug: any){
    this.router.navigate([`postdetail/${slug}`])
 }

}
