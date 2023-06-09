import React, {useState, useRef} from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {

  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
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
      navigate("/dashboard");
    } catch {
      setError('Failed to create an account')
    }

    setLoading(false);
  }


  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh"}}
      >
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group className="mb-4" id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Form.Group className="mb-4" id="password-confirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control type="password" ref={passwordConfirmRef} required />
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">Sign Up</Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </Container>
    </>
  )
}

export default Signup;