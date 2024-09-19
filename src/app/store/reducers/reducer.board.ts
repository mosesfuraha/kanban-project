import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as BoardActions from '../actions/board.action';
import { Board } from '../../models/board.model';

export interface BoardState extends EntityState<Board> {
  activeBoardId: string | null;
}

export const boardAdapter = createEntityAdapter<Board>();

export const initialBoardState: BoardState = boardAdapter.getInitialState({
  activeBoardId: null,
});

export const boardReducer = createReducer(
  initialBoardState,

  on(BoardActions.loadBoardsSuccess, (state, { boards }) => {
    return boardAdapter.setAll(boards, state);
  }),

  on(BoardActions.addBoard, (state, { board }) => {
    return boardAdapter.addOne(board, state);
  }),

  on(BoardActions.setActiveBoard, (state, { boardId }) => {
    return {
      ...state,
      activeBoardId: boardId,
    };
  }),

  on(
    BoardActions.setSubtaskCompleted,
    (state, { colIndex, taskIndex, subtaskIndex, isCompleted }) => {
      const activeBoard = state.entities[state.activeBoardId!];

      if (!activeBoard) return state;

      const updatedBoard = JSON.parse(JSON.stringify(activeBoard));

      updatedBoard.columns[colIndex].tasks[taskIndex].subtasks[
        subtaskIndex
      ].isCompleted = isCompleted;

      return boardAdapter.updateOne(
        {
          id: state.activeBoardId!,
          changes: updatedBoard,
        },
        state
      );
    }
  )
);

export const {
  selectIds: selectBoardIds,
  selectEntities: selectBoardEntities,
  selectAll: selectAllBoards,
  selectTotal: selectBoardTotal,
} = boardAdapter.getSelectors();
