import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Films from "./components/Films";
import Film from "./components/Film"
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import MyFilms from "./components/MyFilms";
import CreateFilm from "./components/CreateFilm";
import Profile from "./components/Profile";

function App() {
    return (
        <div className="App">
            <NavBar/>
            <Router>
                <div>
                    <Routes>
                        <Route path="/films" element={<Films/>}/>
                        <Route path="" element={<Films/>}/>
                        <Route path="/films/:id" element = {<Film/>}/>
                        <Route path="/users/register" element={<Register/>}/>
                        <Route path="/users/login" element={<Login/>}/>
                        <Route path="/myfilms" element={<MyFilms/>}/>
                        <Route path="/createfilm" element={<CreateFilm/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
