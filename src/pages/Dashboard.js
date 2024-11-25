import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const logout = () => {
    onLogout()
  };

  return (
    <Container>
      <Header>
        <h1>Dashboard</h1>
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </Header>
      <Cards>
        <Card onClick={() => navigate('/pickers')}>Pickers</Card>
        <Card onClick={() => navigate('/wallet')}>Wallet</Card>
        <Card onClick={() => navigate('/report')}>Report</Card>
      </Cards>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: #ea3636;
  color: white;
  border-radius: 4px;
  cursor: pointer;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: #004dcf;
  color: white;
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

export default Dashboard;
