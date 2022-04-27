import {useEffect, useState} from "react";
import {Route, Switch, useHistory} from "react-router-dom";
import './App.css';
import Main from "../Main/Main";
import Movies from "../Movies/Movies";
import SavedMovies from "../SavedMovies/SavedMovies";
import Profile from "../Profile/Profile";
import Register from "../Register/Register";
import Login from "../Login/Login";
import {CurrentUserContext} from '../../contexts/CurrentUserContext';
import mainApi from "../../utils/MainApi";
import Modal from "../Modal/Modal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import {useLocalStorage} from "../../utils/local-storage";
import {LOCAL_STORAGE_KEY_FILTER, LOCAL_STORAGE_KEY_MOVIES, modal} from "../../utils/constants";
import moviesApi from "../../utils/MoviesApi";
import {calcCardsInRow, isShortFilm} from "../../utils/utils";
import PageNotFound from "../PageNotFound/PageNotFound";
import { Redirect } from 'react-router-dom';
import React from "react";

function App() {
  const history = useHistory();

  const [savedMovies, setSavedMovies] = useState([]);
  const [allMovies, setAllMovies] = useLocalStorage(LOCAL_STORAGE_KEY_MOVIES, []);
  const [filterLocalStorage, setFilterLocalStorage] = useLocalStorage(LOCAL_STORAGE_KEY_FILTER, {});
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [toShowMovies, setToShowMovies] = useState([]);
  const [cardsInRow, setCardsInRow] = useState(3);
  const [savedSearchedMovies, setSavedSearchedMovies] = useState([]);

  const menuState = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [isFetchingFromForm, setIsFetchingFromForm] = useState(false);
  const [isFetchingError, setIsFetchingError] = useState(false);
  const [once, setOnce] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isLoading, setLoading] = React.useState(false);
  const [nope, setNope] = React.useState(false)
  const [filter, setFilter] = useState({
    name: '',
    shortFilm: false,
    saved: false
  });
  
  const [filterNoSaved, setFilterNoSaved] = useState({
    name: '',
    shortFilm: false,
    saved: false
  })

  useEffect(()=> {
    if (allMovies.length === 0) {
      moviesApi.getMovies()
      .then(data => {
        setAllMovies(data);
      })
      .catch(err => {
        console.log(err);
        setIsFetchingError(true);
      })
      .finally(() => {
        setLoading(false)
      })
    }
  },[])
  
  useEffect(() => {
    mainApi
      .getUserInfo()
      .then(({data}) => {
        setCurrentUser(data);
        setLoggedIn(true);
        // setFilter(filterLocalStorage[data._id]);
      })
      
      .catch(({message}) => {
        console.log('Ошибка при получении данных пользователя', message);
      })
      .finally(() => {
        setIsCheckingToken(false);
      })
  }, [])


  useEffect(() => {
    setCardsInRow(calcCardsInRow());
    const handlerResize = () => setCardsInRow(calcCardsInRow());

    window.addEventListener("resize", handlerResize);
    return () => {
      window.removeEventListener("resize", handlerResize)
    }
  }, [])


  useEffect(() => {
    if (allMovies.length === 0) {
      return
    }
    if (filter.name === undefined) {
      return
    }
    setToShowMovies([])
    try {
      if (localStorage.getItem('filteredFilms') && filterForNoSaved.shortFilm !== true) {
       setFilterNoSaved(JSON.parse(localStorage.getItem('filteredFilms')))
      }

      if (localStorage.getItem('searchedFilms')) {
        setSavedSearchedMovies(localStorage.getItem('searchedFilms'))
        const removed = savedSearchedMovies.splice(0, cardsInRow)
        setFilteredMovies(savedSearchedMovies)
        setToShowMovies(removed) //removed 
      }
      else {
        const filtered = allMovies.filterNoSaved(movie =>
          (movie.nameRU.toLowerCase().includes(filterNoSaved.name.toLowerCase()))
          && (filterNoSaved.shortFilm ? isShortFilm(movie.duration) : true)
          && (filterNoSaved.saved ? isSaved(movie.id) : true)
        )
        localStorage.setItem('searchedFilms', JSON.stringify(filtered))
        const removed = filtered.splice(0, cardsInRow);
        setFilteredMovies(filtered);
        setToShowMovies(removed);
      }

      setOnce(false);
      setNope(false)

      if (!filterNoSaved?.saved && currentUser._id) {
        setFilterLocalStorage(state => ({
          ...state,
          [currentUser._id]: filterNoSaved
        }))
      }
    } 
    catch (err){
        console.log(err)
        setNope(true)
    }


    if (nope === true) {
      if (localStorage.getItem('searchedFilms')) {
        setSavedSearchedMovies(localStorage.getItem('searchedFilms'))
        setFilteredMovies(savedSearchedMovies)
        const removed = savedSearchedMovies.splice(0, cardsInRow)
        setToShowMovies(removed) //removed
      }
      else {
        const filtered = allMovies.filter(movie =>
          (movie.nameRU.toLowerCase().includes(filter.name.toLowerCase()))
          && (filter.shortFilm ? isShortFilm(movie.duration) : true)
          && (filter.saved ? isSaved(movie.id) : true)
        )
        localStorage.setItem('searchedFilms', JSON.stringify(filtered))
        const removed = filtered.splice(0, cardsInRow);
        setFilteredMovies(filtered);
        setToShowMovies(removed);
      }

    setOnce(false);

    if (!filter?.saved && currentUser._id) {
      setFilterLocalStorage(state => ({
        ...state,
        [currentUser._id]: filter
      }))
    }
    }
  }, [filter])



  function filterForSaved() {
    setFilter({
      name: '',
      shortFilm: false,
      saved: true
    })
  }

  function filterForNoSaved() {
    if (localStorage.getItem('filteredFilms')) {
      setFilter({
        name: filterLocalStorage[currentUser._id]?.name || '',
        shortFilm: filterForNoSaved.shortFilm,
        saved: false
      })
    }
    else {
      setFilter({
        name: '',
        shortFilm: false,
        saved: false
      })
    }
  }

  function isSaved(id) {
    return savedMovies.map(el => el.movieId).includes(id)
  }

  function createMovie(movie) {
    mainApi
      .createMovie(movie, currentUser._id)
      .then(data => {
        setSavedMovies(state => [...state, data])
      })
      .catch(() => showModal('Ошибка при сохранении фильма', modal.type_error))
  }

  function deleteMovie({id}) {
    const [{ _id }] = savedMovies.filter(el => el.movieId === id)
    mainApi
      .deleteMovie(_id)
      .then(() => {
        setSavedMovies(state => state.filter(el => el._id !== _id))
        setFilter(state => ({...state}))
      })
      .catch(err => {
        console.log(err)
      })
  }

  async function moveFilterToShow() {
    const copyFilteredMovies = [...filteredMovies];
    const removed = copyFilteredMovies.splice(0, cardsInRow);
    await setToShowMovies((state) => {
      return [...state].concat(removed)
    });
    await setFilteredMovies(() => {
      return copyFilteredMovies
    });
  }

  function findFilms({name, shortFilm}) {
    name = name.trim();
    if (!name) {
      showModal('Нужно ввести ключевое слово', modal.type_error);
      return;
    }

    // поиск
    if (allMovies.length > 0) {
      setLoading(true);
      setIsFetchingError(false);
      moviesApi.getMovies()
        .then(data => {
          setAllMovies(data);
        })
        .catch(err => {
          console.log(err);
          setIsFetchingError(true);
        })
        .finally(() => {
          setLoading(false)
          setFilter(state => ({
            ...state,
            name,
            shortFilm
          }));
          localStorage.setItem('filteredFilms', JSON.stringify(filter));
        })
    }
  }


  function handleUpdateProfile(formData) {
    mainApi
      .setUserInfo(formData)
      .then((data) => {
        showModal('Данные профиля обновлены', modal.type_ok);
        setCurrentUser(data);
      })
      .catch(({message}) => {
        showModal(message, modal.type_error)
      })
  }

  function handleSignOut() {
    setFilterLocalStorage(state => {
      delete state[currentUser._id]
      return state;
    })
    localStorage.removeItem('filteredFilms')
    localStorage.removeItem('searchedFilms')
    mainApi
      .signOut()
      .then(() => {
        setLoggedIn(false);
        setCurrentUser({});
        setSavedMovies([]); 
        setLoading(false);
        // TODO возможно придётся убрать
        history.push('/');
      })
      .catch(({message}) => {
        showModal(message, modal.type_error)
      })
  }

  function handleRegister(formData) {
    setLoading(true);
    setIsFetchingFromForm(true);
    mainApi
      .signUp(formData)
      .then(({data}) => {
        if (data) {
          // setCurrentUser(data)
          // setLoggedIn(true);
          // history.push('/movies');
          handleLogin(formData);
          showModal('Вы зарегистрированы!', modal.type_ok);
        }
      })
      .catch(({message}) => {
        showModal(message, modal.type_error)
      })
      .finally(() => {
        setLoading(false);
        setIsFetchingFromForm(false);
      })
  }


  function handleLogin(formData){
    setLoading(true);
    setIsFetchingFromForm(true);
    new Promise(function(resolve,reject) {
      resolve(mainApi.signIn(formData))
    })
    .then(({data}) =>{
      if (data) {
        setCurrentUser(data);
        setLoggedIn(true);
        history.push('/movies');
      }
    })
    .catch(err => console.log(err))
    .then(() => {
      mainApi.getSavedMovies().then(({data}) => setSavedMovies(data))
    })
    .catch(({message}) => {
      showModal(message, modal.type_error)
    })
    .finally(() => {
      setLoading(false);
      setIsFetchingFromForm(false);
    })
    }

  useEffect(() => {
    mainApi
      .getSavedMovies()
      .then(({data}) => setSavedMovies(data))
      .catch(err => console.log(err))
  }, [])

  function closeModal() {
    setIsOpenModal(false);
  }

  async function showModal(message, type = 'ok') {
    await setModalConfig({message, type});
    await setIsOpenModal(true);
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <>
        <Switch>
          <Route path='/' exact>
            <Main
              loggedIn={loggedIn}
              menuState={menuState}
            />
          </Route>

          <ProtectedRoute
            path='/movies'
            loggedIn={loggedIn}
            menuState={menuState}
            component={Movies}
            isLoading={isLoading}
            findFilms={findFilms}
            movies={toShowMovies}
            moveFilterToShow={moveFilterToShow}
            filteredMovies={filteredMovies}
            isFetchingError={isFetchingError}
            once={once}
            createMovie={createMovie}
            deleteMovie={deleteMovie}
            savedMovies={savedMovies}
            isCheckingToken={isCheckingToken}
            filterForNoSaved={filterForNoSaved}
            searchString={filterLocalStorage[currentUser._id]?.name}
          />

          <ProtectedRoute
            path='/saved-movies'
            moveFilterToShow={moveFilterToShow}
            isLoading={isLoading}
            loggedIn={loggedIn}
            menuState={menuState}
            component={SavedMovies}
            movies={toShowMovies}
            createMovie={createMovie}
            deleteMovie={deleteMovie}
            savedMovies={savedMovies}
            findFilms={findFilms}
            filterForSaved={filterForSaved}
            isCheckingToken={isCheckingToken}
          />

          <ProtectedRoute
            path='/profile'
            loggedIn={loggedIn}
            menuState={menuState}
            onSignOut={handleSignOut}
            updateProfile={handleUpdateProfile}
            component={Profile}
            isCheckingToken={isCheckingToken}
          />

          <Route path='/sign-up' >
          {loggedIn 
            ? <Redirect to='/'/>
            : <Register
              onRegister={handleRegister}
              isFetching={isFetchingFromForm}
              /> 
          }
          </Route>

          <Route path="/sign-in">
            {loggedIn 
            ? <Redirect to='/'/>
            : <Login
              onLogin={handleLogin}
              isFetching={isFetchingFromForm}
              />
            }
          </Route>

          <Route>
            <PageNotFound />
          </Route>
        </Switch>

        <Modal
          onClose={closeModal}
          isOpened={isOpenModal}
          modalConfig={modalConfig}
        />
      </>
    </CurrentUserContext.Provider>
  );
}

export default App;
