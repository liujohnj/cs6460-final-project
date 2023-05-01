import React, {useState, useRef, useEffect} from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {

  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { currentUser, login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (currentUser) {
      navigate("/search");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/update-profile');
    } catch {
      setError('Failed to sign in');
    }

    setLoading(false);
  }


  return (
    <div className="grid grid-cols-1 h-screen w-full">
      <div className="bg-gray-100 flex flex-col justify-center">
        <form className="max-w-[400px] w-full mx-auto bg-white p-4" onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 font-bold border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</p>}
          <h2 className="text-4-xl font-bold text-center py-2">Log In</h2>
          <div className="flex flex-col py-2">
            <label>Email</label>
            <input className="border p-2" type="email" ref={emailRef} />
          </div>
          <div className="flex flex-col py-2">
            <label>Password</label>
            <input className="border p-2" type="password" ref={passwordRef} />
          </div>
          <button className="border w-full my-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white">
            Sign In
          </button>
        </form>
        <div className="flex justify-center mt-2">
          <p className="mr-1">Need an account?</p>
          <Link to="/signup">Sign Up</Link>
        </div>
        <div className="flex justify-center mt-1">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </div>
    </div>
  )
}

export default Login;