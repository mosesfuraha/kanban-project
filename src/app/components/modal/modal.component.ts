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
  @Output() closeModal = new EventEmitter<void>();
  @Output() subtaskToggled = new EventEmitter<Subtask>();

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
    this.task?.subtasks.forEach((subtask) => {
      this.subtasks.push(
        this.fb.group({
          title: [subtask.title],
          isCompleted: [subtask.isCompleted],
        })
      );
    });
  }

  toggleSubtaskCompletion(index: number) {
    const subtask = this.subtasks.at(index);
    const isCompleted = subtask.get('isCompleted')?.value;
    subtask.patchValue({ isCompleted: !isCompleted });
    const updatedSubtask:any = {
      ...this.task?.subtasks[index],
      isCompleted: !isCompleted,
    };
    this.subtaskToggled.emit(updatedSubtask);
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
