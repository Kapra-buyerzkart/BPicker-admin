import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AddPickerScreen = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [organizationId, setOrganizationId] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // Loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Start loading when form is submitted

        // Simulate an API call or async operation
        setTimeout(() => {
            console.log({
                name,
                password,
                organizationId,
            });

            setIsLoading(false);  // Stop loading after submission

            // Navigate back to PickersPage after submission
            navigate('/pickers');
        }, 2000);  // Simulate a 2-second delay (for demo purposes)
    };

    const handleCancel = () => {
        setName('');
        setPassword('');
        setOrganizationId('');
    };

    return (
        <Container>
            <FormWrapper>
                <Form onSubmit={handleSubmit}>
                    <Title>Add a New Picker</Title>
                    <InputContainer>
                        <Input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
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
                {isLoading && (
                    <LoaderContainer>
                        <Loader />
                    </LoaderContainer>
                )}
            </FormWrapper>
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #6a11cb, #2575fc);
  position: relative;
`;

const FormWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
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
  width: 100%; /* Ensure the container takes full width */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box; /* Ensures padding is inside the width */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  flex: 1;
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  &:hover {
    background: #218838;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #d63031;
  }
`;

const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Loader = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
`;

const spin = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default AddPickerScreen;
