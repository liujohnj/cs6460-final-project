import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import User from "./User";

const Students = (props) => {

  const [users, setUsers] = useState([]);
  const [q, setQ] = useState(query(collection(db, "users"), where ("role", "==", "student")));

  useEffect(() => {
    console.log("Size: ", props.desiredSkills.length, props.desiredSkills);
    if (props.desiredSkills.length > 0) {
      setQ(query(collection(db, "users"), where ("role", "==", "student"), where ("skills", "array-contains-any", props.desiredSkills)));
    }
    onSnapshot(q, (snapshot) => {
      let usersArray = [];
      setUsers(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    });
  }, [props.desiredSkills]);

  return (
    <div>
      {users.map((user) => (
        <User
          // id={user.id}
          key={user.id}
          firstName={user.data.firstName}
          lastName={user.data.lastName}
          skills={user.data.skills}
        />
      ))}
    </div>
  )
}

export default Students;