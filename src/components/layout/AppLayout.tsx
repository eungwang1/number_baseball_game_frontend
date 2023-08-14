"use client";

import React from "react";
import styled from "styled-components";

const AppLayoutBlock = styled.div`
  min-height: 100vh;
  max-width: 780px;
  margin: 0 auto;
  padding: 0 16px;
  .app-layout-bottom-navigation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .app-layout-children-wrapper {
    height: calc(100vh - 56px);
  }
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <AppLayoutBlock>
      <div className="app-layout-children-wrapper">{children}</div>
    </AppLayoutBlock>
  );
};

export default AppLayout;
