import React from "react";
import styled from "styled-components";
import Modal from "react-overlays/Modal";

export const StyledModal = styled(Modal)`
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

type Props = {
  children?: React.ReactElement;
  show: boolean;
  close: () => void;
};
export const CenteredModal = ({ children, show, close }: Props) => {
  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (e) =>
    e.stopPropagation();
  return (
    <StyledModal show={show} onClick={close}>
      <div onClick={stopPropagation}>{children}</div>
    </StyledModal>
  );
};
