import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { addTask } from '../../store/actions/board.action';
import { Task } from '../../models/board.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  taskForm: FormGroup;
  showForm: boolean = true;

  boardName: string = 'Platform Launch';
  columnId: string = '7446e088-0b9f-44da-9fc4-5de506b4649e';

  constructor(private fb: FormBuilder, private store: Store) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      subtasks: this.fb.array([this.fb.control('', Validators.required)]),
      status: ['todo', Validators.required],
    });
  }

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  get status() {
    return this.taskForm.get('status');
  }

  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(this.fb.control('', Validators.required));
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: uuidv4(),
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        subtasks: this.taskForm.value.subtasks.map((subtask: string) => ({
          id: uuidv4(),
          title: subtask,
          isCompleted: false,
        })),
      };

      const newColIndex = 0;

      this.store.dispatch(
        addTask({
          boardName: this.boardName,
          task: newTask,
          newColIndex: newColIndex,
        })
      );

      this.taskForm.reset({
        title: '',
        description: '',
        subtasks: [''],
        status: 'todo',
      });
      this.subtasks.clear();
      this.showForm = false;
    } else {
      this.taskForm.markAllAsTouched();
    }
  }
}
