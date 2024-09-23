import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ThemeActions from './theme/theme.actions';
import { Board } from './models/board.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  isSidebarVisible: boolean = true;
  selectedBoard: Board | null = null;

  constructor(
    private store: Store<{ theme: { isDarkMode: boolean } }>,
    private cdr: ChangeDetectorRef
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('isDarkMode');
    const isDarkMode = savedTheme ? JSON.parse(savedTheme) : false;

    this.store.dispatch(ThemeActions.setInitialTheme({ isDarkMode }));

    this.isDarkMode$.subscribe((isDark) => {
      localStorage.setItem('isDarkMode', JSON.stringify(isDark));

      this.cdr.detectChanges();
    });

    this.updateSidebarVisibility(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateSidebarVisibility(event.target.innerWidth);
  }

  private updateSidebarVisibility(screenWidth: number) {
    if (screenWidth < 568) {
      this.isSidebarVisible = false;
    } else {
      this.isSidebarVisible = true;
    }
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onBoardSelected(board: Board): void {
    this.selectedBoard = board;
  }
}
