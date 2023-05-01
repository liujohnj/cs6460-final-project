import React, { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, getDocs, collection, query, where, orderBy, onSnapshot, setDoc}
          from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Checkbox } from "@material-tailwind/react";
import { AiOutlineMail, AiFillMail } from "react-icons/ai";

const User = ({ email, firstName, lastName, skills, teamStatus, imageURL, track,
  interests, geography, briggs_ei, briggs_si, briggs_tf, briggs_jp, userId }) => {

  const [teamStatusText, setTeamStatusText] = useState();
  const [trackText, setTrackText] = useState();
  const [favs, setFavs] = useState();
  const { currentUser } = useAuth();
  const [isHoverEmail, setIsHoverEmail] = useState(false);

  const teamDict = {
    "team-solo": "Working solo",
    "team-looking": "Looking for teammates",
    "team-open": "On a team - open",
    "team-closed": "On a team - closed",
    "team-undecided": "Team Undecided",
  }

  const trackDict = {
    "track-content": "Content",
    "track-development": "Development",
    "track-research": "Research",
    "track-undecided": "Track Undecided"
  }

  const handleMouseEnterEmail = () => {
    setIsHoverEmail(true);
  }

  const handleMouseLeaveEmail = () => {
    setIsHoverEmail(false);
  }

  useEffect(() => {
    console.log("useEffect: ", userId);
    setTeamStatusText(teamDict[teamStatus]);
    setTrackText(trackDict[track]);
  }, [teamStatus, track]);

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      setFavs(docSnap.data().favorites);
    }
    fetchData();
  }, []);

  const handleClickFavorite = async (event) => {
    let favState = document.getElementById(event.target.id).checked;
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    let favArr = docSnap.data().favorites;
    if (favState && favArr && !favArr.includes(email)) {
      var newArr = [...favArr, email];
      favArr = newArr;
      // console.log("1: ", favArr)
    } else if (!favState && favArr && favArr.includes(email)) {
      var newArr = favArr.filter(emailItem => emailItem != email);
      favArr = newArr;
      //console.log("2")
    } else if (favState && !favArr) {
      // console.log("3: ", favState, email, favArr);
    }
    await setDoc(docRef, {
      favorites: favArr
    }, { merge : true });

    window.location.reload(false);
  }

  return (
    <div className="rounded-lg overflow-hidden border-2 border-indigo-300 p-4 m-4">
      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <div>
            <img className="h-16 w-16 rounded-lg object-cover shadow-sm" src={imageURL} alt="profile" />
          </div>
          <div className="ml-4 text-xl">
            {firstName} {lastName}
          </div>

          {/* EMAIL */}
          <div className="mx-4">
            <a href={`mailto:${email}`} target="_blank" onMouseEnter={handleMouseEnterEmail} onMouseLeave={handleMouseLeaveEmail} >
              {!isHoverEmail && <AiOutlineMail size={30} />}
              {isHoverEmail && <AiFillMail size={30} />}
            </a>
          </div>

        {/* FAVORITES CHECKBOX */}
        <div className="flex">
          <p className="self-end text-sm">Favorite?</p>
          <Checkbox
            className="border"
            id={email}
            defaultChecked={favs && favs.includes(email)}
            onClick={handleClickFavorite}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          </div>

          {/* TRACK & TEAM SEARCH */}
          <div className="flex flex-row ml-auto">
            <div className="inline-block bg-gray-50 border border-black rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
              {trackText}
            </div>
            <div className="inline-block bg-gray-50 border border-black rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
              {teamStatusText}
            </div>
          </div>
        </div>

        {/* INTERESTS */}
        <div>
          <p className="mt-6 uppercase">interests</p>
        </div>
        <div>
          <p className="mt-2 text-md">{interests}</p>
        </div>

        {/* SKILLS */}
        <div>
          <p className="mt-6 uppercase">skills</p>
        </div>
        <div className="px-6 py-2">
          {skills && skills.map((skill) => (
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        {/* LOGISTICS */}
        <div>
          <p className="mt-6 uppercase">logistics</p>
        </div>
        <div className="px-6 py-2">
          {(geography && geography !== "geo-na") && <span className="inline-block bg-gray-50 border border-black rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
            {geography}
          </span>}
        </div>

        {/* PERSONALITY */}
        <div>
          <p className="mt-6 uppercase">personality</p>
        </div>
        <div className="px-6 py-2">
          {(briggs_ei === "Extraversion" || briggs_ei === "Introversion") && <span className="inline-block bg-gray-50 border border-black rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
            {briggs_ei}
          </span>}
          {(briggs_si === "Sensing" || briggs_si === "Intuition") && <span className="inline-block bg-gray-50 border border-black rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
            {briggs_si}
          </span>}
          {(briggs_tf === "Thinking" || briggs_tf === "Feeling") && <span className="inline-block bg-gray-50 border border-black rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
            {briggs_tf}
          </span>}
          {(briggs_jp === "Judging" || briggs_tf === "Perceiving") && <span className="inline-block bg-gray-50 border border-black rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
            {briggs_jp}
          </span>}
        </div>
      </div>
    </div>
  )
}

export default User;