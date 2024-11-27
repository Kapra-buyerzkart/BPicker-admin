import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AdminContext } from '../context/adminContext';
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { AppColors } from '../constants/Colors';

const ViewProfileScreen = () => {
    const { profileDetails, setProfileDetails } = useContext(AdminContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(profileDetails || {});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditData(profileDetails || {});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSave = async () => {
        if (!profileDetails || !editData) {
            console.error('Profile details or edit data is missing');
            return;
        }

        const oldMobileNumber = profileDetails.mobileNumber;
        const newMobileNumber = editData.mobileNumber;

        if (!oldMobileNumber || !newMobileNumber) {
            console.error("Mobile number is missing in profile or editData.");
            return;
        }

        try {
            // Check if the new mobile number already exists
            const newDocRef = doc(db, 'users', newMobileNumber);
            const newDocSnapshot = await getDoc(newDocRef);

            if (newDocSnapshot.exists() && oldMobileNumber !== newMobileNumber) {
                setModalMessage('This mobile number already exists. Please use a different number.');
                setIsModalOpen(true); // Open the modal to inform the user
                return;
            }

            const updatedFields = {
                name: editData.name,
                password: editData.password,
                completedOrders: profileDetails.completedOrders,
                organization_id: profileDetails.organizationId,
            };

            if (oldMobileNumber === newMobileNumber) {
                // console.log('11111', updatedFields)
                await setDoc(doc(db, 'users', newMobileNumber), updatedFields);
            } else {
                // console.log('2222', updatedFields)
                await setDoc(doc(db, 'users', newMobileNumber), updatedFields);
                await deleteDoc(doc(db, 'users', oldMobileNumber));
            }

            // console.log('Profile updated successfully!');
            setProfileDetails(editData);
            setIsEditing(false);

            navigate('/pickers');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (!profileDetails || !profileDetails.mobileNumber) {
            console.error("Profile details or mobile number is missing.");
            return;
        }

        try {
            await deleteDoc(doc(db, 'users', profileDetails.mobileNumber));
            setProfileDetails(null);
            setIsDeleteModalOpen(false); // Close delete modal after deletion
            navigate('/pickers'); // Redirect to pickers
        } catch (error) {
            console.error('Error deleting profile:', error);
            alert('Failed to delete profile. Please try again.');
        }
    };

    return (
        <Container>
            <ProfileCard>
                <Title>Profile Details</Title>

                <Field>
                    <Label>Name:</Label>
                    <InputOrValue>
                        {isEditing ? (
                            <Input
                                type="text"
                                name="name"
                                value={editData.name}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <Value>{profileDetails?.name}</Value>
                        )}
                    </InputOrValue>
                </Field>

                <Field>
                    <Label>Phone Number:</Label>
                    <InputOrValue>
                        {isEditing ? (
                            <Input
                                type="text"
                                name="mobileNumber"
                                value={editData.mobileNumber}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <Value>{profileDetails?.mobileNumber}</Value>
                        )}
                    </InputOrValue>
                </Field>

                <Field>
                    <Label>Password:</Label>
                    <InputOrValue>
                        {isEditing ? (
                            <Input
                                type="text"
                                name="password"
                                value={editData.password}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <Value>{profileDetails?.password}</Value>
                        )}
                    </InputOrValue>
                </Field>

                <Field>
                    <Label>Completed Orders:</Label>
                    <InputOrValue>
                        <Value>{profileDetails?.completedOrdersCount}</Value>
                    </InputOrValue>
                </Field>

                <ButtonContainer>
                    {isEditing ? (
                        <>
                            <Button primary onClick={handleSave}>Save</Button>
                            <Button onClick={handleEditToggle}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button primary onClick={handleEditToggle}>Edit Profile</Button>
                            <Button danger onClick={() => setIsDeleteModalOpen(true)}>Delete Profile</Button>
                        </>
                    )}
                </ButtonContainer>
            </ProfileCard>

            {/* Modal for alerts */}
            {isModalOpen && (
                <ModalOverlay>
                    <Modal>
                        <ModalTitle>ALERT</ModalTitle>
                        <ModalMessage>{modalMessage}</ModalMessage>
                        <ModalActions>
                            <ModalButton onClick={() => setIsModalOpen(false)}>Close</ModalButton>
                        </ModalActions>
                    </Modal>
                </ModalOverlay>
            )}

            {isDeleteModalOpen && (
                <ModalOverlay>
                    <Modal>
                        <ModalTitle>Confirm Deletion</ModalTitle>
                        <ModalMessage>Are you sure you want to delete this profile? This action cannot be undone.</ModalMessage>
                        <ModalActions>
                            <ModalButton confirm onClick={handleDelete}>Confirm</ModalButton>
                            <ModalButton cancel onClick={() => setIsDeleteModalOpen(false)}>Cancel</ModalButton>
                        </ModalActions>
                    </Modal>
                </ModalOverlay>
            )}
        </Container>
    );
};

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
`;

const ModalMessage = styled.p`
  margin-bottom: 1.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem; /* Add space between buttons */
`;

const ModalButton = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  color: #ffffff;

  /* Background color based on button type */
  background: ${(props) =>
        props.confirm ? AppColors.green : props.cancel ? AppColors.red : AppColors.green};

  &:hover {
    background: ${(props) =>
        props.confirm
            ? '#1f6b1f'
            : props.cancel
                ? '#c82333'
                : '#1f6b1f'};
  }
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #004dcf, #4dcfff);
`;

const ProfileCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
  flex: 1;
`;

const InputOrValue = styled.div`
  flex: 2;
`;

const Value = styled.span`
  display: block;
  width: 100%;
  padding: 0.5rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  width: 100%;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  background: ${(props) => (props.primary ? AppColors.green : AppColors.red)};
  color: white;
  text-align: center;

  &:hover {
    background: ${(props) => (props.primary ? '#1f6b1f' : '#c82333')};
  }
`;

export default ViewProfileScreen;
