import {React, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import OAuth from '../components/OAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faKey,  faEnvelopeCircleCheck, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';

function Login() {
const [showPassword, setShowPassword] = useState(false);
const [formData, setFormData] = useState({
  email: '',
  password: ''
});

const navigate = useNavigate();

const onChange = (e) => {
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id] : e.target.value
  }))
}

const {email, password} = formData;

const onSubmit = async (e) => {
  e.preventDefault();

  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if(userCredential) {
      navigate('/');
    }
  } catch (error) {
    toast.error(error.message);
  }

  
}

  return (
    <>
      <h2 className="headerH2">Login to Proceed</h2>

      <form className="loginRegistrationForm" onSubmit={onSubmit}>
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
        <div className="formField">
            <FontAwesomeIcon className="formFieldIcon" icon={faKey } style={{ fontSize: '18px' }} />
        <input
            className="loginRegistrationField passwordInput"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            value={password}
            onChange={onChange}
            />
        <Link to="/forgotpassword" className="forgotPasswordLink"> Forgot Password? </Link>
        </div>

        <br></br>

        <div className="signInBar">
          <button className="signIn formSubmitButton"> Sign In <FontAwesomeIcon className="formButtonIcon" icon={faArrowAltCircleRight} style={{fontSize : '18px' }}></FontAwesomeIcon> </button>
        </div>

      </form>
      <OAuth />

      <br></br>
      
        <Link to="/register" className="insteadLink"> Sign Up Instead </Link>
    </>
  )
}

export default Login