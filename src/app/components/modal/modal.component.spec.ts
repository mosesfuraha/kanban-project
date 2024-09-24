import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { ModalComponent } from './modal.component';
import {
  setSubtaskCompleted,
  setTaskStatus,
} from '../../store/actions/board.action';
import { Board, Task } from '../../models/board.model';


describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      select: jest.fn().mockImplementation((selector) => {
        if (selector === 'theme') {
          return of({ isDarkMode: true });
        }
        return of([]);
      }),
      dispatch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot({}), 
      ],
      providers: [FormBuilder, { provide: Store, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set subtasks on init', () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'To Do',
      subtasks: [
        { id: '1', title: 'Subtask 1', isCompleted: false },
        { id: '2', title: 'Subtask 2', isCompleted: true },
      ],
    };
    component.task = task;
    component.ngOnInit();

    expect(component.subtasks.length).toBe(2);
    expect(component.subtasks.at(0).value).toEqual({
      title: 'Subtask 1',
      isCompleted: false,
    });
    expect(component.subtasks.at(1).value).toEqual({
      title: 'Subtask 2',
      isCompleted: true,
    });
  });

  it('should toggle subtask completion', () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'To Do',
      subtasks: [
        { id: '1', title: 'Subtask 1', isCompleted: false },
        { id: '2', title: 'Subtask 2', isCompleted: true },
      ],
    };
    const board: Board = { id: '1', name: 'Test Board', columns: [] };
    component.task = task;
    component.activeBoard = board;
    component.ngOnInit();

    component.toggleSubtaskCompletion(0);

    expect(component.subtasks.at(0).value.isCompleted).toBe(true);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      setSubtaskCompleted({
        colIndex: component.colIndex,
        taskIndex: component.taskIndex,
        subtaskIndex: 0,
        isCompleted: true,
        subtaskId: '1',
      })
    );
  });

  it('should handle status change', () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'To Do',
      subtasks: [],
    };
    const board: Board = { id: '1', name: 'Test Board', columns: [] };
    component.task = task;
    component.activeBoard = board;
    component.ngOnInit();

    const event = { target: { value: 'In Progress' } } as unknown as Event;
    component.handleStatusChange(event);

    expect(component.selectedStatus).toBe('In Progress');
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      setTaskStatus({
        colIndex: component.colIndex,
        taskIndex: component.taskIndex,
        newStatus: 'In Progress',
        boardId: '1',
      })
    );
  });

  it('should get completed subtask count', () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'To Do',
      subtasks: [
        { id: '1', title: 'Subtask 1', isCompleted: false },
        { id: '2', title: 'Subtask 2', isCompleted: true },
      ],
    };
    component.task = task;
    component.ngOnInit();

    expect(component.getCompletedSubtaskCount()).toBe(1);
  });

  it('should get total subtask count', () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'To Do',
      subtasks: [
        { id: '1', title: 'Subtask 1', isCompleted: false },
        { id: '2', title: 'Subtask 2', isCompleted: true },
      ],
    };
    component.task = task;
    component.ngOnInit();

    expect(component.getTotalSubtaskCount()).toBe(2);
  });

  it('should close modal', () => {
    jest.spyOn(component.closeModal, 'emit'); 
    component.onClose();
    expect(component.isModalOpen).toBe(false);
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should toggle modal', () => {
    const initialModalState = component.isModalOpen;
    component.toggleModal();
    expect(component.isModalOpen).toBe(!initialModalState);
  });

  it('should prevent close on event', () => {
    const event = new MouseEvent('click');
    jest.spyOn(event, 'stopPropagation');
    component.preventClose(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should open edit task modal', () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'To Do',
      subtasks: [],
    };
    component.task = task;
    component.editCurrentTask();
    expect(component.isEditTaskModalOpen).toBe(true);
    expect(component.selectedTaskForEdit).toBe(task);
  });

  it('should close edit task modal', () => {
    component.closeEditTaskModal();
    expect(component.isEditTaskModalOpen).toBe(false);
    expect(component.selectedTaskForEdit).toBeNull();
  });
});
