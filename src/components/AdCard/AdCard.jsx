/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useState } from "react";
import { css, jsx } from "@emotion/react";
import { Markup } from "interweave";
import userImage from "./user.png";
import {
  AdItem,
  CardImages,
  CardBody,
  CardHeader,
  CardContent,
} from "./styledElements";

export const AdCard = ({ ads }) => {
  //Первый стейт просто индекс выбранного елемента, можно в дальнейшем сократить его
  const [focusedItemIndex, setFocusedItemIndex] = useState(0);
  const [selectedAd, setSelectedAd] = useState(ads[focusedItemIndex]);
  //Массив завершенных объявлений
  const [completedAds, setCompletedAds] = useState([]);

  //Выбор елемента по клику
  const handleSelectAd = (index) => {
    setFocusedItemIndex(index);
    setSelectedAd(ads.find((el, index) => el && index === focusedItemIndex));
  };

  const handleDecision = (e) => {
    switch (e.keyCode) {
      case 32: // Space
        e.preventDefault();
        if (!completedAds.some((el) => el.ad === selectedAd.id)) {
          setCompletedAds([
            ...completedAds,
            {
              ad: selectedAd.id,
              decision: "approved",
              comments: "",
            },
          ]);
        }
        setFocusedItemIndex(focusedItemIndex + 1);
        setSelectedAd(
          ads.find((el, index) => el && index === focusedItemIndex)
        );
        break;
      case 38: // Клавиша вверх
        console.log("UP");
        break;
      case 39: // Клавиша вправо
        console.log("RIGHT");
        break;
      case 40: // Клавиша вниз
        console.log("DOWN");
        break;
      default:
        console.log("OLOLO");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDecision);
    return () => {
      window.removeEventListener("keydown", handleDecision);
    };
  });

  console.log("Completed :", completedAds);
  console.log("Selected :", selectedAd);

  return (
    <>
      {ads.map(
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
            onClick={() => handleSelectAd(index)}
            key={id}
            id={id}
            css={
              focusedItemIndex === index
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
                    min-height: 390px;
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
          </AdItem>
        )
      )}
    </>
  );
};
