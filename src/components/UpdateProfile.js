import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDocs, collection, query, where, orderBy, onSnapshot, setDoc}
          from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Radio, useRadioGroup, Textarea } from "@material-tailwind/react";
import User from "./User";
import Test from "./Test";

const UpdateProfile = () => {

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillsArr, setSkillsArr] = useState([]);
  const [data, setData] = useState("");
  const [userId, setUserId] = useState();
  const [track, setTrack] = useState();
  const [teamStatus, setTeamStatus] = useState();


  useEffect(() => {
    async function fetchData() {
      //console.log("currUser = ", currentUser.email);
      let q = query(collection(db, "users"), where("email", "==", currentUser.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserId(doc.id);
        setData(doc.data());
        setTeamStatus(doc.data().teamStatus);
        document.getElementById(doc.data().teamStatus).checked = true;
        setTrack(doc.data().track);
        document.getElementById(doc.data().track).checked = true;
        setInterests(doc.data().interests);
        setSkillsArr(doc.data().skills);
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

  const handleCheckboxChange = event => {
    const checkboxState = document.getElementById(event.target.value).checked;
    if (checkboxState && skillsArr && !skillsArr.includes(event.target.value)) {
      let newArr = [...skillsArr, event.target.value];
      setSkillsArr(newArr);
    } else if (!checkboxState && skillsArr && skillsArr.includes(event.target.value)) {
      let newArr = skillsArr.filter(skill => skill !== event.target.value);
        setSkillsArr(newArr);
    }
  }

  const handleInterestsChange = event => {
    setInterests(event.target.value);
  }

  const handleTeamRadioChange = event => {
    setTeamStatus(event.target.id);
  }

  const handleRadioChange = event => {
    setTrack(event.target.id);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "users", userId);
    // console.log("track: ", track);
    // console.log("interests: ", interests);
    // console.log("skills: ", skillsArr);
    // console.log("team status to upload: ", teamStatus)
    await setDoc(userRef, {
      teamStatus: teamStatus,
      track: track,
      interests: interests,
      skills: skillsArr,
    }, { merge : true });
    window.location.reload(false);
  }


  return (
    <div className="ml-20">
      <User
        email={data.email}
        firstName={data.firstName}
        lastName={data.lastName}
        skills={data.skills}
        teamStatus={data.teamStatus}
        imageURL="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
        track={data.track}
        interests={data.interests}
        geography={data.geography}
        briggs_ei={data.briggs_ei}
        briggs_si={data.briggs_si}
        briggs_tf={data.briggs_tf}
        briggs_jp={data.briggs_jp}
        userId={userId}
      />

      <h3 className="text-bold">Update Your Profile</h3>

      <form onSubmit={handleSubmit}>

        <div className="my-4">
          <h5 className="text-lg">Team Status</h5>
          <div className="flex gap-3 items-center text-sm" >
            <Radio id="team-solo" name="teamStatus" label="Working solo" onChange={handleTeamRadioChange} />
            <Radio id="team-looking" name="teamStatus" label="Looking for teammates" onChange={handleTeamRadioChange} />
            <Radio id="team-open" name="teamStatus" label="On a team - open" onChange={handleTeamRadioChange}/>
            <Radio id="team-closed" name="teamStatus" label="On a team - closed" onChange={handleTeamRadioChange}/>
            <Radio id="team-undecided" name="teamStatus" label="Undecided" onChange={handleTeamRadioChange} />
          </div>
        </div>

        <div className="my-4">
          <h5 className="text-lg">Track</h5>
          <div className="flex gap-3 items-center text-sm" >
            <Radio id="track-content" name="track" label="Content" onChange={handleRadioChange} />
            <Radio id="track-development" name="track" label="Development" onChange={handleRadioChange} />
            <Radio id="track-research" name="track" label="Research" onChange={handleRadioChange}/>
            <Radio id="track-undecided" name="track" label="Undecided" onChange={handleRadioChange} />
          </div>
        </div>

        <div className="my-4">
          <h5 className="text-lg">Areas of interest for project</h5>
          <div className="w-96">
            <Textarea className="border-3 border-blue-800" onChange={handleInterestsChange} defaultValue={data.interests} />
          </div>
        </div>

        <div className="my-4">
          <h5 className="text-lg">Skills</h5>
          <span className="">
            {skills.map((skill) => (
              <li className="list-none inline-block mr-6" key={skill.id}>
                <label>
                  <input className="mr-2"
                    onChange={handleCheckboxChange}
                    type="checkbox"
                    id={skill.data.skillName}
                    defaultChecked={data.skills && data.skills.includes(skill.data.skillName)}
                    value={skill.data.skillName} />
                  {skill.data.skillName}
                </label>
              </li>
            ))}
          </span>
        </div>

       <button className="border w-40 my-8 py-1 bg-indigo-600 hover:bg-indigo-500 text-white">
            Save changes
          </button>
      </form>
    </div>
  )
}

export default UpdateProfile;