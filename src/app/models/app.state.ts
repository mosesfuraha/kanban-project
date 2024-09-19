import { BoardState } from "../store/reducers/reducer.board";
import { ThemeState } from "../theme/theme.reducers";


export interface AppState {
  theme: ThemeState;
  boards: BoardState;
}
