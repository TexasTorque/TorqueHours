import Header from "../components/Header";
import AuthorizeUser from "../components/AuthorizeUser";
import { Table, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getAllUsers } from "../firebase";
import { useNavigate } from "react-router-dom";

function handleUpdate(index, name, hours) {
  // save to fb database
}

export default function AddUser() {
  let [enterAdmin, setEnterAdmin] = useState(true);
  let [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    let newUsers = [];
    const res = async () => {
      await getAllUsers().then(users => {
        users.forEach(user => {
          newUsers.push({name: user.name, hours: user.hours});
        })
      });
    }
    res()
    setUsers(newUsers);
  }, []);

  function AdminPanel() {
    return (
      <>
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
              <th style={{ width: "5em"}}>Update</th>
            </tr>
          </thead>
        <tbody>
            {
              users.map((user, index) => (
              <tr key={index}>
                <td className="hour-cell"><input type="text" className="admin-input" defaultValue={user.name}/></td>
                <td className="hour-cell"><input type="text" className="admin-input" defaultValue={user.hours}/></td>
                <td className="hour-cell"><button className="admin-button" onClick={(e) => { handleUpdate(index, e.target.parentNode.parentNode.children[0].children[0].value, e.target.parentNode.parentNode.children[1].children[0].value) }}>✓</button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )
  }
  
  return (
    <>
      <Header />
      <AdminPanel />
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
