interface MatchedUser {
  socketId: string;
}

export interface MatchedResponse {
  opponent: MatchedUser;
  me: MatchedUser;
  matchId: string;
}

export interface MatchApprovedResponse {
  roomId: string;
}

export interface SecretMatchCreatedResponse {
  secretCode: number;
}

export interface ErrorResponse {
  message: string;
  ok: boolean;
  statusCode: number;
  redirectPath?: string;
}
