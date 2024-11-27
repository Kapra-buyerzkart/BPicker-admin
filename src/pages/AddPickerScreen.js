import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Adjust the import if needed

const AddPickerScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const docRef = doc(db, 'users', mobileNumber);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setIsModalOpen(true); // Open the modal
        setIsLoading(false);
        return;
      }

      await setDoc(docRef, {
        name,
        password,
        organization_id: organizationId,
        completedOrders: [],
      });

      // console.log('Picker added:', { name, password, organizationId, mobileNumber });

      setIsLoading(false);

      navigate('/pickers');
    } catch (error) {
      console.error('Error adding picker:', error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setPassword('');
    setOrganizationId('');
    setMobileNumber('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <FormWrapper>
        <Form onSubmit={handleSubmit}>
          <Title>Add a New Picker</Title>
          <InputContainer>
            <Input
              type="number"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Organization ID"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
            />
          </InputContainer>
          <ButtonContainer>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Picker'}
            </Button>
            <CancelButton type="button" onClick={handleCancel}>
              Cancel
            </CancelButton>
          </ButtonContainer>
        </Form>
      </FormWrapper>

      {/* Modal */}
      {isModalOpen && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>Picker Already Exists</ModalTitle>
            <ModalMessage>
              A picker with this mobile number already exists. Please use a different number.
            </ModalMessage>
            <ModalActions>
              <ModalButton onClick={closeModal}>Close</ModalButton>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #004dcf, #4dcfff);
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 0 1rem; /* Equal spacing on left and right */
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box; /* Ensures padding and border are included in width */
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  flex: 1;
  background: #228b22;
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;

  &:hover {
    background: #1f6b1f;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  background: #ea3636;
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #c82333;
  }
`;

// Modal styles
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
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  color: #004dcf;
`;

const ModalMessage = styled.p`
  margin-bottom: 1.5rem;
  color: #555;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #004dcf;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #003bb3;
  }
`;

export default AddPickerScreen;
