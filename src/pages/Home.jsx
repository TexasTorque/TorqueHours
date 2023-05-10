import { Button, Dropdown, Form } from "react-bootstrap";
import { useState } from "react";
import torqueLogo from "../imgs/torqueLogo.png";
import "../index.css";
import { useEffect } from "react";
import { getAllNames, getUserObject, addTimestamp, db } from "../firebase";
import { onSnapshot, doc } from "firebase/firestore";

export default function Home() {
  const [name, setName] = useState("");
  const [names, setNames] = useState([""]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hours, setHours] = useState(0);
  const [buttonMessage, setButtonMessage] = useState("Sign In");

  let [numMeetings, setNumMeetings] = useState(0);
  let [signInNumber, setSignInNumber] = useState(0);

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (name.length > 0)
      onSnapshot(doc(db, "hours", name), () => {
        setUpdate(update + 1);
      });
  }, [name, update]);

  useEffect(() => {
    const getAllNamesFromFB = async () => {
      setNames(await getAllNames());
    };

    getAllNamesFromFB();
  }, []);

  useEffect(() => {
    const callFB = async () => {
      const userObject = await getUserObject(name);

      setHours(userObject.hours);

      setButtonMessage(
        Object.keys(userObject).length % 2 !== 0 ? "Sign In" : "Sign Out"
      );

      numMeetings = (Object.keys(userObject).length - 1) / 2;

      setNumMeetings(numMeetings);

      signInNumber = Object.keys(userObject).length - 1;

      signInNumber = parseInt(signInNumber / 2) + 1;

      setSignInNumber(signInNumber);
    };

    if (name.length > 0) callFB();
  }, [name, update]);

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
            <h1 className="statistic-name">Your Hours Rank (out of 66):</h1>
            <h1 className="statistic-value">21</h1>
          </div>

          <div
            className="statistic"
            style={{
              marginTop: "1em",
              display: `${buttonMessage.includes("In") ? "none" : ""}`,
            }}
          >
            <h1 className="statistic-name">Your Current Signed in Time:</h1>
            <h1 className="statistic-value">55 min</h1>
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
