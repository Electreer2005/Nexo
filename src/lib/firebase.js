import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCIan689OXzP6CBuqUO_uuhJ16tltW2m7o',
  authDomain: 'nexo-9d725.firebaseapp.com',
  projectId: 'nexo-9d725',
  storageBucket: 'nexo-9d725.firebasestorage.app',
  messagingSenderId: '630570476347',
  appId: '1:630570476347:web:ea32c51705e367afa9cd1e',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
