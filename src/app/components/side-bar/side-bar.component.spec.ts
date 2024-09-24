import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { SideBarComponent } from './side-bar.component';
import { TaskService } from '../../services/task.service';
import { setActiveBoard } from '../../store/actions/board.action';
import { Board } from '../../models/board.model';
import { toggleTheme } from '../../theme/theme.actions';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let mockStore: any;
  let mockTaskService: any;

  beforeEach(async () => {
    mockStore = {
      select: jest.fn().mockImplementation((selector) => {
        if (selector === 'theme') {
          return of({ isDarkMode: true });
        } else if (selector === 'boards') {
          return of({
            activeBoard: { id: '1', name: 'Active Board', columns: [] },
            boards: [],
          });
        }
        return of([]);
      }),
      dispatch: jest.fn(),
    };

    mockTaskService = {
      setSelectedBoard: jest.fn(),
      setSelectedColumnId: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SideBarComponent],
      imports: [
        StoreModule.forRoot({}), // Provide a mock reducer
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: TaskService, useValue: mockTaskService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set active board and update state', () => {
    const board: Board = {
      id: '1',
      name: 'Test Board',
      columns: [{ id: 'col1', name: 'Column 1', tasks: [] }],
    };

    component.setActive(board);

    expect(component.activeItem).toBe(board.name);
    expect(mockTaskService.setSelectedBoard).toHaveBeenCalledWith(board);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      setActiveBoard({ boardId: board.id })
    );
    expect(mockTaskService.setSelectedColumnId).toHaveBeenCalledWith(
      board.columns[0].id
    );
  });

  it('should get active board from store', () => {
    const activeBoard = component.getActiveBoardFromStore();
    expect(activeBoard).toEqual({ id: '1', name: 'Active Board', columns: [] });
  });

  it('should select column', () => {
    const columnId = 'col1';
    component.selectColumn(columnId);
    expect(mockTaskService.setSelectedColumnId).toHaveBeenCalledWith(columnId);
  });

  it('should check if board is active', () => {
    component.activeItem = 'Test Board';
    expect(component.isActive('Test Board')).toBe(true);
    expect(component.isActive('Another Board')).toBe(false);
  });

  it('should toggle theme', () => {
    component.toggleTheme();
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleTheme());
  });

  it('should open create board modal', () => {
    component.openCreateBoardModal();
    expect(component.isCreateBoardModalOpen).toBe(true);
  });

  it('should close create board modal', () => {
    component.openCreateBoardModal(); // Open it first
    component.closeCreateBoardModal();
    expect(component.isCreateBoardModalOpen).toBe(false);
  });
});
