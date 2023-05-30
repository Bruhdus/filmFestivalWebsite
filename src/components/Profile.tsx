import axios from 'axios';
import React, {FormEvent, useState} from "react";
import {useUserInfoStorage} from "../store";
import {useNavigate} from "react-router-dom";
import ImageInput from "./ImageInput";
const Profile = () => {
    const navigate = useNavigate()
    const [user, setUser] = React.useState<User>()
    const [hasProfilePhoto, setHasProfilePhoto] = React.useState(true)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [curPassword, setCurPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = React.useState("")
    const [savedChanges, setSavedChanges] = React.useState(false)
    const [image, setImage] = useState<File | null>(null);
    const userId = useUserInfoStorage(state => state.userId);
    const token = useUserInfoStorage(state => state.token);
    const validImageTypes = ['image/jpeg', 'image/gif', 'image/png']

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
                if (response.data.email === undefined) {
                    navigate('/films')
                }
            })
            .catch(function (error) {
                navigate('/films')
            });
    }, [token])

    React.useEffect(() => {
        getUser()
    }, [])

    const getUser = () => {
        const config = {
            method: 'get',
            url: `http://localhost:4941/api/v1/users/${userId}`,
            headers: {
                'X-Authorization': token
            }
        };

        axios(config)
            .then(function (response) {
                setUser(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const updateUser = () => {
        const data: EditUser = {}

        if (firstName !== '') {data.firstName = firstName}
        if (lastName !== '') {data.lastName = lastName}
        if (email !== '') {data.email = email}
        if (newPassword !== '') {data.currentPassword = curPassword; data.password = newPassword}

        const config = {
            method: 'patch',
            url: `http://localhost:4941/api/v1/users/${userId}`,
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            },
            data : data
        };
        console.log(data)

        axios(config)
            .then(function (response) {
                console.log(response);
                getUser()
                resetEditDetailModal()
                setSavedChanges(true)
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    setErrorMessage("Incorrect password")
                } else if (error.response.status === 403) {
                    setErrorMessage("Email already in use")
                }
                console.log(error)
            });
    }

    const updateUserPhoto = () => {
        if (image === null) {
            setErrorMessage("Please select a image")
        } else if(!(validImageTypes.includes(image.type))) {
            setErrorMessage("Image file type must be JPEG, PNG, or GIF")
        } else {
            const config = {
                method: 'put',
                url: `http://localhost:4941/api/v1/users/${userId}/image`,
                headers: {
                    'Content-Type': image?.type,
                    'X-Authorization': token
                },
                data: image
            };

            axios(config)
                .then(function (response) {
                    window.location.reload()
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    const deleteUserPhoto = () => {
        const config = {
            method: 'delete',
            url: `http://localhost:4941/api/v1/users/${userId}/image`,
            headers: {
                'X-Authorization': token
            }
        };

        axios(config)
            .then(function (response) {
                setHasProfilePhoto(false)
                window.location.reload()
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (firstName === '' && lastName === '' && email === '' && newPassword === '') {
            setErrorMessage("No Changes")
        } else {
            updateUser()
        }
    }

    const handleImageSelect = (file: File | null) => {
        setImage(file);
    };

    const resetEditDetailModal = () => {
        clearInputs()
        setSavedChanges(false)
        setErrorMessage('')
    }

    const resetImageUpdateModal = () => {
        setImage(null)
        const imageSelect = document.getElementById("imageSelect") as HTMLInputElement
        imageSelect.value = ''
    }

    const clearInputs = () => {
        setFirstName('')
        setLastName('')
        setEmail('')
        setCurPassword('')
        setNewPassword('')
    }

    const displayErrorMessage = () => {
        if (errorMessage !== '') {
            return (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div> )
        }
    }

    const DisplayEditDetails = () => {
        if (savedChanges) {
            return (
                <div className="alert-success">
                    <p>Changes Saved</p>
                </div>
            )
        }
        return (
            <form onSubmit={handleSubmit}>
                {displayErrorMessage()}
                <br/>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" className="form-control" id="firstName"
                           placeholder={"Enter a new first name"} value={firstName}
                           onChange={(event) => setFirstName(event.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" className="form-control" id="lastName"
                           placeholder="Enter a new last name" value={lastName}
                           onChange={(event) => setLastName(event.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" className="form-control" id="email"
                           placeholder="Enter a new email address" value={email}
                           onChange={(event) => setEmail(event.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="currentPassword" minLength={6}
                           placeholder="Enter your current password" value={curPassword} required={newPassword !== ''}
                           onChange={(event) => setCurPassword(event.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input type="password" className="form-control" id="newPassword" minLength={6}
                           placeholder="Enter your new password" value={newPassword}
                           onChange={(event) => setNewPassword(event.target.value)}/>
                </div>
                <div>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button id="EditDetailsSaveButton" type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                </div>
            </form>
        )
    }

    const displayEditPhoto = () => {
        if (savedChanges) {
            return (
                <div className="alert-success">
                    <p>Changes Saved</p>
                </div>
            )
        } else {
            return (
                <>
                    {displayErrorMessage()}
                    <br/>
                    <ImageInput required={false} onImageSelect={handleImageSelect} />
                </>
            )
        }
    }


    const onImageError = (id: any) => {
        setHasProfilePhoto(false)
        const element = document.getElementById(id) as HTMLImageElement
        if (!element) return
        element.src = "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg"
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 offset-sm-2 col-md-6 offset-md-3">
                    <div className="rounded shadow-lg p-5 mt-5">
                        <h2>Profile</h2>
                        <div className="row">
                            <div className="col-md-6">
                                <img id="ProfileImage" src={`http://localhost:4941/api/v1/users/${userId}/image`}  onError={(e: any) => onImageError("ProfileImage")}
                                     className="rounded-circle img-fluid" alt="Sorry" height="200" width="200"/>
                                <b/>
                                <div className="mt-3 d-flex justify-content-between">
                                    {hasProfilePhoto && (<button type="button" className="btn btn-primary mr-2" onClick={deleteUserPhoto}>Delete Photo</button>)}
                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#updatePhotoModal" onClick={() => resetImageUpdateModal()}>
                                        Update Photo
                                    </button>
                                </div>
                                <div className="modal fade" id="updatePhotoModal" tabIndex={-1} role="dialog" aria-labelledby="updatePhotoModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Change Profile Photo</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {displayEditPhoto()}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="button" className="btn btn-primary" onClick={updateUserPhoto}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <p>First Name: <strong>{user?.firstName}</strong></p>
                                <p>Last Name: <strong>{user?.lastName}</strong></p>
                                <p>Email: <strong>{user?.email}</strong></p>
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editDetailModalCenter" onClick={()=>resetEditDetailModal()}>
                                    Edit Details
                                </button>

                                <div className="modal fade" id="editDetailModalCenter" tabIndex={-1} role="dialog" aria-labelledby="editDetailModalCenterTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Edit Details</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {DisplayEditDetails()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;