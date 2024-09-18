import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toggleTheme } from './../../theme/theme.actions';
import { ThemeState } from '../../theme/theme.reducers';
import { Board } from '../../models/board.model';
import { selectAllBoardsFromStore } from '../../store/selectors/selectors';

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

  constructor(private store: Store<{ theme: ThemeState; boards: any }>) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
    this.boards$ = this.store.select(selectAllBoardsFromStore);
  }

  ngOnInit(): void {
    this.boards$.subscribe((boards) => {
      if (boards && boards.length > 0) {
        const initialBoard = boards[0];
        this.activeItem = initialBoard.name;
        this.boardSelected.emit(initialBoard);
      }
    });
  }

  isActive(item: string): boolean {
    return this.activeItem === item;
  }

  setActive(board: Board): void {
    this.activeItem = board.name;
    this.boardSelected.emit(board);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.sidebarToggled.emit(!this.isSidebarCollapsed);
  }

  toggleTheme(): void {
    this.store.dispatch(toggleTheme());
  }
}
