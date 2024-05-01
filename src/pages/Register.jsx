import {React, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faKey, faUser, faEnvelopeCircleCheck, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import OAuth from '../components/OAuth';
import {setDoc, doc, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase.config';

function Register() {
const [showPassword, setShowPassword] = useState(false);
const [formData, setFormData] = useState({
  name: '', 
  email: '',
  password: '',
  formIds: []
});

const navigate = useNavigate();

const onChange = (e) => {
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id] : e.target.value
  }))
}

const {name, email, password} = formData;

const onSubmit = async (e) => {
  e.preventDefault()

  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    updateProfile(auth.currentUser, {
       displayName: name
    });

    const formDataCopy = {...formData};
    delete formDataCopy.password;
    formDataCopy.timestamp = serverTimestamp();

    await setDoc(doc(db, 'users', user.uid), formDataCopy);

    navigate('/')

  } catch(error) {
    toast.error(error.message);
  }
}

  return (
    <>
      <h2 className="headerH2">Register to Proceed</h2>

      <form className="loginRegistrationForm" onSubmit={onSubmit}>
      <div className="formField">
            <FontAwesomeIcon className="formFieldIcon" icon={faUser } style={{ fontSize: '18px' }} />
        <input
          className="loginRegistrationField nameInput"
          type="text"
          placeholder="User Name"
          id="name" value={name}
          onChange={onChange}
          />
      </div>
<br></br>
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
        </div>

        <br></br>

        <div className="SignInBar">
          <button className="signIn formSubmitButton"> Register <FontAwesomeIcon className="formButtonIcon" icon={faArrowAltCircleRight} style={{fontSize : '18px' }}></FontAwesomeIcon> </button>
        </div>
      
      </form>
      <OAuth />

      <br></br>

        <Link to="/login" className="insteadLink"> Have an Account? Login Instead </Link>
    </>
  )
}

export default Register