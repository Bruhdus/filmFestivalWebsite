import axios from 'axios';
import React from "react";
import {Link, useParams } from "react-router-dom";
import {useUserInfoStorage} from "../store";
import EditFilm from "./EditFilm";
import DeleteFilm from "./DeleteFilm";
const Film = () => {
    const {id} = useParams();
    const userId = useUserInfoStorage(state => state.userId);
    const token = useUserInfoStorage(state => state.token);
    const today = new Date().toISOString();
    const [film, setFilm] = React.useState<Film>()
    const [reviews, setReviews] = React.useState<Array<Review>>([])
    const [genres, setGenres] = React.useState<Array<FilmGenre>>([])
    const [similarFilmsByDir, setSimilarFilmsByDir] = React.useState<Array<Film>>([])
    const [similarFilmsByGen, setSimilarFilmsByGen] = React.useState<Array<Film>>([])
    const [newReviewText, setNewReviewText] = React.useState("")
    const [newReviewRating, setNewReviewRating] = React.useState("")
    const [errorMessage, setErrorMessage] = React.useState("")
    const [loggedIn, setLoggedIn] = React.useState(false)

    React.useEffect(() => {
        getFilm()
        getReviews()
        getFilmGenres()
    }, [id])

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

    const getFilm = () => {
        axios.get('http://localhost:4941/api/v1/films/'+id)
            .then((response) => {
                const date = new Date(response.data.releaseDate)
                response.data.releaseDate = date.toLocaleString()
                setFilm(response.data)
                setErrorMessage("")
                setSimilarFilmsByDir([])
                setSimilarFilmsByGen([])
                getSimilarFilmsByGen(response.data.genreId)
                getSimilarFilmsByDir(response.data.directorId)
                return response.data
            }, (error) => {
                setErrorMessage(error.toString())
            })
    }


    const getReviews = () => {
        axios.get('http://localhost:4941/api/v1/films/'+id+'/reviews')
            .then((response) => {
                setErrorMessage("")
                setReviews(response.data)
            }, (error) => {
                setErrorMessage(error.toString())
            })
    }

    const getSimilarFilmsByGen = (genreId:number) => {
        axios.get(`http://localhost:4941/api/v1/films?genreIds=${genreId}`)
            .then((response) => {
                response.data.films.map((film:Film) => {
                    const date = new Date(film.releaseDate)
                    film.releaseDate = date.toLocaleString()
                })
                setErrorMessage("")
                setSimilarFilmsByGen(response.data.films)
            }, (error) => {
                setErrorMessage(error.toString())
            })
    }

    const getSimilarFilmsByDir = (dirId:number) => {
        axios.get(`http://localhost:4941/api/v1/films?directorId=${dirId}`)
            .then((response) => {
                response.data.films.map((film:Film) => {
                    const date = new Date(film.releaseDate)
                    film.releaseDate = date.toLocaleString()
                })
                setErrorMessage("")
                setSimilarFilmsByDir(response.data.films)
            }, (error) => {
                setErrorMessage(error.toString())
            })
    }

    const getFilmGenres = () => {
        axios.get('http://localhost:4941/api/v1/films/genres')
            .then((response) => {
                setErrorMessage("")
                setGenres(response.data)
            }, (error) => {
                setErrorMessage(error.toString())
            })
    }

    const postReview = () => {
        const data: PostReview = {rating: Number(newReviewRating)}

        if (newReviewText !== '') {data.review = newReviewText}

        const config = {
            method: 'post',
            url: `http://localhost:4941/api/v1/films/${id}/reviews`,
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            },
            data : data
        };

        axios(config)
            .then(function (response) {
                getReviews()
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const onImageError = (id: any) => {
        const element = document.getElementById(id) as HTMLImageElement
        if (!element) return
        element.src = "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg"
    }

    const handleSubmitReview = () => {
        postReview()
    }


    const listOfReviews = () => {
        if (reviews.length === 0) {
            return (
                <p>No reviews</p>
            )
        }
        return reviews.map((review) =>
            <div key={review.reviewerId + review.timestamp} className="card mb-3 alert-warning">
                <div className="card-body d-flex align-items-center justify-content-center">
                    <img
                        id={review.reviewerId.toString()}
                        src={`http://localhost:4941/api/v1/users/${review.reviewerId}/image`}
                        onError={(e: any) => onImageError(review.reviewerId.toString())}
                        className="rounded-circle mr-3"
                        alt="Sorry"
                        height="50"
                        width="50"
                    />
                    <div>
                        <h5 className="card-title mb-1">
                            {review.reviewerFirstName} {review.reviewerLastName}
                        </h5>
                        <div className="d-flex">
                            <p className="card-text mb-0 mr-2">
                                <strong>Rating:</strong> {review.rating}/10
                            </p>
                            <p className="card-text mb-0">{review.review}</p>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    const displayAddReview = () => {
        if (token === '') {return (<></>)}
        if (reviews.map((review) => review.reviewerId === Number(userId)).includes(true)) {return (<></>)}
        if (film?.directorId === Number(userId)) {return (<></>)}
        if (film?.releaseDate === undefined || film?.releaseDate > today) {return (<></>)}
        if (!loggedIn) {return (<></>)}
        return (
            <>
                <br/>
                <div className="p-4 shadow-lg">
                    <h3>Leave a review</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div className="form-group">
                            <label htmlFor="ageRating">Rating</label>
                            <select className="form-control" id="newFilmAgeRatingSelect" onChange={(event)=>setNewReviewRating(event.target.value)}>
                                <option value='1'>1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Description</label>
                            <textarea value={newReviewText} maxLength={512}
                                   onChange={(event)=>setNewReviewText(event.target.value)} className="form-control"/>
                        </div>

                        <button type="submit" className="btn btn-primary">Add Review</button>
                    </form>
                </div>
            </>
        )
    }

    const listOfSimilarFilms = () => {
        let similarFilms: Array<Film> = similarFilmsByDir.concat(similarFilmsByGen)
        const uniqueIds: number[] = [];
        const result = similarFilms.filter(film => {
            const isDup = uniqueIds.includes(film.filmId);
            if (!isDup && film.filmId.toString() !== id) {
                uniqueIds.push(film.filmId);
                return true
            }
            return false
        })

        if (result.length === 0) {
            return (
                <p>Empty</p>
            )
        }

        return result.map((similarFilm: Film) =>
            <div className="row align-items-center bg-light shadow-lg p-3 mb-3" key={similarFilm.title}>
                <div className="col-md-2 text-center">
                    <Link to={`/films/${similarFilm.filmId}`}>
                        <img src={`http://localhost:4941/api/v1/films/${similarFilm.filmId}/image`} className="rounded"
                             alt="Sorry" height="100"/>
                    </Link>
                </div>
                <div className="col-md-6">
                    <h5 className="mb-0"><Link to={`/films/${similarFilm.filmId}`}
                                               className="text-dark">{similarFilm.title}</Link></h5>
                    <p className="small text-muted mb-0">{similarFilm.ageRating} | {similarFilm.releaseDate.substring(0, 10)} {similarFilm.releaseDate.substring(12,20)}</p>
                    <p className="small mb-0">
                        <strong>{genres.find((genre) => genre.genreId === similarFilm.genreId)?.name || "Unknown"}</strong>
                    </p>
                </div>
                <div className="col-md-4">
                    <img id={similarFilm.filmId+similarFilm.directorFirstName} src={`http://localhost:4941/api/v1/users/${similarFilm.directorId}/image`}  onError={(e: any) => onImageError((similarFilm.filmId+similarFilm.directorFirstName).toString())}
                         className="rounded-circle" alt="Sorry" height="50" width="50"/>
                    <p className="small mb-0">Director: <strong>{similarFilm.directorFirstName} {similarFilm.directorLastName}</strong></p>
                    <p className="small mb-0">Rating: <strong>{similarFilm.rating}</strong></p>
                </div>
            </div>
        )
    }


    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg">
                        <div className="card-header bg-secondary text-white">
                            <h3 className="mb-0">{film?.title}</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <img src={`http://localhost:4941/api/v1/films/${id}/image`} className="img-fluid rounded shadow-lg" alt="film poster"/>
                                </div>
                                <div className="col-md-8">
                                    <p className="lead">{film?.description}</p>
                                    <hr className="my-4"/>
                                    <img id="CurrentFilmDirectorProfile" src={`http://localhost:4941/api/v1/users/${film?.directorId}/image`}  onError={(e: any) => onImageError("CurrentFilmDirectorProfile")}
                                         className="rounded-circle" alt="Sorry" height="50" width="50"/>
                                    <p><strong>Director:</strong> {film?.directorFirstName} {film?.directorLastName}</p>
                                    <p><strong>Release date:</strong> {film?.releaseDate.substring(0, 10)} {film?.releaseDate.substring(12,20)}</p>
                                    <p><strong>Age rating:</strong> {film?.ageRating}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer container">
                            <div className="row">
                                <div className="col-sm-6">
                                    {EditFilm(film, reviews, genres, token, userId)}
                                </div>
                                <div className="col-sm-6">
                                    {DeleteFilm(film, token, userId)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="p-4 shadow-lg">
                        <h3>Reviews</h3>
                        {listOfReviews()}
                    </div>
                    {displayAddReview()}
                    <br/>
                    <div className="p-4 shadow-lg">
                        <h3>Similar Films</h3>
                        {listOfSimilarFilms()}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Film;