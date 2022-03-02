import './SearchForm.css';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';


function SearchForm() {
  return (
    <section className="search-form">
      <div className="search-form__container">
        <form className="search-form__form">
          <fieldset className="search-form__fieldset">
            <input className="search-form__input" placeholder="Фильм" />
            <button className="search-form__submit-btn" type="submit" />
          </fieldset>
          <fieldset className="search-form__fieldset">
            <FilterCheckbox />
            <span className="search-form__span">Короткометражки</span>
          </fieldset>
        </form>
      </div>


    </section>
  );
}

export default SearchForm;
