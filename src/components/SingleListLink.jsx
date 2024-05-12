import {useState, useEffect} from 'react';
import {getAuth} from 'firebase/auth';
import {collection, getDocs, query, where, doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase.config';
import {Link} from 'react-router-dom';
import BuiltForm from '../pages/BuiltForm';

function SingleListLink() {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if(user) {
            const fetchForms = async () => {
                try {
                    const userUID = user.uid;
                    const userDataRef = doc(db, 'users', userUID);
                    const userDataSnapshot = await getDoc(userDataRef);
                    const userData = userDataSnapshot.data();
                    const formIds = userData.formIds || [];
    
                    const formsCollection = collection(db, 'stockFormsCollection');
                    const formsQuery = query(formsCollection, where('__name__', 'in', formIds));
                    const querySnapshot = await getDocs(formsQuery);
    
                    const formsData = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                    setForms(formsData);
                } catch (error) {
                    console.log('Error Fetching Forms: ', error);
                }
            };
            
            fetchForms();
        } else {
            console.log('Else landed - does not really mean anything');
        }
    }, []);

    const checkThisFormId = (formId) => {
        // console.log("This SHOULD BE formID: ", formId);
        sessionStorage.setItem('formId', formId)
    }

  return (
    <div className="holdsSingleLinksDiv">
        {forms.map(form => {
        
            return (
            <Link onClick={() => checkThisFormId(form.id)} to={"/builtform"} key={form.id} className="holdsSingleListLink" >
            <h2 className="singleLinkH2">{form.formName}</h2>   
            <p className="singleLinkP">Total Shelves: {form.shelves ? form.shelves.length : 0}</p>
            <p className="singleLinkP">Total Products: {form.shelves ? form.shelves.reduce((acc, shelf) => acc + shelf.products.length, 0) : 0}</p>
            <br></br>
            <small className="smallFormId">{form.id}</small>
        </Link>
            )
        })}
    </div>
  )
}

export default SingleListLink