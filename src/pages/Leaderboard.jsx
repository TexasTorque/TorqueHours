import { useState, useEffect } from "react";
import { ListGroup, Table } from "react-bootstrap";
import Header from "../components/Header";
import { getAllUsers } from "../firebase";
export default function HoursReport() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsersFromFB = async () => {
      let allUserData = await getAllUsers();

      allUserData.sort((a, b) => b.hours - a.hours);

      setUsers(allUserData);
    };
    getAllUsersFromFB();
  }, []);

  const getName = (name, index, length) => {
    if (index === 0) return name + " 👑";
    else if (index === 1) return name + " 🥈";
    else if (index === 2) return name + " 🥉";
    else if (index == length - 1) return name + " 😭";
    else return name;
  };

  return (
    <div>
      <Header />

      <Table
        striped
        bordered
        hover
        className="hours-table"
        style={{ width: "90%" }}
      >
        <thead>
          <tr style={{ textAlign: "center" }}>
          <th style={{ width: "3em" }}>Rank</th>
            <th>Name</th>
            <th style={{ width: "3em" }}>Hours</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className="hour-cell">{index + 1}</td>
              <td className="hour-cell">
                {getName(user.name, index, users.length)}
              </td>
              <td className="hour-cell">{user.hours}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
