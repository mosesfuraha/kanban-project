import { createSelector } from '@ngrx/store';
import { BoardState, selectAllBoards } from '../reducers/reducer.board';
import { Board } from '../../models/board.model';

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

export const selectTasksFromActiveBoard = createSelector(
  selectActiveBoard,
  (board: Board | null, props: { colIndex: number; taskIndex: number }) => {
    if (board && board.columns && board.columns[props.colIndex]) {
      return board.columns[props.colIndex].tasks[props.taskIndex];
    }
    return null;
  }
);