import { AdCard } from "../AdCard";
import styled from "@emotion/styled";

export const AdList = ({
  state,
  dispatch,
  sendData,
  escalateAd,
  declineAd,
  modalIsOpen,
}) => {
  const Wrapper = styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
  `;

  if (state.adsList.length === 0 && !state.allAdsCompleted) {
    return (
      <Wrapper>
        <div>Press Enter to load ads...</div>
      </Wrapper>
    );
  }
  if (state.allAdsCompleted) {
    return (
      <Wrapper>
        <div>All tasks completed!</div>
      </Wrapper>
    );
  }
  return (
    <AdCard
      sendData={sendData}
      state={state}
      dispatch={dispatch}
      escalateAd={escalateAd}
      declineAd={declineAd}
      modalIsOpen={modalIsOpen}
    />
  );
};
