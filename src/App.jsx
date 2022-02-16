import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { Result } from "./components";

function App() {
  const [ads, setAds] = useState();

  const getAds = async (page) => {
    const response = await fetch(`/get_data?page=${page}&limit=10`);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    console.log(body);
    return { ...body };
  };

  const getFirstData = () => {
    getAds(1).then((body) => setAds(body));
  };

  const getData = () => {
    if (ads?.next) {
      getAds(ads.next.page).then((body) => setAds(body));
    } else {
      console.log("NO DATA");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />{" "}
        <p>
          Edit <code>src/App.js</code> and save to reload.{" "}
        </p>
        <button onClick={getFirstData}>FIRST CLICK</button>
        <button onClick={getData}>CLICK</button>
        {/*<Result data={ads.next} />*/}
      </header>
    </div>
  );
}

export default App;
