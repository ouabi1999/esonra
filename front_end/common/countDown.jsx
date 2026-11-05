import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

// =========================================================
// OFFER CONFIGURATION
// =========================================================

// One shared deadline for every visitor.
// Update this date when launching a new promotion.
// Deadline: October 31, 2026, at 23:59:59 in Spain (CET).
const OFFER_DEADLINE = new Date(
  "2026-10-28T23:59:59+01:00"
).getTime();;

const Countdown = ({ title = "specialOffer" }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const updateCountdown = () => {
      const difference = OFFER_DEADLINE - Date.now();

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Hide the offer after expiration.
  if (!timeLeft) return null;

  const format = (value) => String(value).padStart(2, "0");

  return (
    <Badge
      role="timer"
      aria-label={t("countdownSection.accessibilityLabel", {
        days: timeLeft.days,
        hours: timeLeft.hours,
        minutes: timeLeft.minutes,
        seconds: timeLeft.seconds,
      })}
    >
      <OfferLabel>
        {t(`countdownSection.${title}`)}
      </OfferLabel>

      <Divider />

      <ClockIcon aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </ClockIcon>

      <Time>
        {timeLeft.days > 0 && (
          <>
            <TimeUnit>
              {timeLeft.days}d
            </TimeUnit>

            <Separator>:</Separator>
          </>
        )}

        <TimeUnit>{format(timeLeft.hours)}</TimeUnit>
        <Separator>:</Separator>

        <TimeUnit>{format(timeLeft.minutes)}</TimeUnit>
        <Separator>:</Separator>

        <TimeUnit>{format(timeLeft.seconds)}</TimeUnit>
      </Time>
    </Badge>
  );
};

export default Countdown;

// =========================================================
// LUXURY STYLING
// =========================================================

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  min-height: 32px;
  max-width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;

  background: #faf8f3;
  border: 1px solid #e8dfcc;
  border-radius: 3px;

  color: #866c32;
  font-family: inherit;
  line-height: 1;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: 5px;
    min-height: 29px;
    padding: 4px 7px;
  }
`;

const OfferLabel = styled.span`
  color: #866c32;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 10px;
    letter-spacing: 0.3px;
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 14px;

  background: #e3d8c3;
  flex-shrink: 0;

  @media (max-width: 480px) {
    height: 12px;
  }
`;

const ClockIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    display: block;
    width: 15px;
    height: 15px;
  }

  @media (max-width: 480px) {
    svg {
      width: 13px;
      height: 13px;
    }
  }
`;

const Time = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;

  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.15px;

  color: #866c32;

  @media (max-width: 480px) {
    gap: 2px;
    font-size: 11px;
  }
`;

const TimeUnit = styled.span`
  min-width: 14px;
  text-align: center;
`;

const Separator = styled.span`
  color: #c4b18d;
  font-size: 13px;
  font-weight: 400;
`;