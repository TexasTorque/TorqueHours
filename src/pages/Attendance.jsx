import Header from "../components/Header.jsx";
import { useState, useEffect } from "react";
import { getAllUsers, getLatestSignInTime } from "../firebase";
import { Table } from "react-bootstrap";
export default function Attendance() {
  let [signedInUsers, setSignedInUsers] = useState([]);

  useEffect(() => {
    const getAllUsersFromFB = async () => {
      const userObject = await getAllUsers();

      signedInUsers = [];

      userObject.forEach(async (user) => {
        let numMeetings = (Object.keys(user).length - 2) / 2;

        if (numMeetings % 1 === 0.5) {
          let signInNumber = Object.keys(userObject).length - 2;

          signInNumber = parseInt(signInNumber / 2) + 1;
          const latestSignInTime = await getLatestSignInTime(
            user.name,
            signInNumber
          );
          let elapsedTime = 0;

          const durationInMs =
            new Date().getTime() - new Date(latestSignInTime).getTime();
          elapsedTime = new Date(durationInMs).toISOString().substr(11, 8);

          const hours = Math.floor(durationInMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationInMs / (1000 * 60)) % 60);

          if (hours > 0 && minutes > 0) elapsedTime = `${hours}h ${minutes}m`;
          else if (hours > 0) elapsedTime = `${hours} hours`;
          else elapsedTime = `${minutes} min`;

          signedInUsers.push({
            name: user.name,
            elapsedTime: elapsedTime,
          });
          setSignedInUsers(signedInUsers);
        }
      });
    };
    getAllUsersFromFB();
  }, []);
  return (
    <>
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
            <th>Name</th>
            <th style={{ width: "10em" }}>Signed In Time</th>
          </tr>
        </thead>
        <tbody>
          {signedInUsers.map((user, index) => (
            <tr key={index}>
              <td className="hour-cell">{user.name}</td>
              <td className="hour-cell">{user.elapsedTime}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
