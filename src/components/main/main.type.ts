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
