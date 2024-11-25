import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase/firebaseConfig';
import { AdminContext } from '../context/adminContext';
import { ClipLoader } from 'react-spinners'; // Import the loader

const PickersScreen = () => {
  const [pickersData, setPickersData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { setProfileDetails } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPickersData = async () => {
      try {
        const pickersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(pickersCollection);

        const pickers = querySnapshot.docs.map((doc) => {
          const data = doc.data() || {}; // Ensure data is not null/undefined
          const completedOrders = data.completedOrders || []; // Fallback to empty array if null/undefined

          const completedOnTime = completedOrders.filter((order) => {
            const time = order?.completion_time?.split(' ')[0]; // Safely access completion_time
            return time && parseInt(time) <= 1;
          }).length;

          return {
            mobileNumber: doc.id || 'Unknown', // Fallback for missing doc ID
            name: data.name || 'Unnamed Picker', // Fallback for missing name
            organizationId: data.organization_id || 'N/A', // Fallback for missing organizationId
            completedOnTime,
            completedLate: completedOrders.length - completedOnTime,
            password: data.password,
            completedOrdersCount: data.completedOrders.length,
            completedOrders: data.completedOrders || []
          };
        });

        setPickersData(pickers);
      } catch (error) {
        console.error('Error fetching pickers data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickersData();
  }, []);

  const addPicker = () => {
    navigate('/add-picker');
  };

  const viewProfile = (mobileNumber) => {
    const selectedPicker = pickersData.find(
      (picker) => picker.mobileNumber === mobileNumber
    );
    if (selectedPicker) {
      setProfileDetails(selectedPicker); // Update profile details in context
      navigate('/view-profile'); // Navigate to profile page
    }
  };

  return (
    <Container>
      <Header>
        <h1>Pickers List</h1>
        <AddButton onClick={addPicker}>ADD A PICKER</AddButton>
      </Header>

      {loading ? ( // Show loader while loading
        <Loader>
          <ClipLoader color="#2575fc" size={50} /> {/* Beautiful spinner */}
        </Loader>
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
            {pickersData?.map((picker) => (
              <tr key={picker.mobileNumber || Math.random()}>
                <Td>{picker.name}</Td>
                <Td>{picker.completedOnTime ?? 0}</Td>
                <Td>{picker.completedLate ?? 0}</Td>
                <Td>
                  <Button onClick={() => viewProfile(picker.mobileNumber)}>
                    View Profile
                  </Button>
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  height: 50px;
`;

export default PickersScreen;
