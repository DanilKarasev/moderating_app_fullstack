import { AdCard } from "../AdCard";
import styled from "@emotion/styled";
import { Loader } from "../Loader";
import { FirstLoad } from "../FirstLoad";

export const AdList = ({
  state,
  dispatch,
  sendData,
  escalateAd,
  declineAd,
  modalIsOpen,
  loadData,
  approve,
}) => {
  const Wrapper = styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
  `;

  if (state.loading) {
    return <Loader />;
  }
  if (state.adsList.length === 0 && !state.allAdsCompleted) {
    return <FirstLoad loadData={loadData} />;
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
      approve={approve}
      dispatch={dispatch}
      escalateAd={escalateAd}
      declineAd={declineAd}
      modalIsOpen={modalIsOpen}
    />
  );
};
