import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { toggleTheme } from './../../theme/theme.actions';
import { ThemeState } from '../../theme/theme.reducers';
import { Board } from '../../models/board.model';
import { selectAllBoardsFromStore } from '../../store/selectors/selectors';
import { TaskService } from '../../services/task.service';
import { setActiveBoard } from '../../store/actions/board.action';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  activeItem: string = '';
  isSidebarCollapsed: boolean = false;
  isDarkMode$: Observable<boolean>;
  boards$: Observable<Board[]>;

  @Output() sidebarToggled = new EventEmitter<boolean>();
  @Output() boardSelected = new EventEmitter<Board>();
  isCreateBoardModalOpen: boolean = false;

  constructor(
    private store: Store<{ theme: ThemeState; boards: any }>,
    private taskService: TaskService
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
    this.boards$ = this.store.select(selectAllBoardsFromStore);
  }

  getActiveBoardFromStore(): Board | null {
    let activeBoard: Board | null = null;
    this.store
      .select('boards')
      .pipe(take(1))
      .subscribe((state) => {
        activeBoard = state.activeBoard;
      });
    return activeBoard;
  }
  ngOnInit(): void {
    this.boards$.pipe(take(1)).subscribe((boards) => {
      const boardToActivate = boards[0];
      this.activeItem = boardToActivate.name;
      this.boardSelected.emit(boardToActivate);

      if (boardToActivate.columns.length > 0) {
        this.taskService.setSelectedColumnId(boardToActivate.columns[0].id);
      }
    });
  }

  setActive(board: Board): void {
    this.activeItem = board.name;
    this.boardSelected.emit(board);

    this.taskService.setSelectedBoard(board);
    this.store.dispatch(setActiveBoard({ boardId: board.id }));

    if (board.columns.length > 0) {
      this.taskService.setSelectedColumnId(board.columns[0].id);
    }
  }

  selectColumn(columnId: string): void {
    this.taskService.setSelectedColumnId(columnId);
  }

  isActive(boardName: string): boolean {
    return this.activeItem === boardName;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.sidebarToggled.emit(!this.isSidebarCollapsed);
  }

  toggleTheme(): void {
    this.store.dispatch(toggleTheme());
  }

  openCreateBoardModal(): void {
    this.isCreateBoardModalOpen = true;
  }

  closeCreateBoardModal(): void {
    this.isCreateBoardModalOpen = false;
  }
}
