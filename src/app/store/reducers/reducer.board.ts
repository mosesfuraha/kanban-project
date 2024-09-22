import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as BoardActions from '../actions/board.action';
import { Board } from '../../models/board.model';

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
  on(BoardActions.addBoard, (state, { board }) => {
    return boardAdapter.addOne(board, state);
  }),

  on(BoardActions.setActiveBoard, (state, { boardId }) => {
    return {
      ...state,
      activeBoardId: boardId,
    };
  }),

  //reducer for adding new task
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
  }),

  //reducer for  editing new task
  on(BoardActions.editTask, (state, { boardId, colIndex, task }) => {
    const board = state.entities[boardId || state.activeBoardId || ''];

    if (!board) return state;

    const updatedColumns = board.columns.map((column, index) => {
      if (index === colIndex) {
        return {
          ...column,
          tasks: column.tasks.map((t) =>
            t.id === task.id ? { ...t, ...task } : t
          ),
        };
      }
      return column;
    });

    const updatedBoard = { ...board, columns: updatedColumns };

    return boardAdapter.updateOne(
      {
        id: board.id,
        changes: updatedBoard,
      },
      state
    );
  }),

  on(BoardActions.updateBoard, (state, { board }) => {
    return boardAdapter.updateOne(
      {
        id: board.id,
        changes: board,
      },
      state
    );
  }),

  on(
    BoardActions.setSubtaskCompleted,
    (state, { colIndex, taskIndex, subtaskIndex, isCompleted, subtaskId }) => {
      const activeBoard = state.entities[state.activeBoardId || ''];

      if (!activeBoard) return state;

      const updatedColumns = activeBoard.columns.map((column, cIndex) => {
        if (cIndex === colIndex) {
          const updatedTasks = column.tasks.map((task, tIndex) => {
            if (tIndex === taskIndex) {
              const updatedSubtasks = task.subtasks.map((subtask, sIndex) => {
                if (subtask.id === subtaskId) {
                  return { ...subtask, isCompleted };
                }
                return subtask;
              });

              return { ...task, subtasks: updatedSubtasks };
            }
            return task;
          });

          return { ...column, tasks: updatedTasks };
        }
        return column;
      });

      const updatedBoard = { ...activeBoard, columns: updatedColumns };

      return {
        ...state,
        entities: {
          ...state.entities,
          [activeBoard.id]: updatedBoard,
        },
      };
    }
  ),
  on(
    BoardActions.setSubtaskCompleted,
    (state, { colIndex, taskIndex, subtaskIndex, isCompleted, subtaskId }) => {
      const activeBoard = state.entities[state.activeBoardId || ''];

      if (!activeBoard) return state;

      const updatedColumns = activeBoard.columns.map((column, cIndex) => {
        if (cIndex === colIndex) {
          const updatedTasks = column.tasks.map((task, tIndex) => {
            if (tIndex === taskIndex) {
              const updatedSubtasks = task.subtasks.map((subtask, sIndex) => {
                if (subtask.id === subtaskId) {
                  return { ...subtask, isCompleted }; // Immutably update the subtask
                }
                return subtask;
              });
              return { ...task, subtasks: updatedSubtasks }; // Immutably update the task
            }
            return task;
          });
          return { ...column, tasks: updatedTasks }; // Immutably update the column
        }
        return column;
      });

      const updatedBoard = { ...activeBoard, columns: updatedColumns }; // Immutably update the board

      return {
        ...state,
        entities: {
          ...state.entities,
          [activeBoard.id]: updatedBoard, // Immutably update the state
        },
      };
    }
  ),

  on(
    BoardActions.setTaskStatus,
    (state, { colIndex, taskIndex, newStatus, boardId }) => {
      const board = state.entities[boardId || state.activeBoardId || ''];

      if (!board) return state;

      // Find the task to move
      const taskToMove = board.columns[colIndex]?.tasks[taskIndex];
      if (!taskToMove) return state;

      // Update the task's status
      const updatedTask = { ...taskToMove, status: newStatus };

      // Remove the task from the current column
      const updatedColumns = board.columns.map((column, columnIdx) => {
        if (columnIdx === colIndex) {
          return {
            ...column,
            tasks: column.tasks.filter((_, idx) => idx !== taskIndex), // Remove task immutably
          };
        }
        return column;
      });

      // Find the target column to move the task to based on status
      const targetColumnIdx = updatedColumns.findIndex(
        (column) => column.name.toLowerCase() === newStatus.toLowerCase()
      );

      if (targetColumnIdx === -1) {
        // If the target column does not exist, return the state
        return state;
      }

      // Add the task to the new column
      const finalColumns = updatedColumns.map((column, idx) => {
        if (idx === targetColumnIdx) {
          return {
            ...column,
            tasks: [...column.tasks, updatedTask], // Add task immutably
          };
        }
        return column;
      });

      // Update the board with the new columns
      const updatedBoard = { ...board, columns: finalColumns };

      return {
        ...state,
        entities: {
          ...state.entities,
          [board.id]: updatedBoard,
        },
      };
    }
  )
);

export const {
  selectIds: selectBoardIds,
  selectEntities: selectBoardEntities,
  selectAll: selectAllBoards,
  selectTotal: selectBoardTotal,
} = boardAdapter.getSelectors();
