import { Component, inject, Input } from '@angular/core';
import { Blog } from '../../models/blog';
import { FormatdatePipe } from '../../pipes/formatdate.pipe';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-md',
  standalone: true,
  imports: [FormatdatePipe],
  templateUrl: './post-md.component.html',
  styleUrl: './post-md.component.css'
})
export class PostMdComponent {
  @Input() post : Blog | null = null

  router = inject(Router)


  viewDetail(slug: any){
    this.router.navigate([`postdetail/${slug}`])
 }
}
