import {React, useState, useEffect} from 'react';
import useFetch from '../utils/useFetch.js';
import exportToExcel from '../utils/excelExport.js';

function GenerateFields() {
    const [counter, setCounts] = useState({});
    const [itemNames, setItemNames] = useState([]);

    const plusClick = (e, itemCode, itemName) => {
        e.preventDefault();
        setCounts(previousCounts => ({
            ...previousCounts,
            [itemCode]: (previousCounts[itemCode] || 0) + 1
        }));
        console.log(itemName);
    }

    const minusClick = (e, itemCode, itemName) => {
        e.preventDefault();
        setCounts(previousCounts => ({
            ...previousCounts,
            [itemCode]: Math.max((previousCounts[itemCode] || 0) - 1, 0)
        }));
        console.log(itemName);
    }

    const gatherInputTotal = (e, operator, itemCode) => {
        e.preventDefault();
        const inputTotal = parseInt(e.target.parentNode.querySelector('input').value);
        if (!isNaN(inputTotal)) {
            if(operator === "+") {
                setCounts(previousCounts => ({
                    ...previousCounts,
                    [itemCode]: (previousCounts[itemCode] || 0) + inputTotal
                }));
            } else if(operator === '-') {
                setCounts(previousCounts => ({
                    ...previousCounts,
                    [itemCode]: Math.max((previousCounts[itemCode] || 0) - inputTotal, 0)
                }));
            }
        } else {
            console.error('Input is not a valid number');
        }
    }

    const endpoints = useFetch('http://localhost:8000/data');

    const submitStock = async (e) => {
        e.preventDefault();
        console.log(counter);
        console.log(itemNames); // Check if itemNames is populated correctly
        handleExport();
    }

    useEffect(() => {
        if (endpoints.data) {
            const names = endpoints.data.reduce((acc, endpoint) => {
                return [...acc, ...endpoint.items.map(item => item['item-name'])];
            }, []);
            setItemNames(names);
        }
    }, [endpoints.data]);

    const handleExport = () => {
        exportToExcel(counter, itemNames);
    }

    
  return (
    <>
            <h2 className="titleH2">Take Some Stock</h2>
            
            <form className="stockForm" onSubmit={submitStock}>
            {endpoints.isLoading && <p>Loading...</p>}
            {endpoints.error && <p>Error: {endpoints.error}</p>}
            {endpoints.data && endpoints.data.map((endpoint, index) => (
                <div className="fieldsetDiv" key={index}>
                    <legend>{endpoint.endpointTitle}</legend>
                    {Object.values(endpoint.items).map((item, itemIndex) => (
                    <div className="formGroupInnerDiv" key={itemIndex}>
                        <label for={item['item-name']}>{item['item-name']}</label>
                        <div className="inputAndButtons">
                            <button onClick={(e) => gatherInputTotal(e, "+", item['item-code'])} className="inputButton addInputButton"> + </button>
                            <input id={`input-${item.id}`} name={item['item-name']} type="text" className="loopInput" />
                            <button onClick={(e) => gatherInputTotal(e, "-", item['item-code'])} className="inputButton subtractInputButton"> - </button>
                        </div>
                        <br />
                        <button className="plusStockButton stockButton" onClick={(e) => plusClick(e, item['item-code'])}> + </button>
                        <button className="minusStockButton stockButton" onClick={(e) => minusClick(e, item['item-code'])}> - </button>
                        <br />
                        <p className={item['count']}>{counter[item['item-code']]}</p>
                    </div>
                    ))}
                </div>
            ))}
            <br></br>
                <button type="submit" className="formSubmitButton">Subit Stock</button>
                
            </form>
    </>
  )
}

export default GenerateFields;