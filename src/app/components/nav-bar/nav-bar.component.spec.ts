import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { NavBarComponent } from './nav-bar.component';
import { deleteBoard } from '../../store/actions/board.action';
import { Board } from '../../models/board.model';
import { toggleTheme } from '../../theme/theme.actions';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let mockStore: any;

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

    await TestBed.configureTestingModule({
      declarations: [NavBarComponent],
      imports: [
        StoreModule.forRoot({}), // Provide a mock reducer
      ],
      providers: [{ provide: Store, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown', () => {
    const initialDropdownState = component.isDropdownOpen;
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(!initialDropdownState);
  });

  it('should navigate to board and emit event', () => {
    const board: Board = { id: '1', name: 'Test Board', columns: [] };
    jest.spyOn(component.boardSelected, 'emit'); // Spy on the emit method

    component.navigateTo(board);

    expect(component.selectedBoard).toBe(board);
    expect(component.boardSelected.emit).toHaveBeenCalledWith(board);
    expect(component.isDropdownOpen).toBe(false);
  });

  it('should check if board is active', () => {
    component.selectedBoard = { id: '1', name: 'Test Board', columns: [] };
    expect(component.isActive('Test Board')).toBe(true);
    expect(component.isActive('Another Board')).toBe(false);
  });

  it('should toggle theme', () => {
    component.toggleTheme();
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleTheme());
  });

  it('should toggle modal', () => {
    const initialModalState = component.isModalOpen;
    component.toggleModal();
    expect(component.isModalOpen).toBe(!initialModalState);
  });

  it('should toggle add task modal', () => {
    const initialAddTaskModalState = component.isAddTaskModalOpen;
    component.toggleAddTaskModal();
    expect(component.isAddTaskModalOpen).toBe(!initialAddTaskModalState);
  });

  it('should toggle delete board modal', () => {
    const initialDeleteBoardModalState = component.isDeleteBoardModalOpen;
    component.toggleDeleteBoardModal();
    expect(component.isDeleteBoardModalOpen).toBe(
      !initialDeleteBoardModalState
    );
  });

  it('should delete board and close delete board modal', () => {
    const board: Board = { id: '1', name: 'Test Board', columns: [] };
    component.selectedBoard = board;

    component.toggleDeleteBoardModal(); // Open the modal first
    component.deleteBoard();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      deleteBoard({ boardId: board.id })
    );
    expect(component.isDeleteBoardModalOpen).toBe(false);
  });

  it('should open edit board modal', () => {
    const board: Board = { id: '1', name: 'Test Board', columns: [] };
    component.selectedBoard = board;

    component.openEditBoardModal();

    expect(component.boardForEdit).toBe(board);
    expect(component.isEditBoardModalOpen).toBe(true);
  });

  it('should close edit board modal', () => {
    component.openEditBoardModal(); // Open the modal first
    component.closeEditBoardModal();

    expect(component.isEditBoardModalOpen).toBe(false);
    expect(component.boardForEdit).toBeNull();
  });
});
