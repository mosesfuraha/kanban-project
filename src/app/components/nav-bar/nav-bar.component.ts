import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ThemeState } from '../../theme/theme.reducers';
import { toggleTheme } from '../../theme/theme.actions';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  activeItem = 'Platform Launch';
  isDarkMode$: Observable<boolean>;
  isDropdownOpen = false;
  isModalOpen = false;

  constructor(private store: Store<{ theme: ThemeState }>) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateTo(boardName: string) {
    console.log(`Navigating to ${boardName}`);
    this.isDropdownOpen = false;
  }

  isActive(item: string) {
    return this.activeItem === item;
  }

  setActive(item: string) {
    this.activeItem = item;
  }
  toggleTheme() {
    this.store.dispatch(toggleTheme());
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  editBoard() {
    console.log('Edit Board clicked');
    this.closeModal();
  }

  deleteBoard() {
    console.log('Delete Board clicked');
    this.closeModal();
  }
  closeModal() {
    this.isModalOpen = false;
  }
}
