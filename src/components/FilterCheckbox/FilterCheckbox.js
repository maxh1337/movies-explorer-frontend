// import './FilterCheckbox.css';
// import React from 'react';

// function FilterCheckbox({isCheckbox, setCheckbox}) {

//   const clickCheckbox = () => {
//     setCheckbox(isCheckbox ? false : true)
//   }
//   return (
//     <label className={isCheckbox ? "switcher switcher_active" : "switcher switcher_disabled"} onClick={clickCheckbox}>
//       <input
//         name="shortFilm"
//         type="checkbox"
//         className="switcher__input" 
//       />
//     </label>
//   );
// }

// export default FilterCheckbox;
import './FilterCheckbox.css';

function FilterCheckbox({values, onChange}) {
  return (
    <label className="switcher">
      <input
        name="shortFilm"
        className="switcher__input"
        type="checkbox"
        checked={values.shortFilm || false}
        onChange={onChange}
      />
      <span className="switcher__span"/>
    </label>
  );
}

export default FilterCheckbox;