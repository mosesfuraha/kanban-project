import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Task, Subtask } from '../../models/board.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() colIndex: number = 0;
  @Input() taskIndex: number = 0;

  @Output() closeModal = new EventEmitter<void>();
  @Output() subtaskToggled = new EventEmitter<{
    colIndex: number;
    taskIndex: number;
    subtaskIndex: number;
    isCompleted: boolean;
  }>();

  subtaskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.subtaskForm = this.fb.group({
      subtasks: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.setSubtasks();
    }
  }

  get subtasks() {
    return this.subtaskForm.get('subtasks') as FormArray;
  }

  setSubtasks() {
    const subtaskFGs = this.task?.subtasks.map((subtask) =>
      this.fb.group({
        title: [subtask.title],
        isCompleted: [subtask.isCompleted],
      })
    );

    if (subtaskFGs) {
      this.subtaskForm.setControl('subtasks', this.fb.array(subtaskFGs));
    }
  }

  toggleSubtaskCompletion(index: number) {
    const subtask = this.subtasks.at(index);
    const isCompleted = subtask.get('isCompleted')?.value;
    subtask.patchValue({ isCompleted: !isCompleted });

    this.subtaskToggled.emit({
      colIndex: this.colIndex,
      taskIndex: this.taskIndex,
      subtaskIndex: index,
      isCompleted: !isCompleted,
    });
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
