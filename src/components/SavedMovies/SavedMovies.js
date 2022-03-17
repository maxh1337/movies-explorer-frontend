import SearchForm from '../SearchForm/SearchForm';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Navigation from "../Navigation/Navigation";
import Burger from "../Burger/Burger";
import Preloader from "../Preloader/Preloader";
import {useEffect} from "react";
import React from 'react';

function SavedMovies({menuState, movies, createMovie, deleteMovie, moveFilterToShow, savedMovies, findFilms, filterForSaved, isLoading}) {

  useEffect(() => {
    filterForSaved()
  }, [])

  const [ mountCount, setMountcount ] = React.useState(12);

  window.addEventListener("resize", () => {
    setTimeout(() => {
      if (window.innerWidth >= 1024) {
        setMountcount(12);
      } else if (window.innerWidth >= 480) {
        setMountcount(8);
      } else if (window.innerWidth < 480) {
        setMountcount(5);
      }
    }, 5000)
  });

  const count = () => {
    if (window.innerWidth >= 1023) {
      setMountcount(mountCount + 3);
    } else if (window.innerWidth < 1023) {
      setMountcount(mountCount + 2);
    }
  };

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
              count={mountCount}
              movies={movies}
              createMovie={createMovie}
              deleteMovie={deleteMovie}
              savedMovies={savedMovies}
            />
            : <h2 className='movies__error'>Ничего не найдено!</h2>
        }
        {(mountCount < movies.length) && <button className="movies__more-btn" onClick={count}>Ещё</button>}
      </main>

      <Footer/>
    </>
  );
}

export default SavedMovies;
