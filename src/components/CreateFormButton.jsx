import {useNavigate} from 'react-router-dom';

function CreateFormButton() {

    const navigate = useNavigate();

  return (
    <>
        <button onClick={() => navigate('/createform')} className="createFormButton">Create a Form</button>
    </>
  )
}

export default CreateFormButton