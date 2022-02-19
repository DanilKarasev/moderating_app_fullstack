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
