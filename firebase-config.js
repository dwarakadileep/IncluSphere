// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCpRF_y-kv1Zcr0CfT4Sgbs0Sx5E9Ie9k",
  authDomain: "gect-club-hub.firebaseapp.com",
  databaseURL: "https://gect-club-hub-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gect-club-hub",
  storageBucket: "gect-club-hub.firebasestorage.app",
  messagingSenderId: "109614141092",
  appId: "1:109614141092:web:38927ae7226ab48f72e031"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create database and auth objects
const database = firebase.database();
const auth = firebase.auth();