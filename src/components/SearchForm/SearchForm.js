import './SearchForm.css';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import {useFormWithValidation} from "../../utils/form-validation";
import {useEffect} from "react";

function SearchForm({findFilms, searchString}) {
  const { values, handleChange, resetForm } = useFormWithValidation();

  useEffect(() => {
    resetForm({
      name: searchString || '',
      shortFilm: false
    })
  }, [])

  function handleSubmit(evt) {
    evt.preventDefault();
    findFilms(values);
  }

  return (
    <section className="search-form">
      <div className="search-form__container">
        <form className="search-form__form" onSubmit={handleSubmit}>
          <fieldset className="search-form__fieldset">
            <input
              name="name"
              value={values.name || ''}
              onChange={handleChange}
              className="search-form__input"
              placeholder="Фильм"
              autoComplete="off"
            />
            <button className="search-form__submit-btn" type="submit">Найти</button>
          </fieldset>
          <fieldset className="search-form__fieldset">
            <FilterCheckbox
              values={values}
              onChange={handleChange}
            />
            <span className="search-form__span">Короткометражки</span>
          </fieldset>
        </form>
      </div>
    </section>
  );
}

export default SearchForm;

