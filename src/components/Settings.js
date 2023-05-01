import React, {useState, useRef} from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const UpdateProfile = () => {

  const navigate = useNavigate();
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateUserPassword } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value))
    }

    Promise.all(promises).then(() => {
      navigate('/dashboard')
    }).catch(() => {
      setError("Failed to update account");
    }).finally(() => {
      setLoading(false)
    })
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
              <h2 className="text-center mb-4">Settings</h2>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-4" id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={currentUser.email} />
                </Form.Group>

                <Form.Group className="mb-4" id="first-name">
                  <Form.Label>First name</Form.Label>
                  <Form.Control type="text" ref={firstNameRef}
                    value={currentUser.firstName} />
                </Form.Group>

                <Form.Group className="mb-4" id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef}
                    placeholder="Leave blank to keep the same" />
                </Form.Group>

                <Form.Group className="mb-4" id="password-confirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control type="password" ref={passwordConfirmRef}
                    placeholder="Leave blank to keep the same" />
                </Form.Group>

                <Button disabled={loading} className="w-100" type="submit">Save Changes</Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <Link to="/Dashboard">Cancel</Link>
          </div>
        </div>
      </Container>
    </>
  )
}

export default UpdateProfile;