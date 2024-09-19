import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Board } from '../../models/board.model';
import { ThemeState } from '../../theme/theme.reducers';

import { toggleTheme } from '../../theme/theme.actions';
import { selectAllBoardsFromStore } from '../../store/selectors/selectors';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  @Input() selectedBoard: Board | null = null;
  @Input() selectedColumnId?: string; 

  @Output() boardSelected = new EventEmitter<Board>();

  isDarkMode$: Observable<boolean>;
  isDropdownOpen = false;
  isModalOpen = false;
  isAddTaskModalOpen = false;

  boards$: Observable<Board[]>;

  constructor(private store: Store<{ theme: ThemeState; boards: any }>) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);

    this.boards$ = this.store.select(selectAllBoardsFromStore);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateTo(board: Board) {
    this.boardSelected.emit(board);
    this.isDropdownOpen = false;
  }

  isActive(boardName: string): boolean {
    return this.selectedBoard ? this.selectedBoard.name === boardName : false;
  }

  toggleTheme() {
    this.store.dispatch(toggleTheme());
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  toggleAddTaskModal() {
    this.isAddTaskModalOpen = !this.isAddTaskModalOpen;
  }
}
