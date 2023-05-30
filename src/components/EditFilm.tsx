import React, {FormEvent} from 'react';
import axios from 'axios';
import ImageInput from "./ImageInput";
const EditFilm = (film: Film | undefined, reviews: Array<Review>, genres: Array<FilmGenre>, token: string, userId:string) => {
    const today = new Date().toISOString().split('T')[0];
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [releaseDate, setReleaseDate] = React.useState('');
    const [genreId, setGenreId] = React.useState('');
    const [runtime, setRuntime] = React.useState('');
    const [ageRating, setAgeRating] = React.useState('');
    const [image, setImage] = React.useState<File | null>(null);
    const [errorMessage, setErrorMessage] = React.useState("");

    const updateFilm = () => {
        const data: EditFilm = {}
        if (title !== '') {data.title = title}
        if (description !== '') {data.description = description}
        if (genreId !== '') {data.genreId = Number(genreId)}
        if (releaseDate !== '') {data.releaseDate = releaseDate + ' 00:00:00'}
        if (runtime !== '') {data.runtime = Number(runtime)}
        if (ageRating !== '') {data.ageRating = ageRating}
        console.log(3)
        const config = {
            method: 'patch',
            url: `http://localhost:4941/api/v1/films/${film?.filmId}`,
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            },
            data : data
        };

        axios(config)
            .then(function (response) {
                if (image !== null) {
                    updateFilmImage()
                } else {
                    window.location.reload()
                }
            })
            .catch(function (error) {
                setErrorMessage("Film title already in use")
            });
    }

    const updateFilmImage = () => {
        const config = {
            method: 'put',
            url: `http://localhost:4941/api/v1/films/${film?.filmId}/image`,
            headers: {
                'X-Authorization': token,
                'Content-Type': image?.type
            },
            data : image
        };

        axios(config)
            .then(function (response) {
                window.location.reload()
            })
            .catch(function (error) {
                console.log(error);
            });

    }


    const clearFormInput = () => {
        setTitle('')
        setDescription('')
        setRuntime('')
        setImage(null)
        setReleaseDate('')
        const genre = document.getElementById('editFilmGenreIdSelect') as HTMLSelectElement
        genre.value = ''
        const ageRating = document.getElementById('editFilmAgeRatingSelect') as HTMLSelectElement
        ageRating.value = ''
        const imageSelected = document.getElementById('imageSelect') as HTMLInputElement
        imageSelected.value = ''
    }

    const handleImageSelect = (file: File) => {
        setImage(file);
    };

    const handleSubmitFilm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        updateFilm()
    }

    const displayErrorMessage = () => {
        if (errorMessage !== '') {
            return (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div> )
        }
    }

    const displayGenreSelect = () => {
        return genres.map((genre) =>
            <option key={genre.name+'Select'} value={genre.genreId.toString()}>{genre.name}</option>
        )
    }

    if (film?.releaseDate !== undefined && film.directorId === Number(userId)) {
        const filmRelease = new Date(film?.releaseDate)
        const todaysDate = new Date(today)
        if (filmRelease < todaysDate || reviews.length !== 0) {
            return <></>
        } else {
            return (
                <div>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#EditFilmModal" onClick={clearFormInput}>
                        Edit Film
                    </button>

                    <div className="modal fade" id="EditFilmModal" tabIndex={-1} role="dialog" aria-labelledby="EditFilmModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Modal title</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {displayErrorMessage()}
                                    <form onSubmit={handleSubmitFilm}>
                                        <div className="form-group">
                                            <label htmlFor="title">Title</label>
                                            <input type="text" name="title" id="title" value={title} maxLength={64}
                                                   onChange={(event)=>setTitle(event.target.value)} className="form-control"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description">Description</label>
                                            <textarea name="description" id="description" value={description} maxLength={512}
                                                      onChange={(event)=>setDescription(event.target.value)} className="form-control"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="genreId">Genre</label>
                                            <select className="form-control" id="editFilmGenreIdSelect" onChange={(event)=>setGenreId(event.target.value)}>
                                                <option key="unselectedGenre" value=''>Select</option>
                                                {displayGenreSelect()}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="releaseDate">Release Date</label>
                                            <input type="date" name="releaseDate" id="releaseDate" value={releaseDate} min={today}
                                                   onChange={(event)=>setReleaseDate(event.target.value)} className="form-control"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="runtime">Runtime</label>
                                            <input type="number" name="runtime" id="runtime" value={runtime} max={300}
                                                   onChange={(event)=>setRuntime(event.target.value)} className="form-control"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="ageRating">Age Rating</label>
                                            <select className="form-control" id="editFilmAgeRatingSelect" onChange={(event)=>setAgeRating(event.target.value)}>
                                                <option key="unselectedAgeRating" value=''>Select</option>
                                                <option value="G">G</option>
                                                <option value="PG">PG</option>
                                                <option value="M">M</option>
                                                <option value="R13">R13</option>
                                                <option value="R16">R16</option>
                                                <option value="R18">R18</option>
                                                <option value="TBC">TBC</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <p>Set a Hero Image</p>
                                            <ImageInput onImageSelect={handleImageSelect}  required={false} />
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-secondary mr-2" data-dismiss="modal">Close</button>
                                            <button id="EditDetailsSaveButton" type="submit" className="btn btn-primary">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
};

export default EditFilm;
