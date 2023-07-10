import React, { useState } from 'react';
import styled from 'styled-components';
import { CenteredModal } from './ui/Modal';
import { SaveLoadParam } from './SaveLoadParam';

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 1rem;
`;

const Title = styled.h1`
  margin: 0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
`;


export const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <HeaderContainer>
      <Title>Headerのタイトル</Title>
      <Button onClick={handleButtonClick}>ボタン</Button>
      <CenteredModal show={isModalOpen} close={closeModal}>
        <SaveLoadParam param={"abc"} loadParams={(a) => alert(a)} />
      </CenteredModal>
    </HeaderContainer>
  );
};
