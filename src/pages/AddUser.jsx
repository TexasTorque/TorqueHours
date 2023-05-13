import Header from "../components/Header";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { createUser } from "../firebase";
import { Navigate, useNavigate } from "react-router-dom";

export default function AddUser() {
  const [name, setName] = useState("");

  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="add-user">
        <h1>Add User:</h1>

        <input
          type="text"
          name="name"
          className="add-user-input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="add-user-button">
        <Button
          style={{ width: "90%" }}
          onClick={(e) => {
            e.preventDefault();
            createUser(name);
            navigate("/");
          }}
        >
          Add
        </Button>
      </div>
    </>
  );
}
