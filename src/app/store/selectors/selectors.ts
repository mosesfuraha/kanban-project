import { createSelector } from '@ngrx/store';
import { BoardState, selectAllBoards } from '../reducers/reducer.board';
import { Board, Task } from '../../models/board.model';

export const selectBoardState = (state: {
  theme: { isDarkMode: boolean };
  boards: BoardState;
}) => state.boards;

export const selectAllBoardsFromStore = createSelector(
  selectBoardState,
  selectAllBoards
);

export const selectBoardById = (boardId: string) =>
  createSelector(selectBoardState, (state: BoardState) =>
    state.entities ? state.entities[boardId] : null
  );

export const selectActiveBoard = createSelector(
  selectBoardState,
  (state: BoardState) => {
    const activeBoardId = state.activeBoardId;
    return activeBoardId ? state.entities[activeBoardId] || null : null;
  }
);

export const selectTaskById = (taskId: string) =>
  createSelector(selectActiveBoard, (activeBoard: Board | null) => {
    if (!activeBoard) return null;
    for (const column of activeBoard.columns) {
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return null;
  });
