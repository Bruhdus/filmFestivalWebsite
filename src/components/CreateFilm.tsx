import axios from 'axios';
import React, {FormEvent} from "react";
import ImageInput from "./ImageInput";
import {useUserInfoStorage} from "../store";
import {useNavigate} from "react-router-dom";
const CreateFilm = () => {
    const navigate = useNavigate();
    const userId = useUserInfoStorage(state => state.userId);
    const token = useUserInfoStorage(state => state.token);
    const today = new Date().toISOString();
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [releaseDate, setReleaseDate] = React.useState('');
    const [genreId, setGenreId] = React.useState('');
    const [runtime, setRuntime] = React.useState('');
    const [ageRating, setAgeRating] = React.useState('');
    const [image, setImage] = React.useState<File | null>(null);
    const [errorMessage, setErrorMessage] = React.useState("")
    const [genres, setGenres] = React.useState<Array<FilmGenre>>([])
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false)

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
        getFilmGenres()
    }, [])

    const getFilmGenres = () => {
        axios.get('http://localhost:4941/api/v1/films/genres')
            .then((response) => {
                setGenres(response.data)
            }, (error) => {
                setErrorMessage(error.toString())
            })
    }

    const handleImageSelect = (file: File) => {
        setImage(file);
    };

    const handleSubmitFilm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        createFilm()
    }
    const createFilm = () => {
        const data: PostFilm = {
            title: title,
            description: description,
            genreId: Number(genreId),
        }

        if (releaseDate !== '') {
            const date = releaseDate.split("T")
            data.releaseDate = date[0] + ' ' + date[1]+':00'
        }
        if (runtime !== '') {
            data.runtime = Number(runtime)
        }
        if (ageRating !== '') {
            data.ageRating = ageRating
        }

        console.log(data)

        const config = {
            method: 'post',
            url: 'http://localhost:4941/api/v1/films',
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            },
            data : data
        };

        axios(config)
            .then(function (response) {
                uploadImageToNewFilm(response.data.filmId)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const uploadImageToNewFilm = (filmId:number) => {
        const config = {
            method: 'put',
            url: `http://localhost:4941/api/v1/films/${filmId}/image`,
            headers: {
                'Content-Type': image?.type,
                'X-Authorization': token
            },
            data : image
        };

        axios(config)
            .then(function (response) {
                navigate(`/films/${filmId}`)
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

    const displaySuccessMessage = () => {
        if (showSuccessMessage) {
            return (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> Film Created Yay!
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>)
        }
    }

    const displayGenreSelect = () => {
        return genres.map((genre) =>
            <option key={genre.name+'Select'} value={genre.genreId.toString()}>{genre.name}</option>
        )
    }


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg">
                        {displaySuccessMessage()}
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Create a New Film</h3>
                            <form onSubmit={handleSubmitFilm}>
                                <div className="form-group">
                                    <label htmlFor="title">Title*</label>
                                    <input type="text" name="title" id="title" value={title} maxLength={64} required={true}
                                           onChange={(event)=>setTitle(event.target.value)} className="form-control"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description*</label>
                                    <textarea name="description" id="description" value={description} maxLength={512} required={true}
                                        onChange={(event)=>setDescription(event.target.value)} className="form-control"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="genreId">Genre*</label>
                                    <select className="form-control" id="newFilmGenreIdSelect" onChange={(event)=>setGenreId(event.target.value)} required={true}>
                                        <option key="unselectedGenre" value=''>Select</option>
                                        {displayGenreSelect()}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="releaseDate">Release Date</label>
                                    <input type="datetime-local" name="releaseDate" id="releaseDate" value={releaseDate} min={today.substring(0, 10) + "T" + today.substring(11, 16)}
                                        onChange={(event)=>setReleaseDate(event.target.value)} className="form-control"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="runtime">Runtime</label>
                                    <input type="number" name="runtime" id="runtime" value={runtime} max={300}
                                        onChange={(event)=>setRuntime(event.target.value)} className="form-control"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="ageRating">Age Rating</label>
                                    <select className="form-control" id="newFilmAgeRatingSelect" onChange={(event)=>setAgeRating(event.target.value)}>
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
                                    <p>Set a Hero Image*</p>
                                    <ImageInput onImageSelect={handleImageSelect}  required={true} />
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
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

export default CreateFilm;