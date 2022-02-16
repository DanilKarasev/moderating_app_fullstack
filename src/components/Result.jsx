import React from "react";

export const Result = ({ data }) => {
  console.log(data);
  if (data) {
    return <p>Есть данные</p>;
  } else return <p>НЕТ данные</p>;
};
