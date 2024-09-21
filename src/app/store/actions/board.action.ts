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
export const addTask = createAction(
  '[Board] Add Task',
  props<{ boardName: string; task: Task; newColIndex: number }>()
);

export const setSubtaskCompleted = createAction(
  '[Board] Toggle Subtask Completion',
  props<{
    colIndex: number;
    taskIndex: number;
    subtaskIndex: number;
    isCompleted: boolean;
    subtaskId: string;
  }>()
);
export const setTaskStatus = createAction(
  '[Board] Set Task Status',
  props<{
    colIndex: number;
    taskIndex: number;
    newStatus: string;
    boardId: string;
  }>()
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
