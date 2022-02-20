/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useRef } from "react";
import { css, jsx } from "@emotion/react";
import { Markup } from "interweave";
import userImage from "./user.png";
import {
  AdItem,
  CardImages,
  CardBody,
  CardHeader,
  CardContent,
  Dummy,
} from "./styledElements";
import { Decision } from "../Decision";

export const AdCard = ({
  state,
  dispatch,
  sendData,
  declineAd,
  escalateAd,
  modalIsOpen,
}) => {
  //Добавляем первый элемент в стейт при mount'e
  useEffect(() => {
    dispatch({ type: "selectAd", payload: 0 });
  }, [state.adsList]);
  //------------------------------------------------------------------------------
  //Key listener
  const handleDecision = (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      dispatch({ type: "approveAd" });
      dispatch({
        type: "selectAd",
        payload:
          state.selectedAdIndex === state.adsList.length - 1
            ? state.adsList.length - 1
            : state.selectedAdIndex + 1,
      });
    }
    if (event.code === "Delete") {
      event.preventDefault();
      declineAd();
    }
    if (event.code === "Enter" && event.shiftKey) {
      event.preventDefault();
      escalateAd();
    }
    if (event.code === "F7") {
      event.preventDefault();
      sendData();
    }
  };
  useEffect(() => {
    if (!modalIsOpen) {
      window.addEventListener("keydown", handleDecision);
    }
    return () => {
      window.removeEventListener("keydown", handleDecision);
    };
  });
  //------------------------------------------------------------------------------
  //Autofocus
  const itemsRef = useRef([]);
  useEffect(() => {
    const element =
      itemsRef.current[state.selectedAdIndex].getBoundingClientRect();

    window.scrollTo({
      top:
        element.height < window.innerHeight
          ? element.top +
            window.scrollY -
            (window.innerHeight - element.height) / 3
          : element.top + window.scrollY,
      behavior: "smooth",
    });
  }, [state.selectedAdIndex]);

  //------------------------------------------------------------------------------
  //Выбор элемента по клику
  const handleSelectAd = (index) => {
    return () => {
      dispatch({ type: "selectAd", payload: index });
    };
  };

  return (
    <>
      {state.adsList.map(
        (
          {
            id,
            publishDateString,
            ownerLogin,
            bulletinSubject,
            bulletinText,
            bulletinImages,
          },
          index
        ) => (
          <AdItem
            onClick={handleSelectAd(index)}
            key={id}
            id={id}
            ref={(el) => (itemsRef.current[index] = el)}
            css={
              state.selectedAdIndex === index
                ? css`
                    filter: brightness(100%);
                    border: 1px solid #5daaff;
                  `
                : css`
                    filter: brightness(90%);
                    border: 1px solid transparent;
                  `
            }
          >
            <CardHeader>
              <div
                css={css`
                  font-size: 14px;
                  line-height: 16px;
                  display: flex;
                  align-items: center;
                  color: #4a4a4a;
                `}
              >
                <a href="#">{id}</a>{" "}
                <span
                  css={css`
                    margin: 0 6px;
                  `}
                >
                  —
                </span>
                <p>{publishDateString}</p>
              </div>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <img
                  css={css`
                    margin-right: 8px;
                  `}
                  src={userImage}
                  alt="user"
                />
                <a href="#">{ownerLogin}</a>
              </div>
            </CardHeader>
            <CardBody>
              <h3>{bulletinSubject}</h3>
              <CardContent>
                <Markup
                  css={css`
                    padding-top: 8px;
                    padding-right: 16px;
                    border-right: 1px solid #e4e4e4;
                    max-width: 792px;
                    min-height: 374px;
                    li {
                      list-style-type: "- ";
                      list-style-position: inside;
                    }
                    ul {
                      margin: 20px 0;
                    }
                  `}
                  content={bulletinText}
                />
                <CardImages>
                  {bulletinImages.map((img) => (
                    <img key={img} src={img} alt="" />
                  ))}
                </CardImages>
              </CardContent>
            </CardBody>
            {state.checkedAds.some((el) => el.id === id) ? (
              <Decision id={id} state={state} />
            ) : (
              <Dummy />
            )}
          </AdItem>
        )
      )}
    </>
  );
};
