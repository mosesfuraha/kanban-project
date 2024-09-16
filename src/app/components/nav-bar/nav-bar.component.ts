import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ThemeState } from '../../theme/theme.reducers';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  isDarkMode$: Observable<boolean>;

  constructor(private store: Store<{ theme: ThemeState }>) {
    
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
  }
}
