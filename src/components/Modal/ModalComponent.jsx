/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import Modal from "react-modal";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
Modal.setAppElement("#root");

export const ModalComponent = ({
  open,
  close,
  action,
  handleChangeComment,
  inputValue,
  commandText,
  color,
}) => {
  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "2px solid rgb(0, 0, 0)",
      boxShadow:
        "rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px",
      padding: "32px",
    },
  };

  const ModalInput = styled.input`
    width: 100%;
    font-weight: 400;
    box-sizing: border-box;
    border-radius: 4px;
    height: 30px;
    padding: 16.5px 14px;
    border: 1px solid #777777;
    transition: all 0.3s ease-in-out;
    outline: none;
    &:focus {
      outline: 1px solid #3390ec;
    }
  `;

  const ModalButton = styled.button`
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    appearance: none;
    text-decoration: none;
    min-width: 64px;
    padding: 5px 15px;
    border-radius: 4px;
    transition: all 0.3s ease-in-out;
    border: ${(props) =>
      props.close
        ? "1px solid rgba(211, 47, 47, 0.5)"
        : "1px solid rgb(25, 95, 210)"};
    color: ${(props) => (props.close ? "rgb(211, 47, 47)" : "#3390ec")};
    background-color: transparent;
    &:hover {
      background-color: ${(props) =>
        props.close ? "rgba(211, 47, 47, 0.16)" : "rgba(25,95,210,0.16)"};
    }
    &:disabled {
      color: #777777;
      border: 1px solid #777777;
      cursor: default;
    }
    &:disabled:hover {
      background-color: transparent;
    }
  `;

  return (
    <Modal isOpen={open} onRequestClose={close} style={modalStyle}>
      <h4
        css={css`
          color: ${color};
        `}
      >
        {commandText}
      </h4>
      <p
        css={css`
          margin: 12px 0 8px 0;
        `}
      >
        Пожалуйста, оставьте комментарий
      </p>
      <form onSubmit={action}>
        <ModalInput
          required={commandText === "Отклонить"}
          maxLength={60}
          type="text"
          onChange={handleChangeComment}
          value={inputValue}
          autoFocus={true}
        />
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
          `}
        >
          <ModalButton type={"button"} close onClick={close}>
            Close
          </ModalButton>
          <ModalButton type={"submit"}>Add</ModalButton>
        </div>
      </form>
    </Modal>
  );
};
