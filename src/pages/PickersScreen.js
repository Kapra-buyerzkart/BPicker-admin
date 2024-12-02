import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase/firebaseConfig';
import { AdminContext } from '../context/adminContext';
import { ClipLoader } from 'react-spinners';

const PickersScreen = () => {
  const [pickersData, setPickersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setProfileDetails } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPickersData = async () => {
      try {
        const pickersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(pickersCollection);

        const pickers = querySnapshot.docs.map((doc) => {
          const data = doc.data() || {};
          const completedOrders = data.completedOrders || [];

          const completedOnTime = completedOrders.filter((order) => {
            const time = order?.completion_time?.split(' ')[0];
            return time && parseInt(time) <= 1;
          }).length;

          return {
            mobileNumber: doc.id || 'Unknown',
            name: data.name || 'Unnamed Picker',
            organizationId: data.organization_id || 'N/A',
            completedOnTime,
            completedLate: completedOrders.length - completedOnTime,
            password: data.password,
            completedOrdersCount: data.completedOrders.length,
            completedOrders: data.completedOrders || [],
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
      // console.log('qqqqqqqqqqqqqq', selectedPicker)
      setProfileDetails(selectedPicker);
      navigate('/view-profile', { state: selectedPicker });
    }
  };

  return (
    <Wrapper>
      <Container>
        <Header>
          <h1>Pickers List</h1>
          <AddButton onClick={addPicker}>ADD A PICKER</AddButton>
        </Header>

        {loading ? (
          <Loader>
            <ClipLoader color="#2575fc" size={50} />
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh; /* Ensures the gradient covers the full viewport height */
  background: linear-gradient(to bottom, #004dcf, #4dcfff); /* Gradient background */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: white; /* Card-like effect for the content */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #004dcf;
  color: #ffffff;
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
