// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGpeFa7hcDl3OxGltfGEUILBXyvlxJ0ew",
  authDomain: "lawproject-de739.firebaseapp.com",
  projectId: "lawproject-de739",
  storageBucket: "lawproject-de739.firebasestorage.app",
  messagingSenderId: "729818253328",
  appId: "1:729818253328:web:4ea5374f3d9b022474e295",
  measurementId: "G-W7B9F8BHVD"
};


// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const analytics = getAnalytics(FIREBASE_APP);

// Initialize Firebase Auth with AsyncStorage for persistence
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const SEC_APP=initializeApp(firebaseConfig,"Sec_app");
const SEC_AUTH=initializeAuth(SEC_APP)
// Initialize Firestore
const FIREBASE_DB  = getFirestore(FIREBASE_APP);

// Export Firebase services
export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, analytics ,SEC_AUTH };