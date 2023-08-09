interface MatchedUser {
  socketId: string;
}

export interface MatchedResponse {
  opponent: MatchedUser;
  me: MatchedUser;
  roomId: string;
}
