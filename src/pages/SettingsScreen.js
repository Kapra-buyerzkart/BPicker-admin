import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { ClipLoader } from 'react-spinners';
import { AdminContext } from '../context/adminContext';
// import { toast } from 'react-toastify'; // For user feedback

const SettingsScreen = () => {
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { globalSkipButton, setGlobalSkipButton } = useContext(AdminContext);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const settingsDoc = doc(db, 'settings', 'settings');
        const docSnapshot = await getDoc(settingsDoc);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setShowSkipButton(data.showSkipButton ?? false);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // toast.error('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, []);

  const toggleSkipButton = async () => {
    setSaving(true);
    const newValue = !globalSkipButton;
    try {
      const pickersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(pickersCollection);
      const updatePromises = querySnapshot.docs.map((pickerDoc) =>
        updateDoc(doc(db, 'users', pickerDoc.id), { showSkipButton: newValue })
      );

      await Promise.all(updatePromises);

      setGlobalSkipButton(newValue);
      setShowSkipButton(newValue);

      const settingsDoc = doc(db, 'settings', 'settings');
      await setDoc(settingsDoc, { showSkipButton: newValue }, { merge: true });

      // toast.success('Settings updated successfully.');
    } catch (error) {
      console.error('Error updating setting:', error);
      // toast.error('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Header>
          <h1>Settings</h1>
        </Header>

        {loading ? (
          <Loader>
            <ClipLoader color="#2575fc" size={50} />
          </Loader>
        ) : (
          <SettingItem>
            <Label>Show Skip Button in Mobile App</Label>
            <Switch>
              <Input
                type="checkbox"
                checked={showSkipButton}
                onChange={toggleSkipButton}
                disabled={saving}
                aria-label="Toggle Skip Button"
              />
              <Slider />
            </Switch>
          </SettingItem>
        )}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #004dcf, #4dcfff);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #228b22;
  }

  &:checked + span:before {
    transform: translateX(26px);
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
  border-radius: 24px;

  &:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  height: 50px;
`;

export default SettingsScreen;
