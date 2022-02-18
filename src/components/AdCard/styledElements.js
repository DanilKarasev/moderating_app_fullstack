import styled from "@emotion/styled";

export const AdItem = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #dddddd;
  box-sizing: border-box;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.2s ease-in-out;
`;

export const CardHeader = styled.div`
  display: flex;
  padding: 13px 20px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e4e4e4;
  font-weight: 400;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 20px 0 20px;
  align-items: flex-start;
  justify-content: space-between;
  font-weight: 400;
  color: #4a4a4a;
  h3 {
    font-size: 24px;
    line-height: 28px;
    font-weight: 400;
  }
`;
export const CardContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-weight: 400;
  margin-top: 8px;
  position: relative;
`;

export const CardImages = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  img {
    display: block;
    width: 165px;
  }
`;

export const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "2px solid rgb(0, 0, 0)",
    boxShadow:
      "rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px",
    padding: "32px",
  },
};

export const ModalInput = styled.input`
  width: 100%;
  font-weight: 400;
  box-sizing: border-box;
  border-radius: 4px;
  height: 30px;
  padding: 16.5px 14px;
  border: 1px solid #777777;
  transition: all 0.3s ease-in-out;
  outline: none;
  &:focus {
    outline: 1px solid #3390ec;
  }
`;

export const ModalButton = styled.button`
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  text-decoration: none;
  min-width: 64px;
  padding: 5px 15px;
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
  border: ${(props) =>
    props.close
      ? "1px solid rgba(211, 47, 47, 0.5)"
      : "1px solid rgb(25, 95, 210)"};
  color: ${(props) => (props.close ? "rgb(211, 47, 47)" : "#3390ec")};
  background-color: transparent;
  &:hover {
    background-color: ${(props) =>
      props.close ? "rgba(211, 47, 47, 0.16)" : "rgba(25,95,210,0.16)"};
  }
  &:disabled {
    color: #777777;
    border: 1px solid #777777;
    cursor: default;
  }
  &:disabled:hover {
    background-color: transparent;
  }
`;

export const Dummy = styled.div`
  display: flex;
  height: 36px;
  padding: 0 24px;
  transition: all 0.2s ease-in-out;
  font-size: 14px;
  line-height: 16px;
  align-items: center;
  content: "";
`;
