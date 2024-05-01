
import spinnerLogo from '../assets/spinner-logo.png';
function Spinner() {
  return (
    <>
        <div className="loadingSpinnerContainer">
            <div className="loadingSpinner">
              <img src={spinnerLogo} alt="" className="spinnerLogo" />
            </div>
            <div className="spacerDiv"></div>
            <p className="loadingText">Loading</p>
        </div>
    </>
  )
}

export default Spinner