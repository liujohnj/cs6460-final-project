import React, {useState, useRef} from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
// import { getDatabase, ref, set } from "firebase/database";
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';


const Signup = () => {

  const navigate = useNavigate();
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      await addDoc(collection(db, "users"), {
         email: emailRef.current.value,
         firstName: firstNameRef.current.value,
         lastName: lastNameRef.current.value,
         teamStatus: "team-undecided",
         track: "track-undecided",
         geography: "geo-na",
         timeZone: "tz-na",
         interests: "",
         role: "student",
         briggs_ei: "NA",
         briggs_si: "NA",
         briggs_tf: "NA",
         briggs_jp: "NA",
         favorites: ["placeholder@example.com"],
         skills: ["Student"]
      });
    } catch(err) {
      console.log("err: ", err);
      setError('Failed to create an account')
    }
    setLoading(false);
    navigate("/update-profile")
  }

  return (
    <div className="grid grid-cols-1 h-screen w-full">
      <div className="bg-gray-100 flex flex-col justify-center">
        <form className="max-w-[400px] w-full mx-auto bg-white p-4" onSubmit={handleSubmit}>
          <h2 className="text-4-xl font-bold text-center py-2">Sign Up</h2>
          {error && <p className="bg-red-100 font-bold border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</p>}
          <div className="flex flex-col py-2">
            <label>Email</label>
            <input className="border p-2" type="email" ref={emailRef} required />
          </div>
          <div className="flex flex-col py-2">
            <label>First name</label>
            <input className="border p-2" id="first-name" type="text" ref={firstNameRef} required />
          </div>
          <div className="flex flex-col py-2">
            <label>Last name</label>
            <input className="border p-2" id="last-name" type="text" ref={lastNameRef} required />
          </div>
          <div className="flex flex-col py-2">
            <label>Password</label>
            <input className="border p-2" id="password" type="password" ref={passwordRef} required/>
          </div>
           <div className="flex flex-col py-2">
            <label>Password Confirmation</label>
            <input className="border p-2" id="password-confirm" type="password" ref={passwordConfirmRef} required />
          </div>
          <button disabled={loading} className="border w-full my-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white">
            Sign Up
          </button>
        </form>
        <div className="flex justify-center mt-4">
            <p className="mr-1">Already have an account?</p>
            <Link to="/login">Log In</Link>
          </div>
      </div>
    </div>
  )
}

export default Signup;