"use client";

import {
  BottomNavigation,
  BottomNavigationAction,
  colors,
} from "@mui/material";
import React from "react";
import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

const AppLayoutBlock = styled.div`
  background-color: ${colors.grey[100]};
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
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
      <BottomNavigation
        showLabels
        className="app-layout-bottom-navigation"
        // value={value}
        onChange={(event, newValue) => {
          // setValue(newValue);
        }}
      >
        <BottomNavigationAction icon={<HomeIcon />} />
        <BottomNavigationAction icon={<PersonIcon />} />
        <BottomNavigationAction icon={<SettingsIcon />} />
      </BottomNavigation>
    </AppLayoutBlock>
  );
};

export default AppLayout;
