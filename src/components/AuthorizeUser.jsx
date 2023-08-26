import { Modal, Button } from "react-bootstrap"
import { verifyPassword } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthorizeUser({ show, setShow }) {
  let [ pass, setPass] = useState("");

  const navigate = useNavigate();

  return (
    <>
      <Modal
        show={show}
    >
        <Modal.Header>
          <Modal.Title>Admin Panel</Modal.Title>
          <button 
            type="button" 
            className="btn-close"
            onClick={() => {
                navigate("/");
            }}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <div className="admin-panel">
            <label
              style={{fontSize: 22, fontWeight: 500}}
            >
              Password:
            </label>
            <input
              type="password"
              name="name"
              className="add-user-input-field"
              style={{marginLeft: "10px"}}
              onChange={(e) => {
                setPass(e.target.value);
              }}
            />
            <Button
              style={{marginLeft: "10px"}}
              onClick={ async () => {
                if (await verifyPassword(pass)) {
                  setShow(false);
                }
              }}
            >
              ✓
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}