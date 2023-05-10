import { Button, Dropdown, Form } from "react-bootstrap";
import { useState } from "react";
import torqueLogo from "../imgs/torqueLogo.png";
import "../index.css";
import { useEffect, useRef } from "react";
import { getAllNames, getUserObject, addTimestamp } from "../firebase";

export default function Home() {
  const [name, setName] = useState("");
  const [names, setNames] = useState([""]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hours, setHours] = useState(0);
  const [buttonMessage, setButtonMessage] = useState("Sign In");

  let [signInNumber, setSignInNumber] = useState(0);

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

      signInNumber = Object.keys(userObject).length - 1;

      signInNumber = parseInt(signInNumber / 2) + 1;

      setSignInNumber(signInNumber);
    };

    if (name.length > 0) callFB();
  }, [name]);

  const signInOut = async (e) => {
    console.log(signInNumber);
    e.preventDefault();
    addTimestamp(
      (buttonMessage === "Sign In" ? "sign-in-" : "sign-out-") + signInNumber,
      new Date().toISOString(),
      name
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
            <h1 className="statistic-name">Your Hours Rank (out of 66):</h1>
            <h1 className="statistic-value">21</h1>
          </div>
          <div className="statistic">
            <h1 className="statistic-name">Your Hours This Season:</h1>
            <h1 className="statistic-value">{hours}</h1>
          </div>
          <div className="statistic" style={{ marginTop: "1em" }}>
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
