import './AboutMe.css';
import avatar from '../../images/foto.jpg';

function AboutMe() {
  return (
    <section className="about">
      <div className="about__container">
        <h2 id="Студент" className="about__title">Студент</h2>

        <div className="about__wrap">
          <div className="about__column about__column_person">
            <h3 className="about__name">Максим</h3>
            <p className="about__info">Фронтенд-разработчик, 18 лет</p>
            <p className="about__description">Я&nbsp;родился и&nbsp;живу в&nbsp;Курске, учусь в ЮЗГУ по специальности информационная безопасность.</p>
            <ul className="about__social">
              <li className="about__social-item">
                <a href="https://vk.com/maxh1336" className="about__social-link" target="_blank" rel="noopener noreferrer">Vkontakte</a>
              </li>
              <li className="about__social-item">
                <a href="https://github.com/maxh1337" className="about__social-link" target="_blank" rel="noopener noreferrer">Github</a>
              </li>
            </ul>
          </div>
          <div className="about__column about__column_avatar">
            <img className="about__avatar" src={avatar} alt="Фотография"/>
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutMe;
