import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toggleTheme } from './../../theme/theme.actions';
import { ThemeState } from '../../theme/theme.reducers';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent {
  activeItem = 'Platform Launch';
  isSidebarCollapsed = false;
  isDarkMode$: Observable<boolean>;

  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(private store: Store<{ theme: ThemeState }>) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }

  isActive(item: string) {
    return this.activeItem === item;
  }

  setActive(item: string) {
    this.activeItem = item;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.sidebarToggled.emit(!this.isSidebarCollapsed);
  }

  toggleTheme() {
    this.store.dispatch(toggleTheme());
  }
}
