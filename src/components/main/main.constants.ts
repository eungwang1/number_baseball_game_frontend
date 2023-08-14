export const BASEBALL_EMIT_EVENTS = {
  REQUEST_RANDOM_MATCH: "requestRandomMatch",
  CANCEL_RANDOM_MATCH: "cancelRandomMatch",
  APPROVE_RANDOM_MATCH: "approveRandomMatch",
};

export const BASEBALL_SUBSCRIBE_EVENTS = {
  MATCHED: "matched",
  MATCH_APPROVED: "matchApproved",
  MATCH_CANCELED: "matchCancelled",
  NO_USERS_AVAILABLE: "noUsersAvailable",
  ERROR: "error",
};

export const TURN_TIME_LIMIT_OPTIONS = [
  {
    value: 30,
    label: "30초",
  },
  {
    value: 60,
    label: "1분",
  },
  {
    value: 120,
    label: "2분",
  },
  {
    value: 0,
    label: "랜덤",
  },
];
