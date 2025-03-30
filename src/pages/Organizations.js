import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { db } from '../firebase/firebaseConfig';
import { AppColors } from '../constants/Colors';

const Organizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [newOrgId, setNewOrgId] = useState('');
    const [newOrgName, setNewOrgName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false); // State for alert modal
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const docRef = doc(db, 'organizations', 'organizations');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setOrganizations(docSnap.data().organizations || []);
            } else {
                setOrganizations([]);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const handleAddOrganization = async () => {
        if (!newOrgId || !newOrgName) return;

        // Check if the newOrgId already exists
        const orgExists = organizations.some(org => org.id === newOrgId);

        if (orgExists) {
            setIsAlertModalOpen(true); // Show alert modal if the ID already exists
            return;
        }

        const newOrg = { id: newOrgId, name: newOrgName };
        const updatedOrgs = [...organizations, newOrg];

        try {
            const docRef = doc(db, 'organizations', 'organizations');
            await setDoc(docRef, { organizations: updatedOrgs }, { merge: true });
            setOrganizations(updatedOrgs);
            setNewOrgId('');
            setNewOrgName('');
        } catch (error) {
            console.error('Error adding organization:', error);
        }
    };

    const handleDeleteConfirmation = (org) => {
        setSelectedOrg(org);
        setIsModalOpen(true);
    };

    const handleDeleteOrganization = async () => {
        if (!selectedOrg) return;
        const updatedOrgs = organizations.filter(org => org.id !== selectedOrg.id);

        try {
            const docRef = doc(db, 'organizations', 'organizations');
            await updateDoc(docRef, { organizations: updatedOrgs });
            await deleteDoc(doc(db, 'stackNumbers', selectedOrg.id));
            setOrganizations(updatedOrgs);
            setIsModalOpen(false);
            setSelectedOrg(null);
        } catch (error) {
            console.error('Error deleting organization:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsAlertModalOpen(false); // Close alert modal when clicking cancel
    };

    return (
        <Container>
            <Header>Organizations</Header>
            <InputSection>
                <StyledInput
                    type="text"
                    value={newOrgId}
                    onChange={(e) => setNewOrgId(e.target.value)}
                    placeholder="Enter Organization ID"
                />
                <StyledInput
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="Enter Organization Name"
                />
                <AddButton onClick={handleAddOrganization}>Add Organization</AddButton>
            </InputSection>
            <List>
                {organizations.length > 0 ? (
                    organizations.map((org) => (
                        <ListItem key={org.id}>
                            <span>{org.name} ({org.id})</span>
                            <ButtonGroup>
                                <Button stack onClick={() => navigate(`/stack-numbers/${org.id}`, {
                                    state: {
                                        organizationName: org.name
                                    }
                                })}>Stack Numbers</Button>
                                <Button delete onClick={() => handleDeleteConfirmation(org)}>Delete</Button>
                            </ButtonGroup>
                        </ListItem>
                    ))
                ) : (
                    <p>No organizations available.</p>
                )}
            </List>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <ModalOverlay>
                    <Modal>
                        <ModalTitle>Confirm Deletion</ModalTitle>
                        <ModalMessage>Are you sure you want to delete this organization? This action cannot be undone.</ModalMessage>
                        <ModalActions>
                            <ModalButton confirm onClick={handleDeleteOrganization}>Confirm</ModalButton>
                            <ModalButton cancel onClick={closeModal}>Cancel</ModalButton>
                        </ModalActions>
                    </Modal>
                </ModalOverlay>
            )}

            {/* Alert Modal for Duplicate Organization ID */}
            {isAlertModalOpen && (
                <ModalOverlay>
                    <Modal>
                        <ModalTitle>Duplicate Organization ID</ModalTitle>
                        <ModalMessage>This Organization ID already exists. Please choose a different ID.</ModalMessage>
                        <ModalActions>
                            <ModalButton cancel onClick={closeModal}>Close</ModalButton>
                        </ModalActions>
                    </Modal>
                </ModalOverlay>
            )}
        </Container>
    );
};

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(to bottom, #004dcf, #4dcfff);
  min-height: 100vh;
`;

const Header = styled.h1`
  color: #ffffff;
`;

const InputSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const StyledInput = styled.input`
  flex: 1;
  min-width: 200px;
  height: 3rem;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const AddButton = styled.button`
  background-color: #228b22;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  background-color: #f8f9fa;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.div`
  background: ${(props) => (props.stack ? AppColors.orange : AppColors.red)};
  color: white;
  &:hover {
    background: ${(props) => (props.stack ? '#e67e22' : '#c82333')};
  }
  width: 100%;
  max-width: 120px;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    max-width: 100px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    max-width: 80px;
    font-size: 0.8rem;
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
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  color: #ffffff;

  background: ${(props) => props.confirm ? AppColors.green : props.cancel ? AppColors.red : AppColors.green};

  &:hover {
    background: ${(props) => props.confirm ? '#1f6b1f' : props.cancel ? '#c82333' : '#1f6b1f'};
  }
`;

export default Organizations;
