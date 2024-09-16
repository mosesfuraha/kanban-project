import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  activeItem = 'Platform Launch';

  isActive(item: string) {
    return this.activeItem === item;
  }

  setActive(item: string) {
    this.activeItem = item;
  }
}
