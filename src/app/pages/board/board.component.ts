import { Component, Input, OnInit } from '@angular/core';
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
    private store: Store<{ theme: { isDarkMode: boolean }; boards: BoardState }>
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
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = null;
  }

  handleSubtaskToggled(updatedSubtask: Subtask, task: Task) {
    const updatedTask = {
      ...task,
      subtasks: task.subtasks.map((subtask) =>
        subtask.id === updatedSubtask.id ? updatedSubtask : subtask
      ),
    };

    this.store.dispatch(
      BoardActions.updateTask({ boardId: this.selectedBoard?.id!, updatedTask })
    );
  }
}
