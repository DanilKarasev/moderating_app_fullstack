/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { AdList } from "../../components/AdList";
import { css, jsx } from "@emotion/react";
import { Container, ControlPanel, CardWrapper } from "./StyledElements";
import { ControlButton } from "../../components/ControlButton";
import { ModalComponent } from "../../components/Modal";
import { ToastContainer as Notification, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Task was to avoid using react-redux, so I tried useReducer
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
      //Choosing element onclick in AdCard component
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
        //Limiting the counter to max array length
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

export const Main = () => {
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

  //Clear completed ads
  const clearAds = async () => {
    let response = await fetch("/clear_data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/JSON",
      },
    });
    if (response.status !== 200) {
      throw Error(response.statusText);
    }
  };
  //------------------------------------------------------------------------------------------
  //Data loading
  const loadData = () => {
    getAds(state.nextAdList.page)
      .then((adsData) => dispatch({ type: "loadAdsList", payload: adsData }))
      .catch(() => toggleNotification("error"));
  };
  //Data sending
  const sendData = () => {
    if (!state.readyToSend) {
      toggleNotification("notReadyToSend");
    } else {
      sendAds(state.checkedAds)
        .then(() => dispatch({ type: "dataIsSend" }))
        .then(() => toggleNotification("adsAreSent"))
        .then(() => loadData())
        .catch(() => toggleNotification("error"));
    }
  };
  //Completed ads clearing
  const clearData = () => {
    clearAds()
      .then(() => toggleNotification("adsAreCleared"))
      .catch(() => toggleNotification("error"));
  };
  //------------------------------------------------------------------------------------------
  //If tasks array length === completed tasks array length and not equals zero - dispatching action that data is ready to send and popping notification
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
          autoClose: 1900,
          hideProgressBar: true,
          toastId: "ready-to-send-ads",
        });
        break;
      case "notReadyToSend":
        toast.warn("Not all ads have been verified", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1900,
          hideProgressBar: true,
          toastId: "not-ready-to-send-ads",
        });
        break;
      case "adsAreSent":
        toast.success("Ads have been successfully sent!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1900,
          hideProgressBar: true,
          toastId: "successfully-sent-ads",
        });
        break;
      case "adsAreCleared":
        toast.success(
          "Ads have been successfully cleared, please refresh the page.",
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1900,
            hideProgressBar: true,
            toastId: "successfully-cleared-ads",
          }
        );
        break;
      case "error":
        toast.error("Oops! Something went wrong...", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1900,
          hideProgressBar: true,
          toastId: "notification-error",
        });
        break;
    }
  };
  //------------------------------------------------------------------------
  //Modals
  const [comment, setComment] = useState("");
  const handleChangeComment = (event) => {
    if (/^\s/.test(event.target.value)) event.target.value = "";
    setComment(event.target.value);
  };
  //------------------------------------------------------------------------
  //Modal to "Decline"-------------------------------------------------
  const [declineModalIsOpen, setDeclineModalIsOpen] = useState(false);
  const handleOpenDeclineModal = () => {
    setDeclineModalIsOpen(true);
  };
  const decline = useCallback(() => {
    setDeclineModalIsOpen(true);
  }, []);

  const handleCloseDeclineModal = () => {
    setComment("");
    setDeclineModalIsOpen(false);
  };

  const declineAd = (e) => {
    e.preventDefault();
    handleCloseDeclineModal();
    dispatch({ type: "declineAd", payload: comment.trim() });
    setComment("");
    dispatch({
      type: "selectAd",
      payload:
        state.selectedAdIndex === state.adsList.length - 1
          ? state.adsList.length - 1
          : state.selectedAdIndex + 1,
    });
  };
  //Modal to "Escalate"-------------------------------------------------
  const [escalateModalIsOpen, setEscalateModalIsOpen] = useState(false);
  const handleOpenEscalateModal = () => {
    setEscalateModalIsOpen(true);
  };
  const handleCloseEscalateModal = () => {
    setComment("");
    setEscalateModalIsOpen(false);
  };

  const escalateAd = (e) => {
    e.preventDefault();
    handleCloseEscalateModal();
    dispatch({ type: "escalateAd", payload: comment.trim() });
    setComment("");
    dispatch({
      type: "selectAd",
      payload:
        state.selectedAdIndex === state.adsList.length - 1
          ? state.adsList.length - 1
          : state.selectedAdIndex + 1,
    });
  };

  return (
    <Container>
      <ModalComponent
        open={declineModalIsOpen}
        close={handleCloseDeclineModal}
        action={declineAd}
        commentRequired={true}
        commandText={"Decline"}
        color={"#F7882E"}
        handleChangeComment={handleChangeComment}
        inputValue={comment}
      />
      <ModalComponent
        open={escalateModalIsOpen}
        close={handleCloseEscalateModal}
        action={escalateAd}
        commentRequired={false}
        commandText={"Escalate"}
        color={"#1764CC"}
        handleChangeComment={handleChangeComment}
        inputValue={comment}
      />
      <CardWrapper>
        <AdList
          loadData={loadData}
          sendData={sendData}
          dispatch={dispatch}
          state={state}
          escalateAd={handleOpenEscalateModal}
          declineAd={decline}
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
            commandText={"Approve"}
            color={"#88BD35"}
            hotKey={"Space"}
            state={state}
            disabled={state.adsList.length === 0}
          />
          <ControlButton
            command={handleOpenDeclineModal}
            commandText={"Decline"}
            color={"#F7882E"}
            hotKey={"Del"}
            disabled={state.adsList.length === 0}
          />
          <ControlButton
            command={handleOpenEscalateModal}
            commandText={"Escalate"}
            color={"#1764CC"}
            hotKey={"Shift+Enter"}
            disabled={state.adsList.length === 0}
          />
          <ControlButton
            command={sendData}
            commandText={"Save"}
            color={"transparent"}
            hotKey={"F7"}
            disabled={!state.readyToSend}
          />
          <ControlButton
            command={clearData}
            commandText={"Clear All"}
            color={"red"}
            hotKey={"(Restart the app)"}
            disabled={!state.allAdsCompleted}
          />
        </div>
      </ControlPanel>
      <Notification />
    </Container>
  );
};
