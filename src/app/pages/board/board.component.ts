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

  isModalOpen = false;
  selectedTask: Task | null = null;
  selectedColIndex: number = 0;
  selectedTaskIndex: number = 0;

  constructor(
    private store: Store<{
      theme: { isDarkMode: boolean };
      boards: BoardState;
    }>
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
    this.boards$ = this.store.select(selectAllBoardsFromStore);
    this.selectedBoard$ = this.store.select(selectActiveBoard);

    // // Log the selected board to check the data
    // this.selectedBoard$.subscribe((board) => {
    //   console.log('Selected Board:', board);
    // });
  }

  ngOnInit(): void {
    this.store.dispatch(BoardActions.loadBoards());

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
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = null;
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
