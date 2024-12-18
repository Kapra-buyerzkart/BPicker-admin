import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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

  // Fetch pickers data
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
            showSkipButton: data.showSkipButton ?? false, // New field
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
      setProfileDetails(selectedPicker);
      navigate('/view-profile', { state: selectedPicker });
    }
  };

  const toggleSkipButton = async (picker) => {
    try {
      const updatedValue = !picker.showSkipButton;

      // Update Firestore
      const pickerDoc = doc(db, 'users', picker.mobileNumber);
      await updateDoc(pickerDoc, { showSkipButton: updatedValue });

      // Update local state
      setPickersData((prevData) =>
        prevData.map((p) =>
          p.mobileNumber === picker.mobileNumber
            ? { ...p, showSkipButton: updatedValue }
            : p
        )
      );
    } catch (error) {
      console.error('Error updating skip button setting:', error);
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
                    <ToggleWrapper>
                      <Label>Skip Button:</Label>
                      <Switch>
                        <Input
                          type="checkbox"
                          checked={picker.showSkipButton}
                          onChange={() => toggleSkipButton(picker)}
                        />
                        <Slider />
                      </Switch>
                    </ToggleWrapper>
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

// Styled Components
const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #004dcf, #4dcfff);
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
  background: white;
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

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const Label = styled.span`
  margin-right: 8px;
  font-size: 0.9rem;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #228b22;
  }

  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;

  &:before {
    position: absolute;
    content: '';
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

export default PickersScreen;
