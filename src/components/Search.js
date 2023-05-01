import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import User from "./User";
import { useAuth } from '../contexts/AuthContext';
import { doc, getDocs, collection, query, where, orderBy, onSnapshot, setDoc}
          from "firebase/firestore";

const Search = () => {

  const [skills, setSkills] = useState([]);
  const [skillsArr, setSkillsArr] = useState([]);
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();
  const [userId, setUserId] = useState();
  const [data, setData] = useState();
  const [favArr, setFavArr] = useState([]);
  const [resetUsers, setResetUsers] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let q = query(collection(db, "users"), where("email", "==", currentUser.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserId(doc.id);
        setData(doc.data());
        setFavArr(doc.data().favorites);
      })
    }
    fetchData();
  }, []);

  useEffect(() => {
    const skillsQuery = query(collection(db, "skills"), orderBy("skillName"))
    onSnapshot(skillsQuery, (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    });
  }, []);

  useEffect(() => {
    // console.log("Size: ", skillsArr.length, skillsArr);
    let q = query(collection(db, "users"), where ("role", "==", "student"));
    if (skillsArr && skillsArr.length > 0) {
      q = query(collection(db, "users"), where ("role", "==", "student"), where ("skills", "array-contains-any", skillsArr));
    }
    onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    });
  }, [skillsArr, resetUsers]);

  const handleCheckboxChange = event => {
    // Uncheck favorites checkbox
    setResetUsers(!resetUsers);
    document.getElementById("fav-checkbox").checked=false;

    let newArr = [...skillsArr, event.target.value];
    if (skillsArr.includes(event.target.value)) {
      newArr = newArr.filter(skill => skill !== event.target.value);
    }
    setSkillsArr(newArr);
  }

  const showFavorites = () => {
      let newArr = users.filter(user => favArr.includes(user.data.email));
      console.log(newArr)
      setUsers(newArr);
  }

  const handleFavCheckboxChange = event => {
    const checkboxState = document.getElementById(event.target.id).checked;
    // users.forEach((user) => {
    //   console.log(user.data.email);
    // });
    if (checkboxState) {
      showFavorites();
    } else {
      setResetUsers(!resetUsers);
    }
  }

  const handleTeamChange = event => {}
  const handleTrackChange = event => {}
  const handleGeoChange = event => {}


  return (
    <div className="flex flex-row">

      {/* Left sidebar */}
      <div className="basis-1/4 px-4">
        <div className="flex flex-col">

          <div className="text-3xl mt-4 mb-3">
            Search
          </div>

          <div className="uppercase text-xl mb-3">
            filters
          </div>

          <div className="mb-4">
            <li className="list-none">
              <label>
                <input
                  id="fav-checkbox"
                  name="fav-checkbox"
                  className="mr-1"
                  onChange={handleFavCheckboxChange}
                  type="checkbox"
                />
                Only show Favorites
              </label>
            </li>
          </div>

          <div className="">
            <h6 className="text-lg">Skills</h6>

            <span className="">
              {skills.map((skill) => (
                <li className="list-none inline-block mr-6" key={skill.id}>
                  <label>
                    <input className="mr-1"
                      name="skill-checkbox"
                      onChange={handleCheckboxChange}
                      type="checkbox"
                      value={skill.data.skillName} />
                    {skill.data.skillName}
                  </label>
                </li>
              ))}
            </span>
          </div>

          <div className="mt-4">
            <h6 className="text-lg">Team Status</h6>
            <li className="list-none inline-block">
              <label className="mr-6">
                <input className="mr-1"
                  name="team-checkbox"
                  onChange={handleTeamChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                Looking for teammates
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="team-checkbox"
                  onChange={handleTeamChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                On a team - open
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="team-checkbox"
                  onChange={handleTeamChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                On a team - closed
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="team-checkbox"
                  onChange={handleTeamChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                Working solo
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="team-checkbox"
                  onChange={handleTeamChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                Undecided
              </label>
            </li>
          </div>

          <div className="mt-4">
            <h6 className="text-lg">Track</h6>
            <li className="list-none inline-block">
              <label className="mr-6">
                <input className="mr-1"
                  name="track-checkbox"
                  onChange={handleTrackChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                Content
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="track-checkbox"
                  onChange={handleTrackChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                Development
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="track-checkbox"
                  onChange={handleTrackChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                Research
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="track-checkbox"
                  onChange={handleTrackChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                Undecided
              </label>
            </li>
          </div>

          <div className="mt-4">
            <h6 className="text-lg">Geography</h6>
            <li className="list-none inline-block">
              <label className="mr-6">
                <input className="mr-1"
                  name="geo-checkbox"
                  onChange={handleGeoChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                NORAM
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="geo-checkbox"
                  onChange={handleGeoChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                APAC
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="geo-checkbox"
                  onChange={handleGeoChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                LATAM
              </label>
              <label className="mr-6">
                <input className="mr-1"
                  name="geo-checkbox"
                  onChange={handleGeoChange}
                  type="checkbox"
                  defaultChecked
                  disabled />
                EMEA
              </label>
            </li>
          </div>

        </div>
      </div>

      {/* ========================================= */}
      {/* Center */}
      <div className="basis-3/4 px-4">
        {users.map((user) => (
          <User
            key={user.id}
            email={user.data.email}
            firstName={user.data.firstName}
            lastName={user.data.lastName}
            skills={user.data.skills}
            teamStatus={user.data.teamStatus}
            imageURL={user.data.imageURL}
            track={user.data.track}
            interests={user.data.interests}
            geography={user.data.geography}
            briggs_ei={user.data.briggs_ei}
            briggs_si={user.data.briggs_si}
            briggs_tf={user.data.briggs_tf}
            briggs_jp={user.data.briggs_jp}
            userId={userId}
          />
        ))}
      </div>
    </div>
  )
}

export default Search;