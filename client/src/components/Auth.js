import React, {useState} from 'react'
import '../css/Auth.css';
import axios from 'axios'

export const Auth = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const {email, password} = formData;
    const [isSignedUp, signedUp] = useState(true)
    const config = {
        headers:{
            'Content-type': 'application/json'
        }
    }

    const onChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value  })
    }
    const onsubmit = async (e) => {
        e.preventDefault()
        if(email.trim().length === 0 || password.trim().length===0) return;
        
        let query = {
            query: `
                query {
                    auth(email: "${email}", password: "${password}"){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }
        if(!isSignedUp){
            query = {                
                query: `
                mutation {
                    createUser(userInput:{email: "${email}", password: "${password}"}){
                        _id
                        email
                    }
                }
            `
            }
        }
        try {
            const res = await axios.post('/graphql', JSON.stringify(query), config)
            const errors = res.data.errors
            if(errors){
                errors.forEach(err => {
                    alert(err.message)
                });
            }
            else{
                console.log(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form className="auth-form" onSubmit={e => onsubmit(e)}>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" defaultValue={email} onChange={e => onChange(e)}/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" defaultValue={password} onChange={e => onChange(e)}/>
            </div>
            <div className="form-actions">
                <button type="button" onClick={() => signedUp(!isSignedUp)}>Switch to {isSignedUp ? "Sign in" : "Sign up"}</button>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}
