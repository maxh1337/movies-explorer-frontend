import './Portfolio.css';

function Portfolio() {
  return (
    <section className="portfolio">
      <div className="portfolio__container">
        <h2 className="portfolio__title">Портфолио</h2>
        <ul className="portfolio__sites">
          <li className="portfolio__sites-item">
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/maxh1337/how-to-learn" className="portfolio__site-link">
              <h3 className="portfolio__site">Статичный сайт</h3>
            </a>
          </li>
          <li className="portfolio__sites-item">
            <a target="_blank" rel="noopener noreferrer" href="https://maxh1337.github.io/mesto/" className="portfolio__site-link">
              <h3 className="portfolio__site">Адаптивный сайт</h3>
            </a>
          </li>
          <li className="portfolio__sites-item">
            <a target="_blank" rel="noopener noreferrer" href="https://istupidsoiwontpassdiplom.nomoredomains.rocks/sign-in" className="portfolio__site-link">
              <h3 className="portfolio__site">Одностраничное приложение</h3>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Portfolio;
