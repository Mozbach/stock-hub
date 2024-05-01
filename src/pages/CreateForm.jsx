import {useState, useEffect, useRef} from 'react';
import {getAuth, onAuthStateChanged} from'firebase/auth';
import {collection, addDoc, getDoc, doc, updateDoc} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { db } from '../firebase.config';
import {useNavigate} from 'react-router-dom';
import Spinner from '../components/Spinner';

function CreateForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        formName: '',
        shelves : [{
            shelfName: '',
            products: [
                {
                    productName: '',
                    productCode: '',
                    initialQuantity: '',
                    currentCount: 0,
                    productImg: ''
                }
            ]
        }],
    });
    
    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);
    const userUID = auth.currentUser.uid;

    useEffect(() => {
        if(isMounted) {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...formData, userRef: user.uid});
                } else {
                    navigate('/login');
                }
            })
        }

        return() => {
            isMounted.current = false;
        }
    }, [isMounted]);

    // Destructuring the formData
    const {formName, shelfName, shelf} = formData;

    const addShelf = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            shelves: [
                ...prevFormData.shelves,
                {
                    shelfName: '',
                    products: [
                       { 
                        productName: '',
                        productCode: '',
                        initialQuantity: 0,
                        currentCount: 0,
                        productImg: ''
                    }
                    ]
                }
            ]
        }))
    }

    const addProduct = (shelfIndex) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            shelves: prevFormData.shelves.map((shelf, index) => {
                if (index === shelfIndex) {
                    return {
                        ...shelf,
                        products: [
                            ...shelf.products,
                            {
                                productName: '',
                                productCode: '',
                                initialQuantity: 0,
                                currentCount: 0,
                                productImg: ''
                            }
                        ]
                    };
                }
                return shelf;
            })
        }));
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
    }))
}

    const handleShelfNameChange = (e, shelfIndex) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            shelves: prevFormData.shelves.map((shelf, index) => 
                index === shelfIndex ? {...shelf, shelfName: value } : shelf
            )
        }))
    }

    const handleProductInputChange = (e, shelfIndex, productIndex, fieldName) => {
        const {value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            shelves: prevFormData.shelves.map((shelf, index) => 
            index === shelfIndex ? {
                ...shelf,
                products: shelf.products.map((product, i) => 
                i === productIndex ? { ...product, [fieldName] : value} : product
                )
            } : shelf
            )
        }))
        // console.log("Product Shelf Index: " + shelfIndex + " || ProductIndex: " + productIndex + " || Input Value: " + value);
    }

    const deleteThisShelf = (shelves, shelfIndex) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            shelves: prevFormData.shelves.map((shelf, index) => {
                if(index === shelfIndex) {
                    return false; // returns null instead of shelfIndex, so an array of shelves without the shelf which holds the shelfIndex
                }
                return shelf;
            }).filter(Boolean)
        }));
    }

    const deleteThisProduct = (shelfIndex, productIndex) => {
        console.log("Shelf Shelf Name: " + formData.shelves[shelfIndex].shelfName + "Product Index: " + productIndex + "Product Name: " + shelf.products[productIndex].productName);
        setFormData((prevFormData) => ({
            ...prevFormData,
            shelves: prevFormData.shelves.map((shelf, index) => {
                if(index === shelfIndex) {
                    return {
                        ...shelf,
                        products: shelf.products.filter((product, i) => i !== productIndex)
                    }
                }
                return shelf;
            })
        }))
    }

    const handleImageUpload = async (file, shelfIndex, productIndex) => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `images/${auth.currentUser.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
    
            // Update productImage field within formData
            setFormData(prevFormData => {
                const updatedShelves = [...prevFormData.shelves];
                updatedShelves[shelfIndex].products[productIndex].productImg = downloadUrl;
                return { ...prevFormData, shelves: updatedShelves };
            });
    
            console.log("Image upload complete.");
        } catch(error) {
            console.error("Error uploading image: ", error);
        }
    } // end of handleImageUpload

    if(loading) {
        return ( <Spinner />);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
    
        try {            
            // Save the form data to firestore
            const docRef = await addDoc(collection(db, 'stockFormsCollection'), formData);
            console.log('Form data submitted successfully with ID: ', docRef.id);
    
            // retrieve the user's document
            const userDocRef = doc(db, 'users', userUID);
            const userDocSnapshot = await getDoc(userDocRef);
    
            // Attempt to add new form id using docRef.id
            if(userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const newFormIds = userData.formIds ? [...userData.formIds, docRef.id] : [docRef.id];
                await updateDoc(userDocRef, {formIds : newFormIds});
                console.log("Form ID added to user data: ", docRef.id)
            }
        } catch(error) {
            console.error('Error submitting form data: ' , error);
        }
    } // end of onSubmit

    const renderShelvesAndProducts = () => {
        return formData.shelves.map((shelf, shelfIndex) => (
            <div key={shelfIndex} className="createFormFieldDiv shelfNameDiv" >
                <label htmlFor={`shelfName${shelfIndex}`} className="createNewFormLabel">
                    Shelf Name
                </label>
                <button  type="button" className="deleteThisShelfButton" onClick={() => deleteThisShelf(formData.shelves, shelfIndex)}>(×)</button>
                <input
                    type="text"
                    name={`shelfName${shelfIndex}`}
                    className="createFormInput"
                    id={`shelfName${shelfIndex}`}
                    value={shelf.shelfName}
                    onChange={(e) => handleShelfNameChange(e, shelfIndex)}
                />

                {shelf.products.map((product, productIndex) => (
                    <div key={productIndex} className="createFormFieldDiv addNewProductDiv" >
                           <label htmlFor={`productNameInput${shelfIndex}_${productIndex}`} className="createNewFormLabel">
                    Product Name
                </label>
                <button  type="button" onClick={() => deleteThisProduct(shelfIndex, productIndex)} className="deleteThisProductButton">Delete Product</button>
                <input
                    type="text"
                    name={`productNameInput${shelfIndex}_${productIndex}`}
                    className="createFormInput"
                    id={`productNameInput${shelfIndex}_${productIndex}`}
                    value={product.productName}
                    onChange={(e) => handleProductInputChange(e, shelfIndex, productIndex, 'productName')}
                />
                <div className="addProductDetails">
                    <div className="qtyAndCodeDiv">
                        <label
                            htmlFor={`initialQty${shelfIndex}_${productIndex}`}
                            className="addProductDetailsLabel">
                                Initial Quantity
                        </label>
                        <input
                            type="number"
                            name={`initialQtyInput${shelfIndex}_${productIndex}`}
                            className="addProductDetailsInput"
                            id={`initialQtyInput${shelfIndex}_${productIndex}`}
                            value={product.initialQuantity}
                            onChange={(e) => handleProductInputChange(e, shelfIndex, productIndex, 'initialQuantity')}
                        />
                    </div>
                    <div className="qtyAndCodeDiv">
                        <label
                            htmlFor={`productCode${shelfIndex}_${productIndex}`}
                            className="addProductDetailsLabel">
                                Product Code
                        </label>
                        <input
                            type="text"
                            name={`productCode${shelfIndex}_${productIndex}`}
                            className="addProductDetailsInput"
                            id={`productCode${shelfIndex}_${productIndex}`}
                            value={product.productCode}
                            onChange={(e) => handleProductInputChange(e, shelfIndex, productIndex, 'productCode')}
                        />
                    </div>
                    
                    <input
                    type="file" onChange={(e) => e.target.files.length && handleImageUpload(e.target.files[0], shelfIndex, productIndex)} className="addProductImageButton" />
                </div>
                    </div>
                ))}
                <button  type="button" onClick={() => addProduct(shelfIndex)} className="addProductButton">Add Product</button>
                
            </div>
        ))
    } // end of renderShelvesAndProducts

  return (
    <>
        <h2>Create a Form</h2>
        <form onSubmit={onSubmit} className="createNewFormForm">
            <div className="createFormFieldDiv">
                <label htmlFor="formName" className="createNewFormLabel">Form Name</label>
                <input onChange={(e) => handleInputChange(e)} type="text" name="formName" className="createFormInput" id="formNameInput" />
            </div>
            {renderShelvesAndProducts()}
           
            <button  type="button" onClick={addShelf} className="addShelfButton">Add Shelf</button>

        <br></br>

        <button  type="submit" className="createFormSubmitButton">Create Form</button>
        </form>
    </>
  )
}

export default CreateForm
