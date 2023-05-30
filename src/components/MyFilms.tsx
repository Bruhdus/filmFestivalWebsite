import axios from 'axios';
import React from "react";
import {useUserInfoStorage} from "../store";
import {Link, useNavigate} from "react-router-dom";
const MyFilms = () => {
    const navigate = useNavigate()
    const [myFilms, setMyFilms] = React.useState<Array<Film>>([])
    const [reviewedFilms, setReviewedFilms] = React.useState<Array<Film>>([])
    const [genres, setGenres] = React.useState<Array<FilmGenre>>([])
    const [errorMessage, setErrorMessage] = React.useState("")
    const userId = useUserInfoStorage(state => state.userId);
    const token = useUserInfoStorage(state => state.token);

    React.useEffect(() => {
        if (token === "") {
            navigate('/films')
        }
    }, [token])

    React.useEffect(() => {
        getFilmGenres()
        getMyFilms()
        getReviewedFilms()
    }, [])

    const getFilmGenres = () => {
        axios.get('http://localhost:4941/api/v1/films/genres')
            .then((response) => {
                setErrorMessage("")
                setGenres(response.data)
            }, (error) => {
                setErrorMessage(error.toString())
            })
    }

    const getMyFilms = () => {
        axios.get(`http://localhost:4941/api/v1/films?directorId=${userId}`)
            .then((response) => {
                response.data.films.map((film:Film) => {
                    const date = new Date(film.releaseDate)
                    film.releaseDate = date.toLocaleString()
                })
                setErrorMessage("")
                setMyFilms(response.data.films)
            }, (error) => {
                setErrorMessage(error.toString())
            })
    }

    const getReviewedFilms = () => {
        axios.get(`http://localhost:4941/api/v1/films?reviewerId=${userId}`)
            .then((response) => {
                response.data.films.map((film:Film) => {
                    const date = new Date(film.releaseDate)
                    film.releaseDate = date.toLocaleString()
                })
                setErrorMessage("")
                setReviewedFilms(response.data.films)
            }, (error) => {
                setErrorMessage(error.toString())
            })
    }

    const onImageError = (id: any) => {
        const element = document.getElementById(id) as HTMLImageElement
        if (!element) return
        element.src = "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg"
    }

    const displayMyFilms = () => {
        if (myFilms.length === 0) {
            return <p>Empty</p>
        }
        return myFilms.map((film: Film) =>
            <div className="row align-items-center shadow-lg bg-light p-3 pr-5 mb-3 container-fluid" key={film.title}>
                <div className="col-md-3 text-center">
                    <Link to={`/films/${film.filmId}`}>
                        <img src={`http://localhost:4941/api/v1/films/${film.filmId}/image`} className="rounded" alt="Sorry" height="100" width="100"/>
                    </Link>
                </div>
                <div className="col-md-7">
                    <h5 className="mb-0"><Link to={`/films/${film.filmId}`} className="text-dark">{film.title}</Link></h5>
                    <p className="small text-muted mb-0">{film.ageRating} | {film.releaseDate.substring(0, 10)} {film.releaseDate.substring(12,20)}</p>
                    <p className="small mb-0"><strong>{genres.find((genre) => genre.genreId === film.genreId)?.name || "Unknown"}</strong></p>
                </div>
                <div className="col-md-2">
                    <img id={film.filmId+film.directorFirstName} src={`http://localhost:4941/api/v1/users/${film.directorId}/image`}  onError={(e: any) => onImageError((film.filmId+film.directorFirstName).toString())}
                         className="rounded-circle" alt="Sorry" height="50" width="50"/>
                    <p className="small mb-0">Director:&nbsp;<strong>{film.directorFirstName}&nbsp;{film.directorLastName}</strong></p>
                    <p className="small mb-0">Rating:&nbsp;<strong>{film.rating}</strong></p>
                </div>
            </div>
        )
    }

    const displayReviewedFilms = () => {
        if (reviewedFilms.length === 0) {
            return <p>Empty</p>
        }
        return reviewedFilms.map((film: Film) =>
            <div className="row align-items-center shadow-lg bg-light p-3 mb-3 pr-5 container-fluid" key={film.title}>
                <div className="col-md-3 text-center">
                    <Link to={`/films/${film.filmId}`}>
                        <img src={`http://localhost:4941/api/v1/films/${film.filmId}/image`} className="rounded" alt="Sorry" height="100" width="100"/>
                    </Link>
                </div>
                <div className="col-md-7">
                    <h5 className="mb-0"><Link to={`/films/${film.filmId}`} className="text-dark">{film.title}</Link></h5>
                    <p className="small text-muted mb-0">{film.ageRating} | {film.releaseDate.substring(0, 10)} {film.releaseDate.substring(12,20)}</p>
                    <p className="small mb-0"><strong>{genres.find((genre) => genre.genreId === film.genreId)?.name || "Unknown"}</strong></p>
                </div>
                <div className="col-md-2">
                    <img id={film.filmId+film.directorFirstName} src={`http://localhost:4941/api/v1/users/${film.directorId}/image`}  onError={(e: any) => onImageError((film.filmId+film.directorFirstName).toString())}
                         className="rounded-circle" alt="Sorry" height="50" width="50"/>
                    <p className="small mb-0">Director:&nbsp;<strong>{film.directorFirstName}&nbsp;{film.directorLastName}</strong></p>
                    <p className="small mb-0">Rating:&nbsp;<strong>{film.rating}</strong></p>
                </div>
            </div>
        )
    }


    return (
        <div className="container justify-content-center align-items-center">
            <div className="pb-5">
                <br/>
                <h2><strong>My Films</strong></h2>
                {displayMyFilms()}
                <br/>
                <h3><strong>Reviewed Films</strong></h3>
                {displayReviewedFilms()}
            </div>
        </div>
    )
}

export default MyFilms;