import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (
        this.menuItems &&
        this.menuItems.classList.contains(this.showNavClass)
      ) {
        this.menuItems.classList.remove(this.showNavClass);
      }
    });
  }
  @Input('title') title: string;

  ngOnInit() {}
  showNavClass: string = 'show';
  menuItems: any;
  toggleMenu(menuItems) {
    if (menuItems.classList.contains(this.showNavClass)) {
      menuItems.classList.remove(this.showNavClass);
    } else {
      menuItems.classList.add(this.showNavClass);
    }
    this.menuItems = menuItems;
  }
}
