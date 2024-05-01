import {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged } from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

function WelcomeFooter() {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const auth = getAuth();

    useEffect(() => {
        setUser(auth.currentUser);

        const authStateChange = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => authStateChange();

    }, [auth]);

    const onLogout = async () => {
        try {
            auth.signOut();
            navigate('/login');
        } catch(error) {
            toast.error('There was an problem signing out, according to the server: ' + error.message);
        }
    }

    // return user ? <p className="welcomeP">Welcome, {user.displayName}</p> : <p className="welcomeP">No User Logged In</p>
  
    return (
    <div className="footerWelcomeDiv">
            <p>{user ? `Welcome, ${user.displayName}` : 'No User Logged In'}</p>
            {/* This button below can actually be a component... I rate. But lets see to do that if we change our mind about this footer */}
            <button onClick={user ? onLogout : () => navigate('/login')} className="footerLoginLogoutButton">{user ? 'Logout' : 'Login'}</button>
    </div>
)}

export default WelcomeFooter