// Things
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

//React Toastify
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Components
import NavigationBar from './components/Nav.jsx';
import WelcomeFooter from './components/WelcomeFooter.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// Pages
import CheckStock from './pages/CheckStock.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import TakeStock from './pages/TakeStock.jsx';
import FormList from './pages/FormList.jsx';
import CreateForm from './pages/CreateForm.jsx';
import BuiltForm from './pages/BuiltForm.jsx';

function App() {
    return (
        <>
        <Router>
            <NavigationBar />
            <div className="mainDiv">
                <Routes>
                    <Route path='/' element={<FormList />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/profile' element={<PrivateRoute />}>
                        <Route path='/profile' element={<Profile />} />
                    </Route>
                    <Route path='/createform' element={<PrivateRoute />}>
                        <Route path='/createform' element={<CreateForm />} />
                    </Route>
                    <Route path='/builtform' element={<PrivateRoute />}>
                        <Route path='/builtform' element={<BuiltForm />} />
                    </Route>
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/takestock' element={<TakeStock />} />
                    <Route path='/checkstock' element={<CheckStock />} />
                    <Route path='/forgotpassword' element={<ForgotPassword />} />
                </Routes>
            </div>
        <WelcomeFooter />
        </Router>

        
        <ToastContainer />
        </>
    )
}

export default App;