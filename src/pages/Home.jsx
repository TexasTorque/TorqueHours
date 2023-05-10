import { Button, Dropdown, Form } from "react-bootstrap";
import { useState } from "react";
import torqueLogo from "../imgs/torqueLogo.png";
import "../index.css";
import { useEffect } from "react";
import {
  getAllNames,
  getUserObject,
  addTimestamp,
  db,
  getLatestSignInTime,
  getAllUsers,
} from "../firebase";
import { onSnapshot, doc } from "firebase/firestore";

export default function Home() {
  const [name, setName] = useState("");
  const [names, setNames] = useState([""]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hours, setHours] = useState(0);
  const [buttonMessage, setButtonMessage] = useState("Sign In");

  let [numMeetings, setNumMeetings] = useState(0);
  let [signInNumber, setSignInNumber] = useState(0);
  let [elapsedTime, setElapsedTime] = useState(0);
  let [rank, setRank] = useState(0);
  let [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (name.length > 0)
      onSnapshot(doc(db, "hours", name), () => {
        updateFields();
      });
  }, [name]);

  useEffect(() => {
    const getAllNamesFromFB = async () => {
      setNames(await getAllNames());
    };

    getAllNamesFromFB();
  }, []);

  const updateFields = async () => {
    const userObject = await getUserObject(name);

    setHours(userObject.hours);

    setButtonMessage(
      Object.keys(userObject).length % 2 === 0 ? "Sign In" : "Sign Out"
    );

    numMeetings = (Object.keys(userObject).length - 2) / 2;

    setNumMeetings(numMeetings);

    signInNumber = Object.keys(userObject).length - 2;

    signInNumber = parseInt(signInNumber / 2) + 1;

    setSignInNumber(signInNumber);
  };

  useEffect(() => {
    const getLatestSignInTimeFromFB = async () => {
      const latestSignInTime = await getLatestSignInTime(name, signInNumber);

      const durationInMs =
        new Date().getTime() - new Date(latestSignInTime).getTime();
      elapsedTime = new Date(durationInMs).toISOString().substr(11, 8);

      const hours = Math.floor(durationInMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationInMs / (1000 * 60)) % 60);

      if (hours > 0 && minutes > 0) elapsedTime = `${hours}h ${minutes}m`;
      else if (hours > 0) elapsedTime = `${hours} hours`;
      else elapsedTime = `${minutes} minutes`;

      setElapsedTime(elapsedTime);
    };

    if (buttonMessage.includes("Out")) getLatestSignInTimeFromFB();

    const interval = setInterval(() => {}, 6000);
    return () => clearInterval(interval);
  }, [buttonMessage]);

  useEffect(() => {
    const getUsers = async () => {
      let allUserData = await getAllUsers();

      allUserData.sort((a, b) => b.hours - a.hours);

      rank = allUserData.findIndex((obj) => obj.name === name) + 1;
      if (rank === 1) rank += " 👑";
      else if (rank === 2) rank += " 🥈";
      else if (rank === 3) rank += " 🥉";
      setRank(rank);

      setTotalUsers(allUserData.length);
    };

    if (name.length > 0) getUsers();
  }, [name]);

  const signInOut = async (e) => {
    e.preventDefault();
    addTimestamp(
      (buttonMessage === "Sign In" ? "sign-in-" : "sign-out-") + signInNumber,
      new Date().toISOString(),
      name,
      signInNumber
    );
  };

  return (
    <div style={{ marginTop: "2em" }}>
      <div className="header">
        <img src={torqueLogo} style={{ height: "3.5em", width: "3.5em" }}></img>
        <h4 className="header-name">Torque Hours</h4>
      </div>

      <div className="name-selection">
        <h1 className="name-prompt">Select Your Name:</h1>

        <Dropdown>
          <Dropdown.Toggle variant="primary">
            {name.slice(0, name.indexOf(" "))}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <input
              className="dropdown-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            ></input>
            {names
              .filter((name) =>
                name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((name, index) => {
                return (
                  <Dropdown.Item onClick={() => setName(name)} key={index}>
                    {name}
                  </Dropdown.Item>
                );
              })}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div style={{ display: `${name.length <= 0 ? "none" : ""}` }}>
        <h4 className="greeting">Hi {name}!</h4>

        <div className="statistics">
          <div className="statistic">
            <h1 className="statistic-name">Your Recorded Hours This Season:</h1>
            <h1 className="statistic-value">{hours}</h1>
          </div>
          <div className="statistic">
            <h1 className="statistic-name">Number of Meetings Attended:</h1>
            <h1 className="statistic-value">{numMeetings}</h1>
          </div>
          <div className="statistic">
            <h1 className="statistic-name">
              Your Hours Rank (out of {totalUsers}):
            </h1>
            <h1 className="statistic-value">{rank}</h1>
          </div>

          <div
            className="statistic"
            style={{
              marginTop: "1em",
              display: `${buttonMessage.includes("In") ? "none" : ""}`,
            }}
          >
            <h1 className="statistic-name">Your Current Signed in Time:</h1>
            <h1 className="statistic-value">{elapsedTime}</h1>
          </div>
        </div>

        <div className="sign-in-out-button-container">
          <Button className="sign-in-out-button" onClick={(e) => signInOut(e)}>
            {buttonMessage}
          </Button>
        </div>
      </div>
    </div>
  );
}
