import './Movies.css';
import SearchForm from '../SearchForm/SearchForm';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Navigation from "../Navigation/Navigation";
import Burger from "../Burger/Burger";
import Preloader from "../Preloader/Preloader";
import {useEffect} from "react";
import React from 'react';

function Movies(
  {
    menuState,
    findFilms,
    movies,
    isLoading,
    moveFilterToShow,
    filteredMovies,
    isFetchingError,
    once,
    createMovie,
    deleteMovie,
    savedMovies,
    filterForNoSaved,
    searchString,
    shortFilm
  }) {

  useEffect(() => {
    filterForNoSaved();
  }, [])


  return (
    <>
      <Header>
        <Burger menuState={menuState}/>
        <Navigation menuState={menuState}/>
      </Header>

      <main className="content">
        <SearchForm findFilms={findFilms} searchString={searchString} shortFilm={shortFilm}/>
        {isLoading && <Preloader/>}
        {isFetchingError
          ? <>
            <p>Во время запроса произошла ошибка.</p>
            <p>Возможно, проблема с соединением или сервер недоступен.</p>
            <p>Подождите немного и попробуйте ещё раз</p>
          </>
          : movies.length > 0
            ? <MoviesCardList
              movies={movies}
              createMovie={createMovie}
              deleteMovie={deleteMovie}
              savedMovies={savedMovies}
            />
            : once ? '' : <h2 className='movies__error'>Ничего не найдено!</h2>
            // : once ? <Preloader/> : !isFetching && <h2>Ничего не найдено!</h2>
        }

        {filteredMovies.length > 0 &&
        <button
          onClick={moveFilterToShow}
          className='movies__more-btn'
        >
          Ещё
        </button>
        }
        
      </main>

      <Footer/>
    </>
  );
}

export default Movies;

