import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
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

  on(BoardActions.updateBoard, (state, { board }) => {
    return boardAdapter.updateOne({ id: board.id, changes: board }, state);
  }),

  on(BoardActions.deleteBoard, (state, { boardId }) => {
    return boardAdapter.removeOne(boardId, state);
  }),

  on(BoardActions.setActiveBoard, (state, { boardId }) => {
    return {
      ...state,
      activeBoardId: boardId,
    };
  }),

  on(BoardActions.updateTask, (state, { boardId, updatedTask }) => {
    const board = state.entities[boardId];

    if (!board || !board.tasks) {
      return state; // Return the state unchanged if board or tasks are undefined
    }

    // Update the specific task in the board's tasks array
    const updatedTasks = board.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );

    return boardAdapter.updateOne(
      {
        id: boardId,
        changes: { tasks: updatedTasks },
      },
      state
    );
  })
);

export const {
  selectIds: selectBoardIds,
  selectEntities: selectBoardEntities,
  selectAll: selectAllBoards,
  selectTotal: selectBoardTotal,
} = boardAdapter.getSelectors();
