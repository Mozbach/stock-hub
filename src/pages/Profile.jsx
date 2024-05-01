import {useEffect, useState} from 'react';
import {getAuth, updateProfile} from 'firebase/auth';
import {updateDoc, doc} from 'firebase/firestore';
import { db } from '../firebase.config';
import {Link, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {toast} from 'react-toastify';
import CreateFormButton from '../components/CreateFormButton';


function Profile({authedUser}) {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const userId = auth.currentUser.uid

  // Destructure formData
  const { name , email, formIds } = formData;

  console.log(formIds);

  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name) {
        // Update Display Name:
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        // Update in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name: name
        })
        
      }
    } catch(error) {
      toast.error('Details could not be updated. According to error message: ' + error.message);
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id] : e.target.value
    }))
  }
  return (
    <>
    <h2>User Profile Page</h2>
    <br></br>
    <div className="generalDiv">
    
      <h4 className="profileDetailsH4">
        Profile Details
        <button onClick={() => {
          changeDetails && onSubmit()
          setChangeDetails((prevState) => !prevState) }}
          className="editDetailsButton">
            {changeDetails ? "Done" : "Change"}
        </button>
      </h4>

    <form className="editDetailsForm">
    <FontAwesomeIcon className="editDetailsFormIcon" icon={faUser } style={{ fontSize: '12px' }} />
      <input
        type="text"
        id="name"
        className={!changeDetails ? 'profileName' : 'profileNameActive'}
        disabled={!changeDetails}
        value={name}
        onChange={onChange}
      />
      <br></br>
    <FontAwesomeIcon className="editDetailsFormIcon" icon={faEnvelopeCircleCheck } style={{ fontSize: '12px' }} />
      <input
        type="text"
        id="email"
        // className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
        disabled={true}
        value={email}
        onChange={onChange}
      />
    </form>

    <small>User ID: {userId}</small>

    <br></br>
    <CreateFormButton />

    </div>

    </>
    
  )
}

export default Profile