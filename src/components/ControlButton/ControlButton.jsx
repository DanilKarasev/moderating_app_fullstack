/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";

export const ControlButton = ({
  action,
  commandText,
  color,
  hotKey,
  dispatch,
  command,
  state,
  disabled,
}) => {
  const handleClick = () => {
    dispatch({ type: action });
    dispatch({
      type: "selectAd",
      payload:
        state.selectedAdIndex === state.adsList.length - 1
          ? state.adsList.length - 1
          : state.selectedAdIndex + 1,
    });
  };
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
        &:disabled {
          color: #c3c3c3;
          cursor: inherit;
        }
        &:disabled:hover {
          background-color: transparent;
          color: #c3c3c3;
        }
      `}
      disabled={!!disabled}
      //If there is a command in props, then by click running it immediately, otherwise, runs HandleClick
      onClick={command ? command : () => handleClick()}
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
