import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Dashboard = ({ onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsModalOpen(false);
    onLogout();
  };

  return (
    <Container>
      <Header>
        <h1>Dashboard</h1>
        <LogoutButton onClick={() => setIsModalOpen(true)}>Logout</LogoutButton>
      </Header>
      <Cards>
        <Card onClick={() => navigate('/pickers')}>
          <h2>Pickers</h2>
        </Card>
        <Card onClick={() => navigate('/wallet')}>
          <h2>Wallet</h2>
        </Card>
        <Card onClick={() => navigate('/report')}>
          <h2>Report</h2>
        </Card>
      </Cards>

      {isModalOpen && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>Confirm Logout</ModalTitle>
            <ModalMessage>
              Are you sure you want to log out? This will end your session.
            </ModalMessage>
            <ModalActions>
              <ModalButton onClick={handleLogout} primary>
                Yes, Logout
              </ModalButton>
              <ModalButton onClick={() => setIsModalOpen(false)}>
                Cancel
              </ModalButton>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(to bottom, #004dcf, #4dcfff);
  color: #ffffff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: #ea3636;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    background: #c82333;
  }
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: #f78738;
  color: #ffffff;
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  h2 {
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  color: #333; /* Ensure text is visible */
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  color: #004dcf; /* Add a distinct color for the title */
`;

const ModalMessage = styled.p`
  margin-bottom: 1.5rem;
  color: #555; /* Add contrast for the message text */
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  background: ${(props) => (props.primary ? '#ea3636' : '#6c757d')};
  color: #ffffff;

  &:hover {
    background: ${(props) => (props.primary ? '#c82333' : '#5a6268')};
  }
`;

export default Dashboard;
