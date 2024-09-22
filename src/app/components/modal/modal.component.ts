import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Task, Board } from '../../models/board.model';
import { Store } from '@ngrx/store';
import {
  setSubtaskCompleted,
  setTaskStatus,
} from '../../store/actions/board.action';

import { AppState } from '../../models/app.state';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() colIndex: number = 0;
  @Input() taskIndex: number = 0;
  @Input() activeBoard: Board | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() subtaskToggled = new EventEmitter<{
    colIndex: number;
    taskIndex: number;
    subtaskIndex: number;
    isCompleted: boolean;
  }>();

  subtaskForm: FormGroup;
  selectedStatus: string = '';

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.subtaskForm = this.fb.group({
      subtasks: this.fb.array([]),
      selectedStatus: '',
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.setSubtasks();
      this.selectedStatus = this.task.status;
    }
  }

  get subtasks() {
    return this.subtaskForm.get('subtasks') as FormArray;
  }

  setSubtasks() {
    const subtaskFGs = this.task?.subtasks.map((subtask, index) => {
      return this.fb.group({
        title: [subtask.title],
        isCompleted: [subtask.isCompleted],
      });
    });

    if (subtaskFGs) {
      this.subtaskForm.setControl('subtasks', this.fb.array(subtaskFGs));
    }
  }

  toggleSubtaskCompletion(index: number) {
    const subtask = this.subtasks.at(index);
    const subtaskData = this.task?.subtasks[index];
    const isCompleted = subtask?.get('isCompleted')?.value ?? false;

    if (subtaskData && this.activeBoard) {
      subtask.patchValue({ isCompleted: !isCompleted });
      this.store.dispatch(
        setSubtaskCompleted({
          colIndex: this.colIndex,
          taskIndex: this.taskIndex,
          subtaskIndex: index,
          isCompleted: !isCompleted,
          subtaskId: subtaskData.id,
        })
      );
    }
  }

  handleStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;

    this.selectedStatus = newStatus;

    if (this.task && this.activeBoard) {
      this.store.dispatch(
        setTaskStatus({
          colIndex: this.colIndex,
          taskIndex: this.taskIndex,
          newStatus,
          boardId: this.activeBoard.id,
        })
      );
    }
  }

  getCompletedSubtaskCount(): number {
    return this.subtasks.controls.filter(
      (control) => control.get('isCompleted')?.value
    ).length;
  }

  getTotalSubtaskCount(): number {
    return this.subtasks.length;
  }

  onClose() {
    this.closeModal.emit();
  }
}
