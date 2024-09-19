import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Board, Subtask, Task } from '../../models/board.model';
import * as BoardActions from '../../store/actions/board.action';
import { BoardState } from '../../store/reducers/reducer.board';
import { selectAllBoardsFromStore } from '../../store/selectors/selectors';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  boards$: Observable<Board[]>;
  @Input() selectedBoard: Board | null = null;

  isModalOpen = false;
  selectedTask: Task | null = null;

  constructor(
    private store: Store<{
      theme: { isDarkMode: boolean };
      boards: BoardState;
    }>,
    private cdr: ChangeDetectorRef 
  ) {
    this.isDarkMode$ = this.store.select((state) => state.theme.isDarkMode);
    this.boards$ = this.store.select(selectAllBoardsFromStore);
  }

  ngOnInit(): void {
    this.store.dispatch(BoardActions.loadBoards());
  }

  onBoardSelected(board: Board): void {
    this.selectedBoard = board;
  }

  getCompletedSubtaskCount(task: Task): number {
    return task.subtasks
      ? task.subtasks.filter((subtask: Subtask) => subtask.isCompleted).length
      : 0;
  }

  getTotalSubtaskCount(task: Task): number {
    return task.subtasks ? task.subtasks.length : 0;
  }

  openTaskModal(task: Task) {
    this.selectedTask = task;
    this.isModalOpen = true;
    this.cdr.detectChanges();
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
    this.store.dispatch(
      BoardActions.setSubtaskCompleted({
        colIndex: event.colIndex,
        taskIndex: event.taskIndex,
        subtaskIndex: event.subtaskIndex,
        isCompleted: event.isCompleted,
      })
    );
  }
}
