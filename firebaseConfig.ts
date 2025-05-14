// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBibBybCSFPiPr63Xou5ONOTMhD1aZxcuo',
  authDomain: 'babycareapp-1b761.firebaseapp.com',
  projectId: 'babycareapp-1b761',
  storageBucket: 'babycareapp-1b761.appspot.com',
  messagingSenderId: '300624859846',
  appId: '1:300624859846:web:2d4cfc950f34a1fe843dc7',
};

const app = initializeApp(firebaseConfig);

// 🔹 Solo esto es necesario
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
export default app;
