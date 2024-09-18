import { createAction, props } from '@ngrx/store';
import { Board, Task } from '../../models/board.model';

export const loadBoards = createAction('[Board] Load Boards');

export const loadBoardsSuccess = createAction(
  '[Board] Load Boards Success',
  props<{ boards: Board[] }>()
);
export const loadBoardsFailure = createAction(
  '[Board] Load Boards Failure',
  props<{ error: any }>()
);
export const addBoard = createAction(
  '[Board] Add Board',
  props<{ board: Board }>()
);

export const updateBoard = createAction(
  '[Board] Update Board',
  props<{ board: Board }>()
);

export const deleteBoard = createAction(
  '[Board] Delete Board',
  props<{ boardId: string }>()
);

export const setActiveBoard = createAction(
  '[Board] Set Active Board',
  props<{ boardId: string }>()
);

export const addBoardFailure = createAction(
  '[Board] Add Board Failure',
  props<{ error: Board }>()
);

export const updateBoardFailure = createAction(
  '[Board] Update Board Failure',
  props<{ error: Board }>()
);

export const deleteBoardFailure = createAction(
  '[Board] Delete Board Failure',
  props<{ error: Board }>()
);

export const updateTask = createAction(
  '[Board] Update Task',
  props<{ boardId: string; updatedTask: Task }>()
);
