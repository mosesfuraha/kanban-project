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
