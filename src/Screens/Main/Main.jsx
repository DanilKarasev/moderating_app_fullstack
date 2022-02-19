/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useReducer, useState } from "react";
import { AdList } from "../../components/AdList";
import { css, jsx } from "@emotion/react";
import { Container, ControlPanel, CardWrapper } from "./StyledElements";
import { ControlButton } from "../../components/ControlButton";
import { ModalComponent } from "../../components/Modal";
import { ToastContainer as Notification, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Раз redux не желателен, попробуем useReducer)
const initialState = {
  loading: false,
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
        loading: false,
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
        loading: true,
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
  const getAds = async (page = 1) => {
    const adsPerPage = 10;
    const response = await fetch(`/get_data?page=${page}&limit=${adsPerPage}`);
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
  const loadData = () => {
    getAds(state.nextAdList.page).then((adsData) =>
      dispatch({ type: "loadAdsList", payload: adsData })
    );
  };
  //Отправка данных
  const sendData = () => {
    if (!state.readyToSend) {
      toggleNotification("notReadyToSend");
    } else {
      sendAds(state.checkedAds)
        .then(() => dispatch({ type: "dataIsSend" }))
        .then(() => toggleNotification("adsAreSent"))
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
  //Если длина массива задач === длине массива выполненных задач и не равно нулю - диспатчим экшен что все готово к отправке и уведомляем
  useEffect(() => {
    if (
      state.adsList.length === state.checkedAds.length &&
      state.checkedAds.length !== 0
    ) {
      dispatch({ type: "readyToSend" });
      toggleNotification("readyToSend");
    }
  }, [state.checkedAds.length]);
  //------------------------------------------------------------------------
  //Notification
  const toggleNotification = (props) => {
    switch (props) {
      case "readyToSend":
        toast.info("Ads are ready to send!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1500,
          hideProgressBar: true,
          toastId: "ready-to-send-ads",
        });
        break;
      case "notReadyToSend":
        toast.warn("Not all ads have been verified", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1500,
          hideProgressBar: true,
          toastId: "not-ready-to-send-ads",
        });
        break;
      case "adsAreSent":
        toast.success("Ads have been successfully sent!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1500,
          hideProgressBar: true,
          toastId: "successfully-sent-ads",
        });
        break;
    }
  };
  //------------------------------------------------------------------------
  //Modals
  const [comment, setComment] = useState("");
  const handleChangeComment = (event) => {
    setComment(event.target.value);
  };
  //------------------------------------------------------------------------
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
    dispatch({ type: "declineAd", payload: comment });
    setComment("");
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
    dispatch({ type: "escalateAd", payload: comment });
    setComment("");
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
      <ModalComponent
        open={declineModalIsOpen}
        close={handleCloseDeclineModal}
        action={declineAd}
        handleChangeComment={handleChangeComment}
        inputValue={comment}
      />
      <ModalComponent
        open={escalateModalIsOpen}
        close={handleCloseEscalateModal}
        action={escalateAd}
        handleChangeComment={handleChangeComment}
        inputValue={comment}
      />
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
      <Notification />
    </Container>
  );
}

export default Main;
