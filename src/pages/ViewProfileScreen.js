import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AdminContext } from '../context/adminContext';
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const ViewProfileScreen = () => {
    const { profileDetails, setProfileDetails } = useContext(AdminContext);
    const [profile, setProfile] = useState({
        name: 'John Doe',
        phone: '123-456-7890',
        password: 'password123',
        organizationId: 'ORG001',
        completedOrders: 15,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(profileDetails);
    const navigate = useNavigate();

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditData(profileDetails);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    // const handleSave = () => {
    //     setProfileDetails(editData);
    //     setIsEditing(false);
    // };

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
                console.log("1")
                // Step 1: Create a new document with the updated mobile number as the document ID
                await setDoc(doc(db, 'users', newMobileNumber), updatedFields);
            }

            if (oldMobileNumber !== newMobileNumber) {
                console.log('2')
                // Step 1: Create a new document with the updated mobile number as the document ID
                await setDoc(doc(db, 'users', newMobileNumber), updatedFields);

                // Step 2: Delete the old document
                await deleteDoc(doc(db, 'users', oldMobileNumber));

            }
            console.log('Profile updated successfully!');
            setProfileDetails(editData);
            setIsEditing(false);
            navigate('/pickers')
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <Container>
            <ProfileCard>
                {console.log('/////', profileDetails)}
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
                            <Value>{profileDetails.name}</Value>
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
                            <Value>{profileDetails.mobileNumber}</Value>
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
                            <Value>{profileDetails.password}</Value>
                        )}
                    </InputOrValue>
                </Field>

                {/* <Field>
                    <Label>Organization ID:</Label>
                    <InputOrValue>
                        {isEditing ? (
                            <Input
                                type="text"
                                name="organizationId"
                                value={editData.organizationId}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <Value>{profile.organizationId}</Value>
                        )}
                    </InputOrValue>
                </Field> */}

                <Field>
                    <Label>Completed Orders:</Label>
                    <InputOrValue>
                        <Value>{profileDetails.completedOrdersCount}</Value>
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
                        <Button primary onClick={handleEditToggle}>
                            Edit Profile
                        </Button>
                    )}
                </ButtonContainer>
            </ProfileCard>
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #6a11cb, #2575fc);
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
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  background: ${(props) => (props.primary ? '#28a745' : '#6c757d')};
  color: white;

  &:hover {
    background: ${(props) => (props.primary ? '#218838' : '#5a6268')};
  }
`;

export default ViewProfileScreen;
