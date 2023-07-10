import React, { useRef } from 'react';
import styled from 'styled-components';

interface ModalContentProps {
  param: string;
  loadParams: (value: string) => void;
}

const ModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
`;

export const SaveLoadParam: React.FC<ModalContentProps> = ({ param, loadParams }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSaveClick = () => {
    if (param && navigator.clipboard) {
      navigator.clipboard.writeText(param);
    }
  };

  const handleLoadClick = () => {
    if (inputRef.current && loadParams) {
      loadParams(inputRef.current.value);
    }
  };

  return (
    <ModalContentContainer>
      <Button onClick={handleSaveClick}>Save</Button>
      <input ref={inputRef} type="text" />
      <Button onClick={handleLoadClick}>Load</Button>
    </ModalContentContainer>
  );
};

