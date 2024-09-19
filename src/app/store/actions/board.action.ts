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

export const setSubtaskCompleted = createAction(
  'boards/setSubtaskCompleted',
  props<{
    colIndex: number;
    taskIndex: number;
    subtaskIndex: number;
    isCompleted: boolean;
  }>()
);



export const addBoard = createAction(
  '[Board] Add Board',
  props<{ board: Board }>()
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
export function selectBoard(arg0: { board: Board; }): any {
  throw new Error('Function not implemented.');
}

