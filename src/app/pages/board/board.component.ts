import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Board, Task } from '../../models/board.model';
import * as BoardActions from '../../store/actions/board.action';
import { BoardState } from '../../store/reducers/reducer.board';
import {
  selectActiveBoard,
  selectAllBoardsFromStore,
} from '../../store/selectors/selectors';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  boards$: Observable<Board[]>;
  selectedBoard$: Observable<Board | null>;
  activeBoard: Board | null = null;

  isModalOpen = false;
  isEditTaskModalOpen = false;
  isBoardModalOpen = false;
  selectedTask: Task | null = null;
  selectedColIndex: number = 0;
  selectedTaskIndex: number = 0;
  selectedBoardForEdit: Board | null = null;
  selectedTaskForEdit: Task | null = null;

  constructor(
    private store: Store<{
      theme: { isDarkMode: boolean };
      boards: BoardState;
    }>
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
    this.boards$ = this.store.select(selectAllBoardsFromStore);
    this.selectedBoard$ = this.store.select(selectActiveBoard);
  }

  ngOnInit(): void {
    this.store.dispatch(BoardActions.loadBoards());

    this.selectedBoard$.subscribe((board) => {
      this.activeBoard = board;
    });

    this.boards$.subscribe((boards) => {
      if (boards.length > 0) {
        this.store.dispatch(
          BoardActions.setActiveBoard({ boardId: boards[0].id })
        );
      }
    });
  }

  getCompletedSubtaskCount(task: Task): number {
    return task.subtasks
      ? task.subtasks.filter((subtask) => subtask.isCompleted).length
      : 0;
  }

  getTotalSubtaskCount(task: Task): number {
    return task.subtasks ? task.subtasks.length : 0;
  }

  openTaskModal(columnIndex: number, taskIndex: number, task: Task) {
    this.selectedTask = task;
    this.selectedColIndex = columnIndex;
    this.selectedTaskIndex = taskIndex;
    this.isModalOpen = true; // Show task modal
    this.isEditTaskModalOpen = false; // Ensure edit modal is closed
  }

  // Open Edit Task Modal
  openEditTaskModal(task: Task) {
    this.selectedTaskForEdit = task;
    this.isEditTaskModalOpen = true; // Show edit task modal
    this.isModalOpen = false; // Close task modal
  }

  // Close Task Modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = null;
  }

  // Close Edit Task Modal
  closeEditTaskModal() {
    this.isEditTaskModalOpen = false;
    this.selectedTaskForEdit = null;
  }

  openBoardEditModal(board: Board | null) {
    if (board) {
      this.selectedBoardForEdit = board;
      this.isBoardModalOpen = true;
    }
  }

  closeBoardModal() {
    this.isBoardModalOpen = false;
    this.selectedBoardForEdit = null;
  }

  handleSubtaskToggled(
    event: {
      colIndex: number;
      taskIndex: number;
      subtaskIndex: number;
      isCompleted: boolean;
    },
    task: Task
  ): void {
    const subtaskId = task.subtasks[event.subtaskIndex].id;

    this.store.dispatch(
      BoardActions.setSubtaskCompleted({
        colIndex: event.colIndex,
        taskIndex: event.taskIndex,
        subtaskIndex: event.subtaskIndex,
        isCompleted: event.isCompleted,
        subtaskId: subtaskId,
      })
    );
  }
}
