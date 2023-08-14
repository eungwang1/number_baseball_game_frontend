export interface BaseballErrorResponse {
  message: string;
  ok: boolean;
  statusCode: number;
  redirectPath?: string;
}

export interface BaseballGameStartResponse {
  myNumber: string;
  mySocketId: string;
}

export interface BaseballGameEndResponse {
  isWin: boolean;
}

export interface BaseballChangeTurnResponse {
  turn: string;
}

export interface BaseballGuessResultResponse {
  strike: number;
  ball: number;
  baseball_number: string;
}

export interface BaseballGameResult {
  isWin: boolean;
}
