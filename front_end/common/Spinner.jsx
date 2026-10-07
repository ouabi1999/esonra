import React from "react";
import styled from "styled-components";

const Spinner = () => {
  return (
    <SpinnerOverlay>
      <LuxurySpinner>
        <SpinnerRing />
        <SpinnerInner />
        <SpinnerDot />
      </LuxurySpinner>
    </SpinnerOverlay>
  );
};

export default Spinner;

/* =========================================================
   FULL PAGE LOADER
========================================================= */

const SpinnerOverlay = styled.div`
  position: fixed;

  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  z-index: 999999;

  background: rgba(250, 248, 244, 0.96);

  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  box-sizing: border-box;

  overflow: hidden;
`;

/* =========================================================
   LUXURY SPINNER
========================================================= */

const LuxurySpinner = styled.div`
  position: absolute;

  top: 40%;
  left: 50%;
  
  width: 40px;
  height: 40px;

  transform: translate(-50%, -50%);

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
`;

/* =========================================================
   OUTER RING
========================================================= */

const SpinnerRing = styled.div`
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  border-radius: 50%;

  border: 1px solid #ded7ce;

  border-top-color: #9b815f;
  border-right-color: #9b815f;

  box-sizing: border-box;

  animation:
    luxurySpin 1.15s
    cubic-bezier(0.65, 0, 0.35, 1)
    infinite;

  @keyframes luxurySpin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

/* =========================================================
   INNER RING
========================================================= */

const SpinnerInner = styled.div`
  width: 20px;
  height: 20px;

  border-radius: 50%;

  border: 1px solid #e8e2da;

  border-bottom-color: #b59771;

  box-sizing: border-box;

  animation:
    luxuryReverseSpin 1.8s
    cubic-bezier(0.65, 0, 0.35, 1)
    infinite;

  @keyframes luxuryReverseSpin {
    from {
      transform: rotate(360deg);
    }

    to {
      transform: rotate(0deg);
    }
  }
`;

/* =========================================================
   CENTER DETAIL
========================================================= */

const SpinnerDot = styled.div`
  position: absolute;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background: #9b815f;

  animation:
    luxuryPulse 1.4s
    ease-in-out
    infinite;

  @keyframes luxuryPulse {
    0%,
    100% {
      transform: scale(0.7);
      opacity: 0.45;
    }

    50% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;