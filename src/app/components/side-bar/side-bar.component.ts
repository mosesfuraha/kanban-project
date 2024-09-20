import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toggleTheme } from './../../theme/theme.actions';
import { ThemeState } from '../../theme/theme.reducers';
import { Board } from '../../models/board.model';
import { selectAllBoardsFromStore } from '../../store/selectors/selectors';
import { TaskService } from '../../services/task.service'; // Import the TaskService

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
        const initialBoard = boards[0];
        this.activeItem = initialBoard.name;
        this.boardSelected.emit(initialBoard);

        // Set the selected board in TaskService
        this.taskService.setSelectedBoard(initialBoard);

        // Set the default column (first column as 'Todo') in TaskService
        if (initialBoard.columns && initialBoard.columns.length > 0) {
          this.taskService.setSelectedColumnId(initialBoard.columns[0].id); // Default to 'Todo'
        }

        // Log board and column details
        console.log('Active board ID:', initialBoard.id);
        console.log('Active board Name:', initialBoard.name);

        if (initialBoard.columns) {
          console.log('Column IDs:');
          initialBoard.columns.forEach((column) => {
            console.log('Column ID:', column.id);
          });
        }
      }
    });
  }

  setActive(board: Board): void {
    this.activeItem = board.name;
    this.boardSelected.emit(board);

    // Set the selected board in TaskService
    this.taskService.setSelectedBoard(board);

    // Set the first column as selected by default
    if (board.columns.length > 0) {
      this.taskService.setSelectedColumnId(board.columns[0].id);
    }

    // Log board and column details
    console.log('Selected board ID:', board.id);
    console.log('Selected board Name:', board.name);
    board.columns.forEach((column) => {
      console.log('Column ID:', column.id);
    });
  }

  selectColumn(columnId: string): void {
    this.taskService.setSelectedColumnId(columnId);
    console.log('Selected Column ID:', columnId);
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
