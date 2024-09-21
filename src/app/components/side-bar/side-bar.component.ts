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

  constructor(
    private store: Store<{ theme: ThemeState; boards: any }>,
    private taskService: TaskService
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
    this.boards$ = this.store.select(selectAllBoardsFromStore);
  }

  ngOnInit(): void {
    this.boards$.subscribe((boards) => {
      if (boards && boards.length > 0) {
        const activeBoard = this.getActiveBoardFromStore();
        const boardToActivate = activeBoard ?? boards[0]; // Fallback to the first board only if no active board is set

        this.activeItem = boardToActivate.name;
        this.boardSelected.emit(boardToActivate);
        this.taskService.setSelectedBoard(boardToActivate);
        this.store.dispatch(setActiveBoard({ boardId: boardToActivate.id }));

        if (boardToActivate.columns && boardToActivate.columns.length > 0) {
          this.taskService.setSelectedColumnId(boardToActivate.columns[0].id);
        }
      }
    });
  }

  // Helper method to get the active board from the store or local state
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

  setActive(board: Board): void {
    this.activeItem = board.name;
    this.boardSelected.emit(board);

    this.taskService.setSelectedBoard(board);
    this.store.dispatch(setActiveBoard({ boardId: board.id }));

    if (board.columns.length > 0) {
      this.taskService.setSelectedColumnId(board.columns[0].id);
    }

    console.log('Selected board ID:', board.id);
    console.log('Selected board Name:', board.name);
    board.columns.forEach((column) => {
      console.log('Column ID:', column.id);
    });
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
}
