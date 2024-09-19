import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as BoardActions from '../actions/board.action';
import { Board, Task } from '../../models/board.model';

export interface BoardState extends EntityState<Board> {
  activeBoardId: string | null;
}

export const boardAdapter: EntityAdapter<Board> = createEntityAdapter<Board>();

export const initialBoardState: BoardState = boardAdapter.getInitialState({
  activeBoardId: null,
});

export const boardReducer = createReducer(
  initialBoardState,

  on(BoardActions.loadBoardsSuccess, (state, { boards }) => {
    return boardAdapter.setAll(boards, state);
  }),

  on(BoardActions.setActiveBoard, (state, { boardId }) => {
    return {
      ...state,
      activeBoardId: boardId,
    };
  }),

  on(BoardActions.addTask, (state, { boardName, task, newColIndex }) => {
    const board = Object.values(state.entities).find(
      (b) => b?.name === boardName
    );

    if (!board || !board.columns[newColIndex]) return state;

    const updatedColumns = board.columns.map((column, index) => {
      if (index === newColIndex) {
        return {
          ...column,
          tasks: [...column.tasks, task],
        };
      }
      return column;
    });

    const updatedBoard = {
      ...board,
      columns: updatedColumns,
    };

    return boardAdapter.updateOne(
      {
        id: board.id,
        changes: updatedBoard,
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
