import Header from "../components/Header";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { createUser, verifyPassword } from "../firebase";

export default function AddUser() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [buttonName, setButtonName] = useState("Add");

  useEffect(() => {
    const statusKeyboardInput = (e) => {
      if (e.keyCode === 13) {
        tryToCreateUser(e);
      }
    };
    window.addEventListener("keydown", statusKeyboardInput);
    return () => window.removeEventListener("keydown", statusKeyboardInput);
  });

  const tryToCreateUser = (e) => {
    e.preventDefault();
    const comparePasswords = async () => {
      if (name.length === 0) {
        return;
      }
      if (password.length > 0 && (await verifyPassword(password))) {
        createUser(name);
        setName("");
        setButtonName("Added");
        setIsActive(true);
        setTimeout(() => {
          setIsActive(false);
          setButtonName("Add");
        }, 1000);
      } else alert("Incorrect Password");
    };

    comparePasswords();
  };

  const animationStyles = `
  @keyframes checkmark {
    0% {
      stroke-dashoffset: 24;
      opacity: 0;
    }
    50% {
      stroke-dashoffset: 6;
      opacity: 1;
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }
`;

  return (
    <>
      <Header />
      <div className="add-user-verification">
        <h1>Password: </h1>

        <input
          type="text"
          name="name"
          className="add-user-input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="add-user">
        <h1>Add User:</h1>

        <input
          type="text"
          name="name"
          className="add-user-input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="add-user-button">
        <Button
          style={{
            backgroundColor: isActive ? "green" : "initial",
            animation: isActive ? animationStyles : "none",
            width: "90%",
          }}
          onClick={(e) => tryToCreateUser(e)}
        >
          {isActive && <span>&#10003;</span>} {buttonName}
        </Button>
      </div>
    </>
  );
}
