import {useState} from 'react';
import {Link} from 'react-router-dom';
import {getAuth, sendPasswordResetEmail } from 'firebase/auth';
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowAltCircleRight, faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email)
      toast.success("Email Was Sent");
    } catch(error) {
      toast.error("Could not send email, according to the server: " + error.message);
    }
  }

  return (
    <>
      <h2>Forgot Password</h2>
      <br></br>

      <small>Enter the email address linked to your account, and we will send an email to it with a Reset Password link.</small>

      <br></br>

      <form onSubmit={onSubmit} className="loginRegistrationForm">

      <div className="formField">
        <FontAwesomeIcon className="formFieldIcon" icon={faEnvelopeCircleCheck } style={{ fontSize: '18px' }} />
        <input
          className="loginRegistrationField emailInput"
          type="email"
          placeholder="Email"
          id="email" value={email}
          onChange={onChange}
            />
      </div>

      <br></br>

        <div className="signInBar">
          <button className="signIn formSubmitButton"> Reset Now <FontAwesomeIcon className="formButtonIcon" icon={faArrowAltCircleRight} style={{fontSize : '18px' }}></FontAwesomeIcon> </button>
        </div>

        <Link to="/login" className="insteadLink"> Have an Account? Login Instead </Link>
      </form>
    </>
  )
}

export default ForgotPassword