import { createSelector } from '@ngrx/store';
import { BoardState, selectAllBoards } from '../reducers/reducer.board';

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

