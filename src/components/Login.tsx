import React, {FormEvent, useState} from "react";
import axios from 'axios';
import {useUserInfoStorage} from "../store";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const setTokenToStorage = useUserInfoStorage(state => state.setToken);
    const setUserIdToStorage = useUserInfoStorage(state => state.setUserId);
    const token = useUserInfoStorage(state => state.token);
    const userId = useUserInfoStorage(state => state.userId);

    React.useEffect(() => {
        const config = {
            method: 'get',
            url: `http://localhost:4941/api/v1/users/${userId}`,
            headers: {
                'X-Authorization': token
            }
        };

        axios(config)
            .then(function (response) {
                if (response.data.email !== undefined) {
                    navigate('/films')
                }
            })
            .catch(function (error) {
            });
    }, [token])

    const handleLogIn = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (email.length === 0) {
            setErrorMessage("Please enter a valid email")
        } else if (password.length < 6) {
            setErrorMessage("Password has to be at least 6 characters")
        } else {
            logInUser()
        }
    }

    const logInUser = () => {
        const config = {
            method: 'post',
            url: 'http://localhost:4941/api/v1/users/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data : {
                "email": email,
                "password": password
            }
        };

        axios(config)
            .then(function (response) {
                setTokenToStorage(response.data.token);
                setUserIdToStorage(response.data.userId);
                navigate('/films')
            })
            .catch(function (error) {
                setErrorMessage("Invalid email or password")
            });

    }


    const displayErrorMessage = () => {
        if (errorMessage !== '') {
            return (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div> )
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Log In</h3>
                            <form onSubmit={handleLogIn}>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" className="form-control" id="email"
                                           onChange={(event) => setEmail(event.target.value)}
                                           placeholder="Enter your email address"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" id="password" minLength={6}
                                           onChange={(event) => setPassword(event.target.value)}
                                           placeholder="Enter your password"/>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-4">Log In</button>
                            </form>
                            <br/>
                            {displayErrorMessage()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;