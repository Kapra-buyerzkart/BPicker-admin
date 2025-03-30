import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import styled from 'styled-components';
import { db } from '../firebase/firebaseConfig';
import { useLocation, useParams } from 'react-router-dom';

const StackNumbers = () => {
    const [stackNumbers, setStackNumbers] = useState([]);
    const [newStackNumber, setNewStackNumber] = useState('');
    const { organizationId } = useParams();
    const location = useLocation();
    const organizationName = location.state?.organizationName;

    useEffect(() => {
        fetchStackNumbers();
    }, [organizationId]);

    const fetchStackNumbers = async () => {
        try {
            const docRef = doc(db, 'stackNumbers', organizationId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const orgData = data.stackNumbers.find(item => item.orgName === organizationName);
                if (orgData) {
                    setStackNumbers(orgData.stackNumbers || []);
                } else {
                    setStackNumbers([]);
                }
            } else {
                setStackNumbers([]);
            }
        } catch (error) {
            console.error('Error fetching stack numbers:', error);
        }
    };

    const handleAddStackNumber = async () => {
        if (!newStackNumber) return;

        try {
            const docRef = doc(db, 'stackNumbers', organizationId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const updatedStackNumbers = data.stackNumbers.map(item => {
                    if (item.orgName === organizationName) {
                        return {
                            ...item,
                            stackNumbers: [...item.stackNumbers, newStackNumber], // Directly add the stack number
                        };
                    }
                    return item;
                });

                // If the organization doesn't exist in the stackNumbers array, add it
                if (!data.stackNumbers.some(item => item.orgName === organizationName)) {
                    updatedStackNumbers.push({
                        orgName: organizationName,
                        stackNumbers: [newStackNumber],
                    });
                }

                await setDoc(docRef, { stackNumbers: updatedStackNumbers }, { merge: true });
            } else {
                // If the document doesn't exist, create it with the new organization
                await setDoc(docRef, {
                    stackNumbers: [{ orgName: organizationName, stackNumbers: [newStackNumber] }],
                });
            }

            setNewStackNumber('');
            fetchStackNumbers();
        } catch (error) {
            console.error('Error adding stack number:', error);
        }
    };

    const handleDeleteStackNumber = async (number) => {
        try {
            const docRef = doc(db, 'stackNumbers', organizationId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const updatedStackNumbers = data.stackNumbers.map(item => {
                    if (item.orgName === organizationName) {
                        return {
                            ...item,
                            stackNumbers: item.stackNumbers.filter(stack => stack !== number), // Remove the stack number
                        };
                    }
                    return item;
                });

                await setDoc(docRef, { stackNumbers: updatedStackNumbers }, { merge: true });
            }

            fetchStackNumbers();
        } catch (error) {
            console.error('Error deleting stack number:', error);
        }
    };

    return (
        <Container>
            <h1>Stack Numbers for Organization {organizationName}</h1>
            <InputSection>
                <input
                    type="text"
                    value={newStackNumber}
                    onChange={(e) => setNewStackNumber(e.target.value)}
                    placeholder="Enter stack number"
                />
                <button onClick={handleAddStackNumber}>Add Stack Number</button>
            </InputSection>
            <List>
                {stackNumbers.length > 0 ? (
                    stackNumbers.map((number, index) => (
                        <ListItem key={index}>
                            {number}
                            <DeleteButton onClick={() => handleDeleteStackNumber(number)}>Delete</DeleteButton>
                        </ListItem>
                    ))
                ) : (
                    <p>No stack numbers available.</p>
                )}
            </List>
        </Container>
    );
};

const Container = styled.div`
  padding: 2rem;
  color: #333;
`;

const InputSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
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
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

export default StackNumbers;
