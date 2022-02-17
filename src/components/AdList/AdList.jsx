import { AdCard } from "../AdCard";
import styled from "@emotion/styled";

export const AdList = ({ adList }) => {
  const Wrapper = styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
  `;

  if (!adList) {
    return (
      <Wrapper>
        <div>Press Enter to load ads...</div>
      </Wrapper>
    );
  }
  if (!adList.body.length) {
    return (
      <Wrapper>
        <div>All tasks completed!</div>
      </Wrapper>
    );
  }
  return <AdCard ads={adList.body} />;
};
