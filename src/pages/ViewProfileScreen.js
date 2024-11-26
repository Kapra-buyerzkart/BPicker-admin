import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AdminContext } from '../context/adminContext';
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { AppColors } from '../constants/Colors';

const ViewProfileScreen = ({ onLogout }) => {
    const { profileDetails, setProfileDetails } = useContext(AdminContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(profileDetails || {});
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
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
            const updatedFields = {
                name: editData.name,
                password: editData.password,
                completedOrders: profileDetails.completedOrders,
                organization_id: profileDetails.organizationId
            };

            if (oldMobileNumber === newMobileNumber) {
                await setDoc(doc(db, 'users', newMobileNumber), updatedFields);
            } else {
                await setDoc(doc(db, 'users', newMobileNumber), updatedFields);
                await deleteDoc(doc(db, 'users', oldMobileNumber));
            }
            console.log('Profile updated successfully!');
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
            console.log('Profile deleted successfully!');
            setProfileDetails(null);
            setIsModalOpen(false); // Close modal after deletion
            navigate('/pickers'); // Redirect to login
        } catch (error) {
            console.error('Error deleting profile:', error);
            alert('Failed to delete profile. Please try again.');
        }
    };

    // useEffect(() => {
    //     const handlePopState = () => {
    //         console.log('Back button pressed');
    //         navigate(-1);
    //     };

    //     window.addEventListener('popstate', handlePopState);

    //     return () => {
    //         window.removeEventListener('popstate', handlePopState);
    //     };
    // }, []);


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
                            <Button primary onClick={handleSave}>
                                Save
                            </Button>
                            <Button onClick={handleEditToggle}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button primary onClick={handleEditToggle}>
                                Edit Profile
                            </Button>
                            <Button
                                danger
                                onClick={() => setIsModalOpen(true)}
                            >
                                Delete Profile
                            </Button>
                        </>
                    )}
                </ButtonContainer>
            </ProfileCard>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <ModalOverlay>
                    <Modal>
                        <ModalTitle>Confirm Deletion</ModalTitle>
                        <ModalMessage>
                            Are you sure you want to delete this profile? This action cannot be undone.
                        </ModalMessage>
                        <ModalActions>
                            <ModalButton onClick={handleDelete} primary>
                                Yes, Delete
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
  background: ${(props) => (props.primary ? AppColors.red : AppColors.darkGray)};
  color: #ffffff;

  &:hover {
    background: ${(props) => (props.primary ? '#c82333' : '#414241')};
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
  width: 100%; /* Ensure container uses full width */
`;

const Button = styled.button`
  flex: 1; /* Make all buttons occupy equal width */
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
