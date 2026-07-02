import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 사용자께서 제공해주신 파이어베이스 설정 정보입니다.
const firebaseConfig = {
  apiKey: "AIzaSyAGMU511d609pZpdQi8yJtUb2lavv9e82g",
  authDomain: "worship-forest.firebaseapp.com",
  projectId: "worship-forest",
  storageBucket: "worship-forest.firebasestorage.app",
  messagingSenderId: "1039487246199",
  appId: "1:1039487246199:web:c245f1fdc022f836aacb72",
  measurementId: "G-59RL36E0ZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
