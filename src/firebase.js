import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
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

export const getAllUsers = async () => {
  const hoursRef = collection(db, "hours");
  const hoursSnap = await getDocs(hoursRef);
  return hoursSnap.docs.map((doc) => doc.data());
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

export const deleteUser = async (name) => {
  await deleteDoc(doc(db, "hours", name));
}

export const updateUser = async (oldName, newName, hours) => {
  if (newName === "") {
    await deleteDoc(doc(db, "hours", oldName));
    return;
  }

  let userJSON = {
    "name": newName,
    "hours": Number(hours),
  }

  if (oldName !== newName) {
    createUser(newName);

    const oldUserObject = await getUserObject(oldName);

    for (const property in oldUserObject) {
      if (property.includes("sign-")) {
        userJSON[property] = oldUserObject[property];
      }
    }

    await deleteDoc(doc(db, "hours", oldName));
  }
  setDoc(doc(db, "hours", newName), userJSON, { merge: true });
};

export const getRunningHours = async (name, signInNumber) => {
  let totalRunningHours = (await getUserObject(name)).hours;

  const latestSignInTime = await getLatestSignInTime(name, signInNumber);

  const timeSignedIn =
    Math.round(
      ((new Date().getTime() - latestSignInTime.getTime()) / 3.6e6) * 10
    ) / 10;

  if (timeSignedIn < 12) totalRunningHours += timeSignedIn;
  else totalRunningHours += 3;

  totalRunningHours = Math.round(totalRunningHours);

  return totalRunningHours;
};

export const getLatestSignInTime = async (name, signInNumber) => {
  const userObject = await getUserObject(name);
  let latestDate;

  for (const property in userObject) {
    if (property === "sign-in-" + signInNumber)
      latestDate = new Date(userObject[property]);
  }

  return latestDate;
};

export const createUser = async (name) => {
  const userRef = doc(db, "hours", name);
  const userJSON = {
    name: name,
    hours: 0,
  };
  setDoc(userRef, userJSON);
};

export const verifyPassword = async (password) => {
  const passwordSnap = await getDocs(collection(db, "keys"));
  return (
    password ===
    passwordSnap.docs[0]._document.data.value.mapValue.fields.key.stringValue
  );
};
