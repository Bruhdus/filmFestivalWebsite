import axios from 'axios';
import React from "react";
import {Link} from "react-router-dom";

const Films = () => {
    const [films, setFilms] = React.useState<Array<Film>>([])
    const [numFilms, setNumFilms] = React.useState(0)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [genres, setGenres] = React.useState<Array<FilmGenre>>([])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [genreQueryList, setGenreQueryList] = React.useState<Array<String>>([])
    const [ageRatingQueryList, setAgeRatingQueryList] = React.useState<Array<String>>([])
    const [sortByQuery, setSortByQuery] = React.useState('RELEASED_ASC')
    const [prevQuery , setPrevQuery] = React.useState('')
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const ageRatings = ["G", "PG", "M", "R13", "R16", "R18", "TBC"]
    const sortBys = [["RELEASED_ASC", "Chronologically by release date"],
        ["RELEASED_DESC", " Reverse Chronologically by release date"],
        ["ALPHABETICAL_ASC", "Ascending alphabetically"],
        ["ALPHABETICAL_DESC", "Descending alphabetically"],
        ["RATING_ASC", "Ascending by rating"],
        ["RATING_DESC", "Descending by rating"]]

    React.useEffect(() => {
        getFilmGenres()
        getFilms(1)
    }, [])

    const getFilmGenres = () => {
        axios.get('http://localhost:4941/api/v1/films/genres')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setGenres(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getFilms = (newPage: number) => {
        let finalQuery = "";
        setCurrentPage(newPage)
        const maxPage = Math.ceil(numFilms / 10)
        let startIndex = (newPage - 1) * 10;

        if (newPage < 1) {
            startIndex = 0;
            setCurrentPage(1)
        } else if (newPage > maxPage) {
            startIndex = (maxPage-1)*10;
            setCurrentPage(maxPage)
        }

        if (searchQuery.length !== 0) {
            finalQuery += "q=" + searchQuery;
        }

        if (genreQueryList.length !== 0) {
            if (finalQuery.length !== 0){finalQuery+="&"}
            finalQuery = "genreIds="+genreQueryList.join("&genreIds=")
        }

        if (ageRatingQueryList.length !== 0) {
            if (finalQuery.length !== 0){finalQuery+="&"}
            finalQuery += "ageRatings="+ageRatingQueryList.join("&ageRatings=")
        }

        if (sortByQuery.length !== 0) {
            if (finalQuery.length !== 0){finalQuery+="&"}
            finalQuery += "sortBy=" + sortByQuery
        }

        if(prevQuery !== finalQuery) {
            setCurrentPage(1)
            startIndex = 0;
        }
        setPrevQuery(finalQuery)

        axios.get(`http://localhost:4941/api/v1/films?count=10&startIndex=${startIndex}&${finalQuery}`)
            .then((response) => {
                response.data.films.map((film:Film) => {
                    const date = new Date(film.releaseDate)
                    film.releaseDate = date.toLocaleString()
                })
                setErrorFlag(false)
                setErrorMessage("")
                setFilms(response.data.films)
                setNumFilms(response.data.count)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const updateGenreQueryList = (genreId: string) => {
        if (genreQueryList.includes(genreId)) {
            const index = genreQueryList.indexOf(genreId)
            genreQueryList.splice(index, 1)
        } else {
            genreQueryList.push(genreId)
        }
    }
    const updateAgeRatingQueryList = (ageRating: string) => {
        if (ageRatingQueryList.includes(ageRating)) {
            const index = ageRatingQueryList.indexOf(ageRating)
            ageRatingQueryList.splice(index, 1)
        } else {
            ageRatingQueryList.push(ageRating)
        }
    }

    const onImageError = (id: any) => {
        const element = document.getElementById(id) as HTMLImageElement
        if (!element) return
        element.src = "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg"
    }

    const listOfFilms = () => {
        return films.map((film: Film) =>
            <div className="row align-items-center bg-light shadow-lg p-3 mb-3" key={film.title}>
                <div className="col-md-2 text-center">
                    <Link to={`/films/${film.filmId}`}>
                        <img src={`http://localhost:4941/api/v1/films/${film.filmId}/image`} className="rounded" alt="image" height="100" width="100"/>
                    </Link>
                </div>
                <div className="col-md-6">
                    <h5 className="mb-0"><Link to={`/films/${film.filmId}`} className="text-dark">{film.title}</Link></h5>
                    <p className="small text-muted mb-0">{film.ageRating} | {film.releaseDate.substring(0, 10)} {film.releaseDate.substring(12,20)}</p>
                    <p className="small mb-0"><strong>{genres.find((genre) => genre.genreId === film.genreId)?.name || "Unknown"}</strong></p>
                </div>
                <div className="col-md-4">
                    <img id={film.filmId+film.directorFirstName} src={`http://localhost:4941/api/v1/users/${film.directorId}/image`}  onError={(e: any) => onImageError((film.filmId+film.directorFirstName).toString())}
                         className="rounded-circle" alt="image" height="50" width="50"/>
                    <p className="small mb-0">Director: <strong>{film.directorFirstName} {film.directorLastName}</strong></p>
                    <p className="small mb-0">Rating: <strong>{film.rating}</strong></p>
                </div>
            </div>
        )
    }

    const listOfGenresDropDown = () => {
        return genres.map((genre:FilmGenre) =>
            <div className="form-check" key={genre.name}>
                <label className="form-check-label"><input type="checkbox" onClick={() => updateGenreQueryList(genre.genreId.toString())}/> {genre.name}</label>
            </div>
        )
    }
    const listOfAgeRatingDropDown = () => {
        return ageRatings.map((ageRating) =>
            <div className="form-check" key={`ageRating${ageRating}`}>
                <label className="form-check-label"><input type="checkbox" onClick={() => updateAgeRatingQueryList(ageRating)}/> {ageRating}</label>
            </div>
        )
    }

    const listOfSortBySelect = () => {
        return sortBys.map((sortBy) =>
            <option value={sortBy.at(0)} key={sortBy.at(0) + "Option"}>
                {sortBy.at(1)}
            </option>
        )
    }

    const createPagination = () => {
        const maxPages = Math.ceil(numFilms / 10);
        const paginationLinks = [];
        for (let page = 1; page <= maxPages; page++) {
            paginationLinks.push(
                <li className={`page-item ${currentPage === page ? 'active' : ''}`} key={page+"PageLink"}>
                    <a className="page-link" onClick={() => getFilms(page)}>
                        {page}
                    </a>
                </li>
            );
        }
        return paginationLinks;
    };


    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div>
                <ul className="nav nav-pills justify-content-end">
                    <li key="sortByDropDown" className="nav-item">
                        <div className="form-group form-inline mb-0">
                            <label htmlFor="sortBySelectForm" className="mr-2">Sort By </label>
                            <select className="form-control" id="sortBySelectForm" onChange={(event)=>setSortByQuery(event.target.value)} onClick={()=>getFilms(currentPage)}>
                                {listOfSortBySelect()}
                            </select>
                        </div>
                    </li>
                    <li className="nav-item dropdown" key="genresDropDown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">Genres</a>
                        <div className="dropdown-menu">
                            {listOfGenresDropDown()}
                        </div>
                    </li>
                    <li className="nav-item dropdown" key="ageRatingDropDown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">Age Ratings</a>
                        <div className="dropdown-menu keep-open">
                            {listOfAgeRatingDropDown()}
                        </div>
                    </li>
                    <li className="nav-item ml-2" key="searchQueryItem">
                        <div className="input-group">
                            <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="form-control" placeholder="Search" />
                            <div className="input-group-append">
                                <button type="button" className="btn btn-outline-primary" onClick={()=>getFilms(currentPage)}>Go</button>
                            </div>
                        </div>
                    </li>
                </ul>

                <div className="mt-3">
                    {listOfFilms()}
                </div>

                <nav>
                    <ul className="pagination justify-content-center mt-3">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} key="previousPageLink">
                            <a className="page-link" onClick={()=>getFilms(currentPage-1)}>Previous</a>
                        </li>
                        {createPagination()}
                        <li className={`page-item ${currentPage === Math.ceil(numFilms / 10)? 'disabled' : ''}`} key="nextPageLink">
                            <a className="page-link" onClick={()=>getFilms(currentPage+1)}>Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

    )
}

export default Films;