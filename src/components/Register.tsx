import React, {FormEvent, useState} from 'react';
import axios from 'axios';
import ImageInput from "./ImageInput";
import {useUserInfoStorage} from "../store";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const setTokenToStorage = useUserInfoStorage(state => state.setToken);
    const setUserIdToStorage = useUserInfoStorage(state => state.setUserId);
    const localToken = useUserInfoStorage(state => state.token);
    const localUserId = useUserInfoStorage(state => state.userId);
    const validImageTypes = ['image/jpeg', 'image/gif', 'image/png']
    let token = '';
    let userId = -1;

    React.useEffect(() => {
        const config = {
            method: 'get',
            url: `http://localhost:4941/api/v1/users/${localUserId}`,
            headers: {
                'X-Authorization': localToken
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
    }, [localToken])
    const handleImageSelect = (file: File) => {
        setImage(file);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(image !== null && !(validImageTypes.includes(image.type))) {
            setErrorMessage("Image file type must be JPEG, PNG, or GIF")
        } else {
            registerNewUser();
        }
    }

    const registerNewUser = () => {

        const config = {
            method: 'post',
            url: 'http://localhost:4941/api/v1/users/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": password
            }
        };

        axios(config)
            .then((response) => {
                userId = response.data.userId;
                setErrorMessage("");
                console.log("successful register");
                loginNewUser()
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    console.log(error.response.statusText.substring(18));
                    setErrorMessage(error.response.statusText.substring(18));
                } else if (error.response.status === 403) {
                    console.log(error.response.statusText.substring(11));
                    setErrorMessage(error.response.statusText.substring(11));
                }
            });
    };

    const loginNewUser = () => {

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
                console.log("logged in")
                setTokenToStorage(response.data.token);
                setUserIdToStorage(response.data.userId);
                token = response.data.token
                if (image !== null) {
                    uploadImageToNewUser()
                } else {
                    navigate('/films/')
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }


    const uploadImageToNewUser = () => {
        const config = {
            method: 'put',
            url: `http://localhost:4941/api/v1/users/${userId}/image`,
            headers: {
                'Content-Type': image?.type,
                'X-Authorization': token
            },
            data : image
        };

        axios(config)
            .then(function (response) {
                navigate('/films/')
                console.log(image?.type)
            })
            .catch(function (error) {
                console.log(error);
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
                            <h3 className="card-title text-center mb-4">Create an Account</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name *</label>
                                    <input type="text" className="form-control" id="firstName" minLength={1}
                                           placeholder="Enter your first name" value={firstName}
                                           onChange={(event) => setFirstName(event.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name *</label>
                                    <input type="text" className="form-control" id="lastName"
                                           placeholder="Enter your last name" value={lastName} minLength={1}
                                           onChange={(event) => setLastName(event.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input type="email" className="form-control" id="email"
                                           placeholder="Enter your email address" value={email}
                                           onChange={(event) => setEmail(event.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password *</label>
                                    <input type="password" className="form-control" id="password" minLength={6}
                                           placeholder="Enter a password" value={password}
                                           onChange={(event) => setPassword(event.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <ImageInput required={false} onImageSelect={handleImageSelect} />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-4" data-toggle="modal" data-target="#exampleModal">
                                    Create Account
                                </button>
                            </form>
                            <br/>
                            {displayErrorMessage()}
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Register;
