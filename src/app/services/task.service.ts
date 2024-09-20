import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public selectedBoardSource = new BehaviorSubject<Board | null>(null);
  private selectedColumnIdSource = new BehaviorSubject<string | null>(null);

  selectedBoard$ = this.selectedBoardSource.asObservable();
  selectedColumnId$ = this.selectedColumnIdSource.asObservable();

  setSelectedBoard(board: Board) {
    this.selectedBoardSource.next(board);
  }

  setSelectedColumnId(columnId: string) {
    this.selectedColumnIdSource.next(columnId);
  }
}
