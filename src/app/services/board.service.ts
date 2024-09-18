
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private dataUrl = 'data.json';

  constructor(private http: HttpClient) {}

  private generateIdsForBoard(board: any): Board {
    return {
      ...board,
      id: uuidv4(),
      columns: board.columns.map((column: any) => ({
        ...column,
        id: uuidv4(),
        tasks: column.tasks.map((task: any) => ({
          ...task,
          id: uuidv4(),
          subtasks: task.subtasks.map((subtask: any) => ({
            ...subtask,
            id: uuidv4(),
          })),
        })),
      })),
    };
  } 

  getBoards(): Observable<Board[]> {
    return this.http
      .get<{ boards: Board[] }>(this.dataUrl)
      .pipe(map((response) => response.boards.map(this.generateIdsForBoard)));
  }
}
