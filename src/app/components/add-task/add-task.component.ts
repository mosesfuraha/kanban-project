// add-task.component.ts
import { Component, Input } from '@angular/core';
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

  @Input() boardId!: string; // Get the boardId via input property
  @Input() columnId!: string; // Get the columnId via input property

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
      const task: Task = {
        id: uuidv4(),
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        subtasks: this.subtasks.value.map((title: string) => ({
          id: uuidv4(),
          title,
          isCompleted: false,
        })),
        isActive: true,
      };

    

      this.taskForm.reset({
        title: '',
        description: '',
        subtasks: [''],
        status: 'todo',
      });
      this.subtasks.clear();
      this.addSubtask(); // Reset to one initial subtask
      this.showForm = false; // Toggle to success message
    } else {
      this.taskForm.markAllAsTouched(); // Mark all controls as touched if the form is invalid
    }
  }
}
