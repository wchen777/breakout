import React, { useState } from 'react';
import JoinForm from '../components/JoinForm'
import JoinRoom from '../components/JoinRoom'


export default function JoinPage( { history }){
    const [ID, setID] = useState('');
    const [showForm, setShowForm] = useState(true);

    return (
        <div>
            {showForm ? 
            <JoinForm history={history} setShowForm={setShowForm} setID={setID}/> :
            <JoinRoom ID={ID}/> 
            }
        </div>
         
    )
}