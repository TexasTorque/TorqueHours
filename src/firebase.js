import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3tSyYU5LNnA2dMmuGCkagCcygF0jX2R8",

  authDomain: "torque-hours-d3594.firebaseapp.com",

  projectId: "torque-hours-d3594",

  storageBucket: "torque-hours-d3594.appspot.com",

  messagingSenderId: "112216520283",

  appId: "1:112216520283:web:7735fda63eb18bdd32717e",

  measurementId: "G-8D16D4C0B5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getAllNames = async () => {
  const hoursRef = collection(db, "hours");
  const hoursSnap = await getDocs(hoursRef);
  return hoursSnap.docs.map((doc) => doc.id);
};

export const getUserObject = async (name) => {
  const userRef = collection(db, "hours");
  const usersSnap = await getDocs(userRef);
  const userObject = usersSnap.docs
    .filter((doc) => doc.id === name)
    .map((doc) => doc.data());
  return userObject[0];
};

export const addTimestamp = async (key, value, name) => {
  const userRef = doc(db, "hours", name);
  const test = {
    [key]: value,
  };

  console.log(test);
  //   setDoc(userRef, { key: value }, { merge: true });
};
