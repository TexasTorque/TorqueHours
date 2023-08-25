import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import AuthorizeUser from "../components/AuthorizeUser"
import {
  getAllNames,
  getUserObject,
  addTimestamp,
  db,
  getLatestSignInTime,
  getAllUsers,
  verifyPassword,
} from "../firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

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

  const navigate = useNavigate();

  useEffect(() => {
    if (name.length > 0)
      onSnapshot(doc(db, "hours", name), () => {
        updateFields();
      });

      localStorage.setItem("user", name);
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

  useState(() => {
    if (localStorage.getItem("user") != null) {
      setName(localStorage.getItem("user"));
    }
  }, [])

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
      <Header />

      <div className="name-selection">
        <h1 className="name-prompt">Select Your Name:</h1>

        <Dropdown className="name-selection-button">
          <Dropdown.Toggle variant="primary">
            {name.slice(0, name.indexOf(" "))}
          </Dropdown.Toggle>

          <Dropdown.Menu className="name-dropdown">
            <input
              className="dropdown-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id={"dropdown-menu-align-start"}
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
        <h4 className="greeting">Hi {name.substring(0, name.indexOf(" "))}!</h4>

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

      <div className="hour-report-button">
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate("/leaderboard");
          }}
        >
          Leaderboard
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate("/attendance");
          }}
          style={{ marginLeft: ".5em" }}
        >
          Attendance
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate("/admin");
          }}
          style={{ marginLeft: ".5em" }}
        >
          Admin
        </Button>
      </div>
    </div>
  );
}
