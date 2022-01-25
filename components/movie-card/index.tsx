import { useState, useEffect } from 'react';
import Class from 'classnames';
import styles from '../../styles/movie-list.module.css';

interface MovieCardTypes {
  movieID: number;
  poster: string;
  rating: number;
  movieTitle: string;
  releaseDate: string;
}

export default function MovieCard(props: Partial<MovieCardTypes>) {
  const { movieID, poster, rating, movieTitle, releaseDate } = props;
  const [stateFavorite, setStateFavorite] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [favoriteCaption, setFavoriteCaption] =
    useState<string>('Add to Favorites');

  useEffect(() => {
    setStateFavorite(
      window.localStorage.hasOwnProperty(JSON.stringify(movieID))
    );
  }, [stateFavorite]);

  function handleFavorite() {
    if (stateFavorite) {
      window.localStorage.removeItem(JSON.stringify(movieID));
      setFavoriteCaption('Add to Favorites');
      setStateFavorite(
        window.localStorage.hasOwnProperty(JSON.stringify(movieID))
      );
    } else {
      window.localStorage.setItem(
        JSON.stringify(movieID),
        JSON.stringify({
          id: movieID,
          poster_path: poster,
          vote_average: rating,
          title: movieTitle,
          release_date: releaseDate,
        })
      );
      setFavoriteCaption('Delete from Favorites');
      setStateFavorite(
        window.localStorage.hasOwnProperty(JSON.stringify(movieID))
      );
    }
  }

  const classMovieCardBackground = Class(
    styles['movie-card-background'],
    'carousel-caption'
  );

  const classRatingWrapper = Class(
    styles['rating-wrapper'],
    'd-flex',
    'justify-content-center'
  );

  const classFavoriteIcon = Class(
    { 'd-none': !(isHover || stateFavorite) },
    'bi',
    'bi-bookmark-heart-fill',
    'text-light',
    'carousel-caption',
    styles['favorite-icon']
  );

  const classMovieCardDetail = Class(
    styles['movie-card-detail'],
    'carousel-caption'
  );

  const classFavoriteHover = Class(
    { 'd-none': !isHover },
    styles['favorite-hover']
  );

  const classMovieTitle = Class(
    'text-body',
    styles['movie-title'],
    'align-self-center'
  );

  return (
    <div className="col">
      <div
        className={styles['movie-card']}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleFavorite}
        data-aos="fade-up"
        data-aos-easing="linear"
        data-aos-duration="500"
        data-aos-delay="100"
      >
        <div className={classMovieCardBackground} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className={classFavoriteIcon}
          viewBox="0 0 16 16"
        >
          <path d="M2 15.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.5zM8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z" />
        </svg>
        <img className={styles.poster} src={poster} />
        <div className={classMovieCardDetail}>
          <div className="d-flex justify-content-center">
            <p className={classFavoriteHover}>{favoriteCaption}</p>
          </div>
          <div className={classRatingWrapper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-star-fill text-warning"
              viewBox="0 0 16 16"
            >
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            </svg>
            <span className={styles['rating-text']}>{rating}</span>
          </div>
          <p className={classMovieTitle}>{movieTitle}</p>
          <p className={classMovieTitle}>({releaseDate})</p>
        </div>
      </div>
    </div>
  );
}
