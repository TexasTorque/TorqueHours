import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
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
export const db = getFirestore(app);

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

export const addTimestamp = async (key, value, name, signInNumber) => {
  const userRef = doc(db, "hours", name);
  let runningHours;

  const userJSON = {
    [key]: value,
  };

  if (key.includes("out")) {
    runningHours = await getRunningHours(name, signInNumber);
    userJSON["hours"] = runningHours;
  }

    setDoc(userRef, userJSON, { merge: true });
};

export const getRunningHours = async (name, signInNumber) => {
  const userObject = await getUserObject(name);
  let runningHours = userObject.hours;
  let latestDate;
  console.log("SIN "+signInNumber);

  for (const property in userObject) {
    if (property === "sign-in-" + signInNumber)
      latestDate = new Date(userObject[property]);
  }

  console.log(latestDate);

  runningHours +=
    Math.round(((new Date().getTime() - latestDate.getTime()) / 3.6e6) * 10) /
    10;

  runningHours = Math.round(runningHours);

  return runningHours;
};
