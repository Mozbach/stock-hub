import {React, useState} from 'react';

function CurrentDate() {
    const [date, setDate] = useState(new Date());

    return (
        <p>{date.toDateString()}</p>
    );
}

export default CurrentDate;