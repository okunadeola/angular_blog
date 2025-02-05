import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { FlowbiteService } from './services/flowbite.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})


export class AppComponent implements OnInit {
  title = 'angular_blog';
  theme = "light"

  constructor(@Inject(PLATFORM_ID) private platformId: any, private flowbiteService: FlowbiteService, private themeService: ThemeService) {}

  async ngOnInit() {

    this.themeService.theme.subscribe(el =>{
      this.theme = el
    })

    if(isPlatformBrowser(this.platformId)){
      this.flowbiteService.loadFlowbite(flowbite => {
        console.log('Flowbite loaded', flowbite);
      });

    }

  }


  
}
