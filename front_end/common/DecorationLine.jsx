import React from 'react'
import styled from 'styled-components';

function DecorationLine() {
  return (
    <TitleDecoration>
            <DecorationLineIn />
            <DecorationDot />
            <DecorationLineIn />
    </TitleDecoration>
  )
}

export default DecorationLine
/* =========================
   COLORS
========================= */

const COLORS = {
  background: "#F7F5F0",
  white: "#FFFFFF",
  text: "#1D1C1A",
  muted: "#77736B",
  gold: "#B39A76",
  softGold: "#DED4C4",
  border: "#E4DED4",
};

/* =========================
   TITLE DECORATION
========================= */

const TitleDecoration = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin-top: 22px;
`;

const DecorationLineIn = styled.span`
  width: 55px;
  height: 1px;

  background: ${COLORS.softGold};

  @media (max-width: 480px) {
    width: 40px;
  }
`;

const DecorationDot = styled.span`
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: ${COLORS.gold};
`;
