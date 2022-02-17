/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";

export const ControlButton = ({ command, commandText, color, hotKey }) => {
  return (
    <button
      css={css`
        background: none;
        border: none;
        display: flex;
        align-items: center;
        transition: all 0.2s ease-in-out;
        padding: 4px;
        border-radius: 4px;
        font-size: 14px;
        line-height: 16px;
        cursor: pointer;
        justify-content: left;
        &:hover {
          background-color: #5daaff;
          color: white;
        }
      `}
      onClick={command}
    >
      <p
        css={css`
          width: 75px;
          display: flex;
          justify-content: flex-start;
        `}
      >
        {commandText}
      </p>

      <span
        css={css`
          height: 6px;
          width: 6px;
          background-color: ${color};
          border-radius: 50%;
          display: inline-block;
          margin: 0 6px;
        `}
      />
      <p
        css={css`
          color: #777777;
        `}
      >
        {hotKey}
      </p>
    </button>
  );
};
