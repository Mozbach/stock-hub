import Spinner from "../components/Spinner";
import {useState, useEffect} from 'react';
import {getAuth} from 'firebase/auth';
import {collection, getDocs, query, where, doc, getDoc, updateDoc, arrayUnion} from 'firebase/firestore';
import {db} from '../firebase.config';
import {storage} from 'firebase/storage';
import {useLocation} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

 //going to probably need data passed from SingleListLink. But I also assume it will need to import getAuth, onAuthStateChanged from firebase/auth. As well as a few other things like getStorage, ref and getDownloadURL from firebsase/storage
function BuiltForm() {
  const [counts, setCounts] = useState({});
  const [productNames, setproductNames] = useState([]);
  const [theForm, setTheForm]  = useState({});
  const [data, setData] = useState([]);
  const [shelfIndex, setShelfIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(null);

  // Get key from session storage - I tried passing the id as a prop through <Link to={{ pathname: "/bultform", state: form.id}}>, but no matter what, I only managed to pass null. Even though I was able to get it to console log the value on the click of the link, I could not get it to actually pass the value to the builtform component. - this comes from SingleListLink, by the way. So, now I successfully stored the value in the sessionStorage as formID, and now I am just assigning it to a varibale. Simple.
  let sessionFormId = sessionStorage.getItem("formId");

  // add and minus functions
  const plusClick = (e, productCode, productName) => {
    e.preventDefault();
    setCounts(previousCounts => ({
        ...previousCounts,
        [productCode]: (previousCounts[productCode] || 0) + 1
    }));
    console.log(data);
}

const minusClick = (e, productCode, productName) => {
    e.preventDefault();
    setCounts(previousCounts => ({
        ...previousCounts,
        [productCode]: Math.max((previousCounts[productCode] || 0) - 1, 0)
    }));
    console.log(data);
}

  // Functions to be used within the form, to gather the input total, so that when one clicks + or -, it will either add or subtract that gatheredInput total:
  const gatherInputTotal = (e, operator, productCode) => {
    e.preventDefault();
    const inputTotal = parseInt(document.getElementById(`input-${productCode}`).value);
    if (!isNaN(inputTotal)) {
        if(operator === "+") {
            setCounts(previousCounts => ({
                ...previousCounts,
                [productCode]: (previousCounts[productCode] || 0) + inputTotal
            }));
        } else if(operator === '-') {
            setCounts(previousCounts => ({
                ...previousCounts,
                [productCode]: Math.max((previousCounts[productCode] || 0) - inputTotal, 0)
            }));
        }
    } else {
        console.error('Input is not a valid number');
    }
} // end of gatherInputTotal

  const location = useLocation();
  useEffect(() => {

    
    const auth = getAuth();
    const user = auth.currentUser;
    if(user) {
      console.log("This is sessionFormId: ", sessionFormId);
      const fetchForm = async () => {
        try {
          const formsCollection = collection(db, 'stockFormsCollection');
          const formQuery = query(formsCollection, where('__name__', '==', sessionFormId));
          const formSnap = await getDocs(formQuery);
          const formData = formSnap.docs.map(doc => doc.data());
          setData(formData);

        } catch(error) {
          console.log("Error was caught: " , error.message);
        }
      }
      fetchForm();
    }
    
    // console.log("This currently is formId: ", sessionFormId);
  }, [location.state, sessionFormId]);

  // I am struggling to actually submit the stock to the Database. I keep getting various errors

  const submitStock = async (e, shelfIndex, productIndex) => {
    e.preventDefault();
    
    for (const [productCode, count] of Object.entries(counts)) {
      try {
        // Construct the document reference to the product
        const productRef = doc(db, 'stockFormsCollection', sessionFormId, 'shelves', shelfIndex, 'products', productIndex);
        
        // Get the product snapshot to access its data
        const productSnapshot = await getDoc(productRef);
        const productData = productSnapshot.data();
        
        // Update the currentCount within the product data array
        productData.currentCount = count;
        
        // Update the document with the modified product data
        await updateDoc(productRef, productData);
        
        console.log(`Product successfully updated for ${productCode} to ${count}`);
      } catch(error) {
        console.log("Error updating product: ", error);
      }
    }
  };// end of submitStock

const [selectedProductIndex, setSelectedProductIndex] = useState(null);

const showProductImage = (shelfIndex, productIndex) => {
  setSelectedProductIndex({ shelfIndex, productIndex });
}

const hideProductImage = () => {
  setSelectedProductIndex(null);
}

const buildForm = (data) => {
  return data.map((docData, docIndex) => {
    const shelves = docData.shelves;
    return shelves.map((shelf, shelfIndex) => (
      <div className="shelfHolderDiv" key={shelfIndex}>
        <h2 className="shelfTItleH2" key={shelfIndex}>{shelf.shelfName}</h2>
        {shelf.products.map((product, productIndex) => (
          <div className="fieldsetDiv" key={productIndex}>
            <FontAwesomeIcon onClick={() => showProductImage(shelfIndex, productIndex)} className="fontAwesomeProductImage" icon={faImage} style={{ fontSize: '18px' }} />

            {(selectedProductIndex && selectedProductIndex.shelfIndex === shelfIndex && selectedProductIndex.productIndex === productIndex) && (
              <dialog className="productImageDialog" style={{backgroundImage: `url(${product.productImg})`}} open>
                <button className="closeProductImageDialog" onClick={hideProductImage}>(×)</button>
              </dialog>
            )}

            <p className="formProductNameP">{product.productName}</p>
            <div className="holdsButtonsAndInput">
              <div className="inputAndButtons">
                <button onClick={(e) => gatherInputTotal(e, "+", product['productCode'])} className="inputButton addInputButton"> + </button>
                <input id={`input-${product.productCode}`} name={product['productName']} type="text" className="loopInput" />
                <button onClick={(e) => gatherInputTotal(e, "-", product['productCode'])} className="inputButton subtractInputButton"> - </button>
              </div>
              <br />
              <button className="plusStockButton stockButton" onClick={(e) => plusClick(e, product['productCode'])}> + 1 </button>
              <button className="minusStockButton stockButton" onClick={(e) => minusClick(e, product['productCode'])}> - 1 </button>
              <br />
              <p className={`currentCount ${product['count']}`}>Current Count: {counts[product['productCode']]}</p>
            </div>
          </div>
        ))}
      </div>
    ))
  })
}
  // end of buildForm

  return (
    <> 
      {data.map((docData, docIndex) => {
        return (
        <h2 key={docIndex}>{docData.formName}</h2>
      )
    })}
      <form onSubmit={(e) => submitStock(e, shelfIndex, productIndex)} className="stockForm">
        {buildForm(data, shelfIndex)}
        <br></br>
        <br></br>
        <button type="submit" className="formSubmitButton">Subit Stock</button>
      </form>
    </>
  )
}

export default BuiltForm