import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase/firebaseConfig';

const PickersScreen = () => {
    const [pickersData, setPickersData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPickersData = async () => {
            const pickersCollection = collection(db, 'users'); // Assuming collection name is 'pickers'
            const querySnapshot = await getDocs(pickersCollection);

            const pickers = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                console.log('data', data.completedOrders)
                const completedOnTime = data.completedOrders.filter(order => {
                    // Check if the completion time is <= 1 minute
                    const time = order.completion_time.split(' ')[0]; // Get minutes
                    return parseInt(time) <= 1;
                }).length;

                return {
                    mobileNumber: doc.id, // Firebase document ID is the mobile number
                    name: data.name,
                    organizationId: data.organization_id,
                    completedOnTime,
                    completedLate: data.completedOrders.length - completedOnTime
                };
            });

            setPickersData(pickers);
            setLoading(false); // Set loading to false after data is fetched
        };

        fetchPickersData();
    }, []);

    const addPicker = () => {
        navigate('/add-picker');
    };

    const viewProfile = (profileId) => {
        console.log('View profile clicked for:', profileId);
        navigate('/view-profile')
    };

    return (
        <Container>
            <Header>
                <h1>Pickers List</h1>
                <AddButton onClick={addPicker}>ADD A PICKER</AddButton>
            </Header>

            {loading ? ( // Show loader while loading
                <Loader>Loading...</Loader>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <Th>Picker Name</Th>
                            <Th>Orders Completed On Time</Th>
                            <Th>Orders Completed After Delay</Th>
                            <Th>Action</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {pickersData.map((picker) => (
                            <tr key={picker.mobileNumber}>
                                <Td>{picker.name}</Td>
                                <Td>{picker.completedOnTime}</Td>
                                <Td>{picker.completedLate}</Td>
                                <Td>
                                    <Button onClick={() => viewProfile(picker.mobileNumber)}>View Profile</Button>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

const Container = styled.div`
  margin: 2rem auto;
  max-width: 800px;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #2575fc;
  color: white;
  font-weight: bold;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Button = styled.button`
  background-color: #6a11cb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2575fc;
  }
`;

const Loader = styled.div`
  margin-top: 20px;
  font-size: 1.5rem;
  color: #2575fc;
  font-weight: bold;
`;

export default PickersScreen;
