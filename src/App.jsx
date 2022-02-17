/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";

import { useState } from "react";
import { AdList } from "./components/AdList";
import styled from "@emotion/styled";
import { ControlButton } from "./components/ControlButton";
import { css, jsx } from "@emotion/react";

function App() {
  const [adsData, setAdsData] = useState(null);

  const getAds = async (page = null) => {
    if (page !== null) {
      const response = await fetch(`/get_data?page=${page}&limit=10`);
      const body = await response.json();

      if (response.status !== 200) {
        throw Error(body.message);
      }
      return { ...body };
    } else return { body: [] };
  };

  const getData = () => {
    if (adsData === null) {
      getAds(1).then((body) => setAdsData(body));
    } else if (adsData.body.length === 0) {
      return;
    } else {
      getAds(adsData?.next.page).then((body) => setAdsData(body));
    }
  };

  const Container = styled.div`
    padding: 20px;
    display: flex;
    justify-content: center;
  `;

  const ControlPanel = styled.div`
    margin-left: 20px;
    min-width: 160px;
    top: 20px;
  `;

  const CardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 1160px;
    flex-grow: 1;
  `;

  return (
    <Container>
      <CardWrapper>
        <AdList adList={adsData} />
      </CardWrapper>

      <ControlPanel>
        <div
          css={css`
            position: fixed;
          `}
        >
          <ControlButton
            command={getData}
            commandText={"Загрузить"}
            color={"#88BD35"}
            // hotKey={"Пробел"}
          />
          {/*<ControlButton*/}
          {/*  command={getData}*/}
          {/*  commandText={"Отклонить"}*/}
          {/*  color={"#F7882E"}*/}
          {/*  hotKey={"Del"}*/}
          {/*/>*/}
          {/*<ControlButton*/}
          {/*  command={getData}*/}
          {/*  commandText={"Эскалация"}*/}
          {/*  color={"#1764CC"}*/}
          {/*  hotKey={"Shift+Enter"}*/}
          {/*/>*/}
          {/*<ControlButton*/}
          {/*  command={getData}*/}
          {/*  commandText={"Сохранить"}*/}
          {/*  color={"transparent"}*/}
          {/*  hotKey={"F7"}*/}
          {/*/>*/}
        </div>
      </ControlPanel>
    </Container>
  );
}

export default App;
