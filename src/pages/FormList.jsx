import {useState} from 'react';
import CreateFormButton from '../components/CreateFormButton';
import SingleListLink from '../components/SingleListLink';

function FormList() {

  const [checkForForms, setCheckForForms] = useState(false);



  return (
    <>
        <h2>Form List</h2>
        <br></br>
       {checkForForms ? (
        <p>Please select a form from below, or create a new one.</p>
       ) : (
        <p>No forms were detected, please create a form.</p>
       )}

        <br></br>
        
        <SingleListLink />
        
        <CreateFormButton />

    </>
    
  )
}

export default FormList