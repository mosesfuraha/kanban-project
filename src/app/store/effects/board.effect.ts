import { BoardService } from './../../services/board.service';

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as BoardActions from '../actions/board.action';

@Injectable()
export class BoardEffects {
  private actions$ = inject(Actions);
  constructor(private boardService: BoardService) {}

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoards),
      mergeMap(() =>
        this.boardService.getBoards().pipe(
          map((boards) => BoardActions.loadBoardsSuccess({ boards })),
          catchError((error) => of(BoardActions.loadBoardsFailure({ error })))
        )
      )
    )
  );
}
