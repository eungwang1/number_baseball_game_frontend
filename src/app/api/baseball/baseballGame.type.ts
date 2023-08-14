export interface BaseballNumberHistory {
  baseball_number: string;
  strike: number;
  ball: number;
}

export interface BaseballGame {
  id: string;
  user1: string;
  user2: string;
  user1_baseball_number: string;
  user2_baseball_number: string;
  turn: string;
  game_started: boolean;
  game_finished: boolean;
  user1_win: boolean;
  user2_win: boolean;
  user1_baseball_number_history: BaseballNumberHistory[];
  user2_baseball_number_history: BaseballNumberHistory[];
  created_at: Date;
  updated_at: Date;
}
