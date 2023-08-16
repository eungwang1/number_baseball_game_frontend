import {
  BaseballGame,
  BaseballNumberHistory,
} from "@/app/api/baseball/baseballGame.type";
import { colors } from "@mui/material";
import React from "react";
import styled from "styled-components";

const BaseballGameHistoryBlock = styled.div`
  border-radius: 10px;
  border: 1px solid ${colors.grey[200]};
  .baseball-number-record-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    border-radius: 10px 10px 0 0;
    background-color: ${colors.grey[50]};
    div {
      width: 100%;
      color: ${colors.grey[600]};
      text-align: center;
    }
    div:nth-child(1) {
      border-right: 1px solid ${colors.grey[300]};
    }
  }
  .baseball-number-record-list {
    display: flex;
    height: 150px;
    overflow-y: auto;
    div {
      width: 100%;
      text-align: center;
    }
  }
  .baseball-number-record-list-item {
    padding: 10px 0;
    border-bottom: 1px solid ${colors.grey[200]};
  }
  .baseball-number-record-list-item:first-child {
    color: ${colors.blue[600]};
  }
`;

interface BaseballGameHistoryProps {
  gameHistory: {
    me: BaseballNumberHistory[];
    opponent: BaseballNumberHistory[];
  };
}

const BaseballGameHistory: React.FC<BaseballGameHistoryProps> = ({
  gameHistory,
}) => {
  return (
    <BaseballGameHistoryBlock>
      <div className="baseball-number-record-header">
        <div>{`내 기록 (${gameHistory.me.length}회)`}</div>
        <div>{`상대 기록 (${gameHistory.opponent.length}회)`}</div>
      </div>
      <div className="baseball-number-record-list">
        <div>
          {gameHistory.me.map((result, index) => (
            <div className="baseball-number-record-list-item" key={index}>
              {result.baseball_number} : {result.strike}S {result.ball}B
            </div>
          ))}
        </div>
        <div>
          {gameHistory.opponent.map((result, index) => (
            <div className="baseball-number-record-list-item" key={index}>
              {result.baseball_number} : {result.strike}S {result.ball}B
            </div>
          ))}
        </div>
      </div>
    </BaseballGameHistoryBlock>
  );
};

export default BaseballGameHistory;
