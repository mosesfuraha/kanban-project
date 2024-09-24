import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Board } from '../../models/board.model';
import { ThemeState } from '../../theme/theme.reducers';

import { toggleTheme } from '../../theme/theme.actions';
import {
  selectActiveBoard,
  selectAllBoardsFromStore,
} from '../../store/selectors/selectors';
import { deleteBoard } from '../../store/actions/board.action';

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

  isDeleteBoardModalOpen = false;
  isEditBoardModalOpen = false;
  selectedBoard$: Observable<Board | null>;

  boards$: Observable<Board[]>;
  boardForEdit: Board | null = null;
  constructor(private store: Store<{ theme: ThemeState; boards: any }>) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);

    this.boards$ = this.store.select(selectAllBoardsFromStore);
    this.selectedBoard$ = this.store.select(selectActiveBoard);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateTo(board: Board) {
    this.selectedBoard = board;
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

  toggleDeleteBoardModal() {
    this.isDeleteBoardModalOpen = !this.isDeleteBoardModalOpen;
  }

  deleteBoard() {
    if (this.selectedBoard) {
      this.store.dispatch(deleteBoard({ boardId: this.selectedBoard.id }));
      this.toggleDeleteBoardModal();
    }
  }

  openEditBoardModal() {
    if (this.selectedBoard) {
      this.boardForEdit = this.selectedBoard;
      this.isEditBoardModalOpen = true;
    }
  }

  closeEditBoardModal() {
    this.isEditBoardModalOpen = false;
    this.boardForEdit = null;
  }
}
