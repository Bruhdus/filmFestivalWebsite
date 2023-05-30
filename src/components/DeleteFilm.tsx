import React from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const DeleteFilm = (film: Film | undefined, token: string, userId: string) => {
    const navigate = useNavigate()

    const deleteFilm = () => {
        const config = {
            method: 'delete',
            url: `http://localhost:4941/api/v1/films/${film?.filmId}`,
            headers: {
                'X-Authorization': token
            }
        };

        axios(config)
            .then(function (response) {
                navigate("/films")
                window.location.reload()
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    if (film !== undefined && film.directorId === Number(userId)) {
        return (
            <div>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#deleteFilmModal">Delete Film</button>

                <div className="modal fade" id="deleteFilmModal" tabIndex={-1} role="dialog" aria-labelledby="deleteFilmModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Are you sure?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Delete Film: <strong>{film.title}</strong>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-danger" onClick={deleteFilm}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (<></>)
}

export default DeleteFilm;