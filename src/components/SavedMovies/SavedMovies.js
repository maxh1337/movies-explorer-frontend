import SearchForm from '../SearchForm/SearchForm';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Navigation from "../Navigation/Navigation";
import Burger from "../Burger/Burger";
import Preloader from "../Preloader/Preloader";
import {useEffect} from "react";
import React from 'react';
import mainApi from "../../utils/MainApi";

function SavedMovies({menuState, movies, createMovie, deleteMovie, isLoading, moveFilterToShow, savedMovies, findFilms, filterForSaved, setSavedMovies}) {


  useEffect(() => {
    filterForSaved()
  }, [])

  useEffect(() => {
    mainApi
      .getSavedMovies()
      .then(({data}) => setSavedMovies(data))
      .catch(err => console.log(err))
  }, [])

return (
    <>
      <Header>
        <Burger menuState={menuState}/>
        <Navigation menuState={menuState}/>
      </Header>

      <main className="content">
        <SearchForm findFilms={findFilms}/>
        {isLoading && (<Preloader />)}
        {movies.length > 0
            ? <MoviesCardList
              movies={movies}
              createMovie={createMovie}
              deleteMovie={deleteMovie}
              savedMovies={savedMovies}
            />
            : <h2 className='movies__error'>Ничего не найдено!</h2>
        }
        {savedMovies.length > 0 && <button className="movies__more-btn" onClick={moveFilterToShow}>Ещё</button>}
      </main>

      <Footer/>
    </>
  );
}

export default SavedMovies;
