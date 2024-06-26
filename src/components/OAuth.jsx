import {useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore';
import { db } from '../firebase.config';
import {toast} from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {

    const navigate = useNavigate();
    const location = useLocation();

    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check for user
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            // If user does not exist, create user
            if(!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp() 
                })
            }
            navigate('/')

        } catch (error) {
            toast.error("Could not authorize with google, according to the server: " + error.message);

        }
    }

  return (
    <div className="socialLoginDiv">
        <p>Sign {location.pathname === '/register' ? 'up' : 'in'}</p>
        <button className="socialIconButton" onClick={onGoogleClick}>
            <img src={googleIcon} alt="google" className="socialIconImg" />
        </button>
    </div>
  )
}

export default OAuth