import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Class from 'classnames';
import MovieCard from '../movie-card';

interface GetGenreListTypes {
  id: number;
  name: string;
}

interface GetMovieListTypes {
  id: number;
  poster_path: string;
  vote_average: number;
  title: string;
  release_date: string;
}

interface LandingPageMovieListTypes {
  isAllMovies?: boolean;
  isNowPlaying?: boolean;
}

const API_KEY = '5faf36c1c969c6448c0502fdd0414c56';

const fetcherGenreListSection = (url: string) =>
  fetch(url).then((res) => res.json());
const fetcherAllMovieListSection = (url: string) =>
  fetch(url).then((res) => res.json());
const fetcherNowPlayingListSection = (url: string) =>
  fetch(url).then((res) => res.json());
const fetcherLatestMovieListSection = (url: string) =>
  fetch(url).then((res) => res.json());
const fetcherGenreMovieListSection = (url: string) =>
  fetch(url).then((res) => res.json());

export default function LandingPageMovieList(
  props: Partial<LandingPageMovieListTypes>
) {
  const { isAllMovies, isNowPlaying } = props;
  const [genreListSection, setGenreListSection] = useState<
    Array<GetGenreListTypes>
  >([]);
  const [movieListSection, setMovieListSection] = useState<
    Array<GetMovieListTypes>
  >([]);
  const [genreID, setGenreID] = useState<number>(0);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(true);
  const [isLatest, setIsLatest] = useState<boolean>(false);
  const [isGenre, setIsGenre] = useState<boolean>(false);
  const [loadMoreCount, setLoadMoreCount] = useState<number>(10);
  const [sectionTitle, setSectionTitle] = useState<string>('All Movies');
  const [genreTitle, setGenreTitle] = useState<string>('All Movies');

  const router = useRouter();
  const currentDate = new Date();
  const getGenreListSection = useSWR(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    fetcherGenreListSection
  );
  const getAllMovieListSection = useSWR(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`,
    fetcherAllMovieListSection
  );
  const getNowPlayingListSection = useSWR(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
    fetcherNowPlayingListSection
  );
  const getLatestMovieListSection = useSWR(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&year=${currentDate.getFullYear}&vote_average.gte=8`,
    fetcherLatestMovieListSection
  );
  const getGenreMovieListSection = useSWR(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreID}`,
    fetcherGenreMovieListSection
  );

  useEffect(() => {
    if (isNowPlaying) {
      setSectionTitle('Now Playing');
    }
    if (
      getGenreListSection.data &&
      getAllMovieListSection.data &&
      getNowPlayingListSection.data &&
      getLatestMovieListSection.data &&
      getGenreMovieListSection.data
    ) {
      setGenreListSection(getGenreListSection.data.genres);
      if (isAllMovies) {
        setMovieListSection(
          getAllMovieListSection.data.results.slice(0, loadMoreCount)
        );
      }
      if (isNowPlaying) {
        setMovieListSection(
          getNowPlayingListSection.data.results.slice(0, loadMoreCount)
        );
      }
      if (isLatest) {
        setMovieListSection(
          getLatestMovieListSection.data.results.slice(0, loadMoreCount)
        );
      }
      if (isGenre || genreID) {
        setMovieListSection(
          getGenreMovieListSection.data.results.slice(0, loadMoreCount)
        );
      }
      if (loadMoreCount === getAllMovieListSection.data.results.length) {
        setIsLoadMore(false);
      }
      if (
        getGenreListSection.data.hasOwnProperty('errors') ||
        getAllMovieListSection.data.hasOwnProperty('errors') ||
        getNowPlayingListSection.data.hasOwnProperty('errors') ||
        getLatestMovieListSection.data.hasOwnProperty('errors') ||
        getGenreMovieListSection.data.hasOwnProperty('errors')
      ) {
        router.push('/error');
      }
    }
  }, [
    getGenreListSection.data,
    getAllMovieListSection.data,
    getNowPlayingListSection.data,
    getLatestMovieListSection.data,
    getGenreMovieListSection.data,
    movieListSection,
    genreID,
    isLoadMore,
    isLatest,
    isGenre,
    loadMoreCount,
    sectionTitle,
    genreTitle,
  ]);

  function handleSeeMore() {
    if (isAllMovies) {
      router.push('/movies');
    }
    if (isNowPlaying) {
      router.push('/movies/now-playing');
    }
  }

  const classGenre = Class(
    'dropdown',
    'd-flex',
    'justify-content-center',
    { 'd-none': isNowPlaying },
    'section-item'
  );

  const classLoadMore = Class(
    {
      'd-none': !isLoadMore,
    },
    'btn',
    'btn-secondary'
  );

  const classSeeMore = Class({ 'd-none': isLoadMore }, 'btn', 'btn-secondary');

  return (
    <section className="content-section">
      <div className="section-item d-flex justify-content-center">
        <h1>
          <strong>{sectionTitle}</strong>
        </h1>
      </div>
      <div className={classGenre}>
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {genreTitle}
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li>
            <button
              className="dropdown-item"
              onClick={() => {
                setIsGenre(false);
                setIsLatest(false);
                setGenreID(0);
                setGenreTitle('All Movies');
              }}
              type="button"
            >
              All Movies
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => {
                setIsGenre(false);
                setIsLatest(true);
                setGenreID(0);
                setGenreTitle('Latest Movies');
              }}
              type="button"
            >
              Latest Movies
            </button>
          </li>
          {genreListSection ? (
            genreListSection.map((genreListMap: GetGenreListTypes) => (
              <li key={JSON.stringify(genreListMap.id)}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsLatest(false);
                    setIsGenre(true);
                    setGenreID(genreListMap.id);
                    setGenreTitle(genreListMap.name);
                  }}
                  type="button"
                >
                  {genreListMap.name}
                </button>
              </li>
            ))
          ) : (
            <div className="loading d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </ul>
      </div>
      <div className="section-item row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
        {movieListSection ? (
          movieListSection.map((movieListMap: GetMovieListTypes) => (
            <MovieCard
              key={JSON.stringify(movieListMap.id)}
              movieID={movieListMap.id}
              poster={`https://image.tmdb.org/t/p/w500${movieListMap.poster_path}`}
              rating={movieListMap.vote_average}
              movieTitle={movieListMap.title}
              releaseDate={movieListMap.release_date}
            />
          ))
        ) : (
          <div className="loading d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
      <div className="section-item d-flex justify-content-center">
        <button
          className={classLoadMore}
          onClick={() => setLoadMoreCount(loadMoreCount + 5)}
          type="button"
        >
          Load More
        </button>
        <button className={classSeeMore} onClick={handleSeeMore} type="button">
          See More
        </button>
      </div>
    </section>
  );
}
