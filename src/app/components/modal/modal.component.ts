import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, Subtask } from '../../models/board.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() task: Task | null = null;
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }

  // Update the completion status of a subtask
  toggleSubtaskCompletion(subtask: Subtask) {
    subtask.isCompleted = !subtask.isCompleted; // Toggle the completion status
  }

  getCompletedSubtaskCount(task: Task): number {
    return task.subtasks
      ? task.subtasks.filter((subtask: Subtask) => subtask.isCompleted).length
      : 0;
  }

  getTotalSubtaskCount(task: Task): number {
    return task.subtasks ? task.subtasks.length : 0;
  }
}
