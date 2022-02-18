/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

export const Decision = ({ id, state }) => {
  const Wrapper = styled.div`
    display: flex;
    height: 36px;
    padding: 0 24px;
    transition: all 0.2s ease-in-out;
    font-size: 14px;
    line-height: 16px;
    align-items: center;
  `;
  const currentAd = state.checkedAds.find((el) => el.id === id);
  let color;
  if (currentAd.result === "Approved") {
    color = "#88BD35";
  } else if (currentAd.result === "Declined") {
    color = "#F7882E";
  } else color = "#1764CC";

  return (
    <Wrapper>
      <span
        css={css`
          height: 9px;
          width: 9px;
          background-color: ${color};
          border-radius: 50%;
          display: inline-block;
          margin: 0 6px;
        `}
      />
      <p
        css={css`
          color: ${color};
        `}
      >
        {currentAd.result}
      </p>
      <p
        css={css`
          margin-left: 5px;

          color: #777777;
        `}
      >
        {currentAd?.reason}
      </p>
    </Wrapper>
  );
};
