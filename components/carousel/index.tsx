import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Class from 'classnames';
import styles from '../../styles/carousel.module.css';

interface GetCarouselTypes {
  id: number;
  poster_path: string;
  vote_average: number;
  title: string;
  release_date: string;
  overview: string;
}

const API_KEY = '5faf36c1c969c6448c0502fdd0414c56';

const fetcherCarousel = (url: string) => fetch(url).then((res) => res.json());

export default function Carousel() {
  const [carouselSection, setCarouselSection] = useState<
    Array<GetCarouselTypes>
  >([]);

  const getCarousel = useSWR(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
    fetcherCarousel
  );

  useEffect(() => {
    if (getCarousel.data) {
      setCarouselSection(getCarousel.data.results.slice(0, 5));
    }
  }, [getCarousel.data]);

  function ratingStars(param: number) {
    let rating = [];
    for (let i = 0; i < param; i += 1) {
      rating.push(
        <svg
          key={JSON.stringify(i)}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-star-fill text-warning"
          viewBox="0 0 16 16"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
      );
    }
    return rating;
  }

  const classImage = Class(styles.image, 'd-block', 'w-100');

  const classCarouselBackground = Class(
    styles['carousel-background'],
    'carousel-caption'
  );

  const classCarouselCaption = Class(
    styles['carousel-caption'],
    'carousel-caption',
    'd-md-block'
  );

  return (
    <section className="content-section">
      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="4"
            aria-label="Slide 5"
          ></button>
        </div>
        <div className="carousel-inner">
          {carouselSection[0] ? (
            <div className="carousel-item active">
              <img
                src={`https://image.tmdb.org/t/p/original${carouselSection[0].poster_path}`}
                className={classImage}
              />
              <div className={classCarouselBackground} />
              <div className={classCarouselCaption}>
                <h2 className={styles.text}>{carouselSection[0].title}</h2>
                <h4 className={styles.text}>
                  ({carouselSection[0].release_date})
                </h4>
                <div className={styles['rating-wrapper']}>
                  {ratingStars(Math.round(carouselSection[0].vote_average))}{' '}
                  <span className={styles.text}>
                    {carouselSection[0].vote_average}
                  </span>
                </div>
                <p className={styles.text}>{carouselSection[0].overview}</p>
              </div>
            </div>
          ) : (
            <div className="loading d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {carouselSection ? (
            carouselSection
              .slice(1, 4)
              .map((carouselSectionMap: GetCarouselTypes) => (
                <div
                  className="carousel-item"
                  key={JSON.stringify(carouselSectionMap.id)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${carouselSectionMap.poster_path}`}
                    className={classImage}
                  />
                  <div className={classCarouselBackground} />
                  <div className={classCarouselCaption}>
                    <h2 className={styles.text}>{carouselSectionMap.title}</h2>
                    <h4 className={styles.text}>
                      ({carouselSectionMap.release_date})
                    </h4>
                    <div className={styles['rating-wrapper']}>
                      {ratingStars(Math.round(carouselSectionMap.vote_average))}{' '}
                      <span className={styles.text}>
                        {carouselSectionMap.vote_average}
                      </span>
                    </div>
                    <p className={styles.text}>{carouselSectionMap.overview}</p>
                  </div>
                </div>
              ))
          ) : (
            <div className="loading d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
}
