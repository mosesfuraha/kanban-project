import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { addTask, editTask } from '../../store/actions/board.action';
import { Column, Task, Board } from '../../models/board.model';
import { TaskService } from '../../services/task.service';
import { AppState } from '../../models/app.state';
import { selectActiveBoard } from '../../store/selectors/selectors';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit {
  taskForm: FormGroup;
  showForm: boolean = true;
  isEditMode: boolean = false;

  boardName: string | null = null;
  columns: Column[] = [];
  selectedColumnId: string | null = null;
  selectedBoard: Board | null = null;
  @Input() task: Task | null = null;
  @Output() onModalClose = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      subtasks: this.fb.array([this.fb.control('', Validators.required)]),
      status: ['todo', Validators.required],
      columnId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.store.select(selectActiveBoard).subscribe((board: Board | null) => {
      if (board) {
        this.selectedBoard = board;
        this.boardName = board.name;
        this.columns = board.columns;
      }
    });

    if (this.task) {
      this.isEditMode = true;
      this.prefillForm(this.task);
    }
  }

  prefillForm(task: Task) {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      columnId: this.getTaskColumnId(task),
    });

    this.subtasks.clear();
    task.subtasks.forEach((subtask) => {
      this.subtasks.push(this.fb.control(subtask.title, Validators.required));
    });
  }

  getTaskColumnId(task: Task): string {
    return this.columns.find((col) => col.tasks.some((t) => t.id === task.id))
      ?.id!;
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
    this.selectedColumnId = this.taskForm.value.columnId;

    if (!this.selectedBoard) {
      console.error('No board found!');
      return;
    }

    if (!this.selectedColumnId) {
      console.error('Column ID is missing!');
      return;
    }

    const updatedSubtasks = this.taskForm.value.subtasks.map(
      (subtask: string, index: number) => ({
        id: this.task?.subtasks[index]?.id || uuidv4(),
        title: subtask,
        isCompleted: this.task?.subtasks[index]?.isCompleted || false,
      })
    );

    const colIndex = this.selectedBoard.columns.findIndex(
      (column) => column.id === this.selectedColumnId
    );

    if (colIndex === -1) {
      console.error('Column not found in the selected board!');
      return;
    }

    if (this.isEditMode && this.task) {
      const updatedTask: Task = {
        ...this.task,
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        subtasks: updatedSubtasks,
      };

      this.store.dispatch(
        editTask({
          task: updatedTask,
          boardId: this.selectedBoard.id,
          colIndex: colIndex,
        })
      );
    } else {
      const newTask: Task = {
        id: uuidv4(),
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        subtasks: updatedSubtasks,
      };

      this.store.dispatch(
        addTask({
          boardName: this.boardName!,
          task: newTask,
          newColIndex: colIndex,
        })
      );
    }

    this.taskForm.reset({
      title: '',
      description: '',
      subtasks: [''],
      status: 'todo',
      columnId: '',
    });
    this.subtasks.clear();

    this.closeModal();
  }

  closeModal() {
    this.showForm = false;
    this.onModalClose.emit();
  }
}
