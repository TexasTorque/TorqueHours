import Header from "../components/Header";
import AuthorizeUser from "../components/AuthorizeUser";
import { Table, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
} from "../firebase";

export default function AddUser() {
  let [enterAdmin, setEnterAdmin] = useState(true);
  let [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    refreshUsers();
  }, []);

  async function refreshUsers() {
    await getAllUsers().then(setUsers);
  }

  const onUpdateLineitem = async (oldName, e) => {
    const newName = e.target.parentNode.parentNode.children[0].children[0].value;
    const hours = e.target.parentNode.parentNode.children[1].children[0].value

    updateUser(oldName, newName, hours); 
    
    if (oldName === localStorage.getItem("user")) {
      localStorage.setItem("user", newName);
    }

    await refreshUsers();

    e.target.style.backgroundColor = "green";
    setTimeout(() => {
      e.target.style.backgroundColor = "black";
    }, 500);

  };
  
  return (
    <>
      <Header />
      <Table
        striped
        bordered
        hover
        className="hours-table"
        style={{ marginLeft: "auto", marginRight: "auto", width: "70%", marginBottom: "30px"}}
      >
        <thead>
          <tr style={{ textAlign: "center" }}>
            <th>Name</th>
            <th style={{ width: "10em"}}>Hours</th>
          </tr>
        </thead>
      <tbody>
        <tr>
          <td className="hour-cell"><input type="text" className="admin-input" placeholder="First Last"/></td>
          <td className="hour-cell"><input type="text" className="admin-input" placeholder="0"/></td>
        </tr>
          {
            users.map((user, index) => (
            <tr key={index}>
              <td className="hour-cell">
                <input type="text" className="admin-input" defaultValue={user.name} onBlur={(e) => onUpdateLineitem(users[index].name, e)}/>
              </td>
              <td className="hour-cell">
                <input type="text" className="admin-input" defaultValue={user.hours} onBlur={(e) => onUpdateLineitem(users[index].name, e)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AuthorizeUser 
          show={ enterAdmin } 
          setShow={ setEnterAdmin }
        />
      <div className="home-button">
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          style={{ marginLeft: ".5em" }}
        >
          Home
        </Button>
      </div>
    </>
  );
}
