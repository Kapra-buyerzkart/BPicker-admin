// firebase.js
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBrmQ9ZWrccK_xEVyF8nidFLid_y8bQecE',
  authDomain: 'bpicker.firebaseapp.com',
  projectId: 'bpicker',
  storageBucket: 'bpicker.appspot.com',
  messagingSenderId: '567606421682',
  appId: '1:567606421682:web:19d7152ad1b9380b9741ab',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
