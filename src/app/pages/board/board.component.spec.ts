import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as BoardActions from '../../store/actions/board.action';
import { Board } from '../../models/board.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let mockStore: any;

  const mockBoard: Board = {
    id: '1',
    name: 'Test Board',
    columns: [],
  };

  beforeEach(async () => {
    mockStore = {
      select: jest.fn(),
      dispatch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [BoardComponent],
      providers: [{ provide: Store, useValue: mockStore }],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to store and load boards on init', () => {
    const mockBoards = [mockBoard];

    mockStore.select.mockImplementation((selector: any) => {
      if (selector === 'theme.isDarkMode') {
        return of(false);
      }
      if (selector === 'boards') {
        return of(mockBoards);
      }
      return of(null);
    });

    fixture.detectChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(BoardActions.loadBoards());
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      BoardActions.setActiveBoard({ boardId: '1' })
    );
  });

  it('should open task modal with correct parameters', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      description: '',
      subtasks: [],
      status: 'In Progress',
    };

    component.openTaskModal(1, 2, task);

    expect(component.selectedTask).toEqual(task);
    expect(component.selectedColIndex).toEqual(1);
    expect(component.selectedTaskIndex).toEqual(2);
    expect(component.isModalOpen).toBeTruthy();
  });

  it('should open and close edit task modal', () => {
    const task = {
      id: '2',
      title: 'Edit Task',
      description: '',
      subtasks: [],
      status: 'Completed',
    };

    component.openEditTaskModal(task);
    expect(component.selectedTaskForEdit).toEqual(task);
    expect(component.isEditTaskModalOpen).toBeTruthy();
    expect(component.isModalOpen).toBeFalsy();

    component.closeEditTaskModal();
    expect(component.selectedTaskForEdit).toBeNull();
    expect(component.isEditTaskModalOpen).toBeFalsy();
  });

  it('should handle subtask toggle', () => {
    const task = {
      id: '3',
      title: 'Task with Subtask',
      description: '',
      subtasks: [
        { id: 'subtask1', title: 'Subtask 1', isCompleted: false }, // Add the 'title' property
      ],
      status: 'Not Started',
    };

    const event = {
      colIndex: 0,
      taskIndex: 0,
      subtaskIndex: 0,
      isCompleted: true,
    };

    component.handleSubtaskToggled(event, task);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      BoardActions.setSubtaskCompleted({
        colIndex: event.colIndex,
        taskIndex: event.taskIndex,
        subtaskIndex: event.subtaskIndex,
        isCompleted: event.isCompleted,
        subtaskId: 'subtask1',
      })
    );
  });
});
