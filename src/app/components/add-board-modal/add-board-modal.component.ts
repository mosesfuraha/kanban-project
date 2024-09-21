import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app.state';
import { addBoard } from '../../store/actions/board.action';
import { Board } from '../../models/board.model';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

@Component({
  selector: 'app-add-board-modal',
  templateUrl: './add-board-modal.component.html',
  styleUrls: ['./add-board-modal.component.css'],
})
export class AddBoardModalComponent implements OnInit {
  addBoardForm: FormGroup;
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.addBoardForm = this.fb.group({
      boardName: ['', [Validators.required, Validators.minLength(3)]],
      columns: this.fb.array([this.createColumn()]),
    });
  }

  ngOnInit(): void {}

  get columns(): FormArray {
    return this.addBoardForm.get('columns') as FormArray;
  }

  createColumn(): FormGroup {
    return this.fb.group({
      id: [uuidv4()],
      name: ['', Validators.required],
    });
  }

  addColumn(): void {
    this.columns.push(this.createColumn());
  }

  removeColumn(index: number): void {
    this.columns.removeAt(index);
  }

  generateBoardId(): string {
    return uuidv4();
  }

  onSubmit(): void {
    if (this.addBoardForm.valid) {
      const newBoard: Board = {
        id: this.generateBoardId(),
        name: this.addBoardForm.value.boardName,
        columns: this.addBoardForm.value.columns.map((col: any) => ({
          id: col.id,
          name: col.name,
          tasks: [],
        })),
      };

      this.store.dispatch(addBoard({ board: newBoard }));

      this.closeModal();
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
