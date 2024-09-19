import { boardReducer } from './store/reducers/reducer.board';
import { NgModule, isDevMode } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './pages/board/board.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TaskComponent } from './components/task/task.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { themeReducer } from './theme/theme.reducers';
import { ThemeEffects } from './theme/theme.effects';
import { HttpClientModule } from '@angular/common/http';
import { BoardEffects } from './store/effects/board.effect';
import { ModalComponent } from './components/modal/modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddTaskComponent } from './components/add-task/add-task.component';
@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SideBarComponent,
    NavBarComponent,
    TaskComponent,
    ModalComponent,
    AddTaskComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    StoreModule.forRoot({
      theme: themeReducer,
      boards: boardReducer,
    }),
    EffectsModule.forRoot([ThemeEffects, BoardEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
