/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useReducer, useState } from "react";
import { AdList } from "../../components/AdList";
import { css, jsx } from "@emotion/react";
import { Container, ControlPanel, CardWrapper } from "./StyledElements";
import { ControlButton } from "../../components/ControlButton";
import Modal from "react-modal";
import {
  ModalButton,
  ModalInput,
  modalStyle,
} from "../../components/AdCard/styledElements";
Modal.setAppElement("#root");

//Раз redux не желателен, попробуем useReducer)
const initialState = {
  allAdsCompleted: false,
  readyToSend: false,
  adsList: [],
  checkedAds: [],
  selectedAd: {},
  selectedAdIndex: 0,
  nextAdList: { page: 1 },
};
function reducer(state, action) {
  switch (action.type) {
    case "loadAdsList":
      return {
        ...state,
        adsList: action.payload.body,
        nextAdList: action.payload.next,
        allAdsCompleted: action.payload.allAdsCompleted,
      };
    case "selectAd":
      //Выбор элемента по клику в компоненте AdCard
      return {
        ...state,
        selectedAd: state.adsList.find(
          (el, index) => el && index === action.payload
        ),
        selectedAdIndex: action.payload,
      };
    case "approveAd":
      return {
        ...state,
        checkedAds: [
          ...state.checkedAds.filter((el) => el.id !== state.selectedAd.id),
          { result: "Approved", reason: "", ...state.selectedAd },
        ],
        //Ограничиваем счетчик до максимальной длины массива
        selectedAdIndex:
          state.selectedAdIndex < state.adsList.length - 1
            ? state.selectedAdIndex + 1
            : state.adsList.length - 1,
      };
    case "declineAd":
      return {
        ...state,
        checkedAds: [
          ...state.checkedAds.filter((el) => el.id !== state.selectedAd.id),
          {
            result: "Declined",
            reason: action.payload,
            ...state.selectedAd,
          },
        ],
        selectedAdIndex:
          state.selectedAdIndex < state.adsList.length - 1
            ? state.selectedAdIndex + 1
            : state.adsList.length - 1,
      };
    case "escalateAd":
      return {
        ...state,
        checkedAds: [
          ...state.checkedAds.filter((el) => el.id !== state.selectedAd.id),
          { result: "Escalated", reason: action.payload, ...state.selectedAd },
        ],
        selectedAdIndex:
          state.selectedAdIndex < state.adsList.length - 1
            ? state.selectedAdIndex + 1
            : state.adsList.length - 1,
      };
    case "readyToSend":
      return {
        ...state,
        readyToSend: true,
      };
    case "dataIsSend":
      return {
        ...state,
        readyToSend: false,
        checkedAds: [],
        selectedAdIndex: 0,
      };
    default:
      throw new Error();
  }
}

function Main() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
  //Если с сервера больше не приходят данные(страницы кончились) - возвращаем заглушку
  const getAds = async (page = 1) => {
    const response = await fetch(`/get_data?page=${page}&limit=10`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return { ...body };
  };

  const sendAds = async (data) => {
    let response = await fetch("/send_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify(data),
    });
    if (response.status !== 200) {
      throw Error(response.statusText);
    }
  };
  //------------------------------------------------------------------------------------------
  //Загрузка данных
  //Если все данные с сервера проверены - все задачи выполнены
  const loadData = () => {
    if (state.allAdsCompleted) {
      console.log("ALL DONE"); //СДЕЛАТЬ ПОП-АП!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    } else
      getAds(state.nextAdList.page).then((adsData) =>
        dispatch({ type: "loadAdsList", payload: adsData })
      );
  };
  //Отправка данных
  //Если длины массивов не равны, не отправляем данные
  const sendData = () => {
    if (!state.readyToSend) {
      console.log("Not all tasks are proceeded"); //СДЕЛАТЬ ПОП-АП!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    } else {
      sendAds(state.checkedAds)
        .then(() => dispatch({ type: "dataIsSend" }))
        .then(() => loadData());
    }
  };
  //------------------------------------------------------------------------------------------
  //Первая загрузка, затем убираем обработчик на Enter, он больше не нужен и будет мешать
  useEffect(() => {
    const firstLoad = (event) => {
      if (event.code === "Enter") {
        event.preventDefault();
        //На всякий случай условие
        if (state.adsList.length === 0) {
          loadData();
        }
        window.removeEventListener("keydown", firstLoad);
      }
    };
    window.addEventListener("keydown", firstLoad);
    return () => {
      window.removeEventListener("keydown", firstLoad);
    };
  }, []);
  //------------------------------------------------------------------------------------------
  //Если длина массива задач === длине массива выполненных задач и не равно нулю - диспатчим экшен что все готово к отправке
  useEffect(() => {
    if (
      state.adsList.length === state.checkedAds.length &&
      state.checkedAds.length !== 0
    ) {
      dispatch({ type: "readyToSend" });
    }
  }, [state.checkedAds.length]);
  //------------------------------------------------------------------------
  //Modals
  //Конечно нужно сделать 1 компонент по человечески
  const [commentary, setCommentary] = useState("");
  const handleChange = (event) => {
    setCommentary(event.target.value);
  };
  //Модалка для "Отклонить"-------------------------------------------------
  const [declineModalIsOpen, setDeclineModalIsOpen] = useState(false);
  const handleOpenDeclineModal = () => {
    setDeclineModalIsOpen(true);
  };
  const handleCloseDeclineModal = () => {
    setDeclineModalIsOpen(false);
  };

  const declineAd = (e) => {
    e.preventDefault();
    dispatch({ type: "declineAd", payload: commentary });
    setCommentary("");
    dispatch({
      type: "selectAd",
      payload:
        state.selectedAdIndex === state.adsList.length - 1
          ? state.adsList.length - 1
          : state.selectedAdIndex + 1,
    });
    handleCloseDeclineModal();
  };
  //Модалка для "Эскалировать"-------------------------------------------------
  const [escalateModalIsOpen, setEscalateModalIsOpen] = useState(false);
  const handleOpenEscalateModal = () => {
    setEscalateModalIsOpen(true);
  };
  const handleCloseEscalateModal = () => {
    setEscalateModalIsOpen(false);
  };

  const escalateAd = (e) => {
    e.preventDefault();
    dispatch({ type: "escalateAd", payload: commentary });
    setCommentary("");
    dispatch({
      type: "selectAd",
      payload:
        state.selectedAdIndex === state.adsList.length - 1
          ? state.adsList.length - 1
          : state.selectedAdIndex + 1,
    });
    handleCloseEscalateModal();
  };

  return (
    <Container>
      <Modal
        isOpen={declineModalIsOpen}
        onRequestClose={handleCloseDeclineModal}
        style={modalStyle}
      >
        <h4
          css={css`
            margin-bottom: 20px;
          `}
        >
          Пожалуйста, оставьте комментарий
        </h4>
        <form onSubmit={declineAd}>
          <ModalInput
            required
            maxLength={60}
            type="text"
            onChange={handleChange}
            value={commentary}
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
            <ModalButton
              type={"button"}
              close
              onClick={handleCloseDeclineModal}
            >
              Close
            </ModalButton>
            <ModalButton type={"submit"}>Add</ModalButton>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={escalateModalIsOpen}
        onRequestClose={handleCloseEscalateModal}
        style={modalStyle}
      >
        <h4
          css={css`
            margin-bottom: 20px;
          `}
        >
          Укажите причину эскалации
        </h4>
        <form onSubmit={escalateAd}>
          <ModalInput
            maxLength={60}
            type="text"
            onChange={handleChange}
            value={commentary}
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
            <ModalButton
              type={"button"}
              close
              onClick={handleCloseEscalateModal}
            >
              Close
            </ModalButton>
            <ModalButton type={"submit"}>Add</ModalButton>
          </div>
        </form>
      </Modal>
      <CardWrapper>
        <AdList
          sendData={sendData}
          dispatch={dispatch}
          state={state}
          escalateAd={handleOpenEscalateModal}
          declineAd={handleOpenDeclineModal}
          modalIsOpen={declineModalIsOpen || escalateModalIsOpen}
        />
      </CardWrapper>
      <ControlPanel>
        <div
          css={css`
            position: fixed;
          `}
        >
          <ControlButton
            action={"approveAd"}
            dispatch={dispatch}
            commandText={"Одобрить"}
            color={"#88BD35"}
            hotKey={"Пробел"}
            state={state}
          />
          <ControlButton
            command={handleOpenDeclineModal}
            commandText={"Отклонить"}
            color={"#F7882E"}
            hotKey={"Del"}
          />
          <ControlButton
            command={handleOpenEscalateModal}
            commandText={"Эскалация"}
            color={"#1764CC"}
            hotKey={"Shift+Enter"}
          />
          <ControlButton
            command={sendData}
            commandText={"Сохранить"}
            color={"transparent"}
            hotKey={"F7"}
            disabled={!state.readyToSend}
          />
        </div>
      </ControlPanel>
    </Container>
  );
}

export default Main;
