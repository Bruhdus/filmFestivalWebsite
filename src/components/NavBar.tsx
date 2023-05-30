import React from "react";
import {useUserInfoStorage} from "../store";
import axios from 'axios';

const NavBar = () => {
    const token = useUserInfoStorage(state => state.token);
    const userId = useUserInfoStorage(state => state.userId);
    const removeTokenFromLocal = useUserInfoStorage(state => state.removeToken);
    const removeUserIdFromLocal = useUserInfoStorage(state => state.removeUserId);
    const [loggedIn, setLoggedIn] = React.useState(false)

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
                setLoggedIn(response.data.email !== undefined)
            })
            .catch(function (error) {
                setLoggedIn(false)
            });
    }, [token])

    const handleLogout = () => {
        const config = {
            method: 'post',
            url: 'http://localhost:4941/api/v1/users/logout',
            headers: {
                'X-Authorization': token
            },
            data : ''
        };

        axios(config)
            .then(function (response) {
                removeTokenFromLocal()
                removeUserIdFromLocal()
                setLoggedIn(false)
            })
            .catch(function (error) {
            });
    }


    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <h1>Film Festival</h1>
            </div>
            <div className="collapse navbar-collapse" id="navBarSupportedContent">
                {loggedIn ?
                    <div className="navbar-nav">
                        <a className="nav-link" aria-current="page" href="/films">Films</a>
                        <a className="nav-link" aria-current="page" href="/createfilm">Create&nbsp;Film</a>
                        <a className="nav-link" aria-current="page" href="/myfilms">My&nbsp;Films</a>
                        <a className="nav-link" aria-current="page" href="/profile">Profile</a>
                        <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#logoutModal">Logout</button>

                        <div className="modal" id="logoutModal" tabIndex={-1} role="dialog"
                             aria-labelledby="logoutModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="confirmLogoutLabel">Confirm Logout</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure you want to log out?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close
                                        </button>
                                        <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={()=>handleLogout()}>Logout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <div className="navbar-nav">
                        <a className="nav-link" aria-current="page" href="/films">Films</a>
                        <a className="nav-link" href="/users/register">Register</a>
                        <a className="nav-link" href="/users/login">Login</a>
                    </div>
                }
            </div>
        </nav>
    )
}

export default NavBar;