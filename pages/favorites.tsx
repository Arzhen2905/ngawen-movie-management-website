import { useState, useEffect } from 'react';
import Link from 'next/link';
import MovieCard from '../components/movie-card';
import Footer from '../components/footer';
import styles from '../styles/page.module.css';

interface GetMovieListTypes {
  id: number;
  poster_path: string;
  vote_average: number;
  title: string;
  release_date: string;
}

export default function MoviesPage() {
  const [favoriteListSection, setfavoriteListSection] = useState<
    Array<GetMovieListTypes>
  >([]);

  useEffect(() => {
    const favoriteList: Array<GetMovieListTypes> = Object.values(
      window.localStorage
    )
      .filter((favoriteListFind) =>
        JSON.parse(favoriteListFind).hasOwnProperty('poster_path')
      )
      .map((favoriteListMap) =>
        favoriteListMap ? JSON.parse(favoriteListMap) : undefined
      );

    setfavoriteListSection(favoriteList);
  }, [favoriteListSection]);

  return (
    <>
      <div className={styles['main-content']}>
        <section className="content-section">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb section-item">
              <li className="breadcrumb-item">
                <Link href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Favorites
              </li>
            </ol>
          </nav>
          <div className="favorite-content section-item row row-cols-2 row-cols-md-4 row-cols-lg-5">
            {favoriteListSection[0] ? (
              favoriteListSection.map((movieListMap: GetMovieListTypes) => (
                <MovieCard
                  key={JSON.stringify(movieListMap.id)}
                  movieID={movieListMap.id}
                  poster={movieListMap.poster_path}
                  rating={movieListMap.vote_average}
                  movieTitle={movieListMap.title}
                  releaseDate={movieListMap.release_date}
                />
              ))
            ) : (
              <div className="favorite-not-found">
                <h5 className="text-secondary">Favorite was not found</h5>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
