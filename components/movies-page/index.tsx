import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

interface MovieTypes {
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

export default function Movies(props: Partial<MovieTypes>) {
  const { isAllMovies, isNowPlaying } = props;
  const [genreListSection, setGenreListSection] = useState<
    Array<GetGenreListTypes>
  >([]);
  const [movieListSection, setMovieListSection] = useState<
    Array<GetMovieListTypes>
  >([]);
  const [genreID, setGenreID] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sectionTitle, setSectionTitle] = useState<string>('Movies');
  const [genreTitle, setGenreTitle] = useState<string>('All Movies');
  const [isLatest, setIsLatest] = useState<boolean>(false);
  const [isGenre, setIsGenre] = useState<boolean>(false);
  const [totalShowings, setTotalShowings] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [pagination, setPagination] = useState<Array<number>>([]);

  const currentDate = new Date();
  const router = useRouter();
  const getGenreListSection = useSWR(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    fetcherGenreListSection
  );
  const getAllMovieListSection = useSWR(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`,
    fetcherAllMovieListSection
  );
  const getNowPlayingListSection = useSWR(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`,
    fetcherNowPlayingListSection
  );
  const getLatestMovieListSection = useSWR(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&year=${currentDate.getFullYear()}`,
    fetcherLatestMovieListSection
  );
  const getGenreMovieListSection = useSWR(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreID}`,
    fetcherGenreMovieListSection
  );

  useEffect(() => {
    handlePagination();
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
        setMovieListSection(getAllMovieListSection.data.results);
        setTotalResults(getAllMovieListSection.data.total_results);
        setTotalPages(getAllMovieListSection.data.total_pages);
        setTotalShowings(
          getAllMovieListSection.data.results
            ? getAllMovieListSection.data.results.length
            : 0
        );
      }
      if (isNowPlaying) {
        setMovieListSection(getNowPlayingListSection.data.results);
        setTotalResults(getNowPlayingListSection.data.total_results);
        setTotalPages(getNowPlayingListSection.data.total_pages);
        setTotalShowings(
          getNowPlayingListSection.data.results
            ? getNowPlayingListSection.data.results.length
            : 0
        );
      }
      if (isLatest) {
        setMovieListSection(getLatestMovieListSection.data.results);
        setTotalResults(getLatestMovieListSection.data.total_results);
        setTotalPages(getLatestMovieListSection.data.total_pages);
        setTotalShowings(
          getLatestMovieListSection.data.results
            ? getLatestMovieListSection.data.results.length
            : 0
        );
      }
      if (isGenre || genreID) {
        setMovieListSection(getGenreMovieListSection.data.results);
        setTotalResults(getGenreMovieListSection.data.total_results);
        setTotalPages(getGenreMovieListSection.data.total_pages);
        setTotalShowings(
          getGenreMovieListSection.data.results
            ? getGenreMovieListSection.data.results.length
            : 0
        );
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
    isLatest,
    isGenre,
    genreID,
    page,
  ]);

  function handlePagination() {
    const paginationArray: Array<number> = [];
    if (page <= 5) {
      paginationArray.splice(0, paginationArray.length);
      for (let i = 0; i < 5; i += 1) {
        paginationArray.push(i + 3);
      }
      setPagination(paginationArray);
    }
    if (page >= 5 && page <= totalPages) {
      paginationArray.splice(0, paginationArray.length);
      for (let i = page - 2; i <= page + 2; i += 1) {
        paginationArray.push(i);
      }
      setPagination(paginationArray);
    }
    if (page >= totalPages - 5 && page <= totalPages) {
      paginationArray.splice(0, paginationArray.length);
      for (let i = totalPages - 6; i < totalPages - 1; i += 1) {
        paginationArray.push(i);
      }
      setPagination(paginationArray);
    }
  }

  const classGenre = Class({ 'd-none': isNowPlaying }, 'section-item');

  return (
    <>
      <section className="content-section">
        {isNowPlaying ? (
          <>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb section-item">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Home</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/movies">
                    <a>Movies</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {sectionTitle}
                </li>
              </ol>
            </nav>
            <div className="section-item d-flex justify-content-center">
              <p>
                Showing 1-{totalShowings} of {totalResults} results
              </p>
            </div>
          </>
        ) : (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb section-item">
              <li className="breadcrumb-item">
                <Link href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {sectionTitle}
              </li>
            </ol>
          </nav>
        )}
        <div className={classGenre}>
          <div className="d-flex justify-content-center">
            <p>
              Showing 1-{totalShowings} of {totalResults} results
            </p>
          </div>
          <div className="dropdown d-flex justify-content-center">
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
                    setPage(1);
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
                    setPage(1);
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
                        setPage(1);
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
      </section>
      <section className="content-section d-flex justify-content-center">
        <nav aria-label="...">
          <ul className="pagination">
            {page === 1 ? (
              <>
                <li className="page-item disabled">
                  <span className="page-link">{'<<'}</span>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">Previous</span>
                </li>
                <li className="page-item active">
                  <span className="page-link">1</span>
                </li>
              </>
            ) : (
              <>
                <li className="page-item">
                  <button
                    className="page-link text-dark"
                    onClick={() => {
                      setPage(1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {'<<'}
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link text-dark"
                    onClick={() => {
                      setPage(page - 1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Previous
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link text-dark"
                    onClick={() => {
                      setPage(1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    1
                  </button>
                </li>
              </>
            )}
            {page <= 5 ? (
              page === 2 ? (
                <li className="page-item active">
                  <span className="page-link">2</span>
                </li>
              ) : (
                <li className="page-item">
                  <button
                    className="page-link text-dark"
                    onClick={() => {
                      setPage(2);
                      window.scrollTo(0, 0);
                    }}
                  >
                    2
                  </button>
                </li>
              )
            ) : (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            {pagination.map((paginationMap) =>
              paginationMap === page ? (
                <li
                  className="page-item active"
                  key={JSON.stringify(paginationMap)}
                >
                  <span className="page-link">{paginationMap}</span>
                </li>
              ) : (
                <li className="page-item" key={JSON.stringify(paginationMap)}>
                  <button
                    className="page-link text-dark"
                    onClick={() => {
                      setPage(paginationMap);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {paginationMap}
                  </button>
                </li>
              )
            )}
            {page >= totalPages - 5 && page <= totalPages ? (
              page === totalPages - 1 ? (
                <li className="page-item active">
                  <span className="page-link">{totalPages - 1}</span>
                </li>
              ) : (
                <li className="page-item">
                  <button
                    className="page-link text-dark"
                    onClick={() => {
                      setPage(totalPages - 1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {totalPages - 1}
                  </button>
                </li>
              )
            ) : (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            {page === totalPages ? (
              <>
                <li className="page-item active">
                  <span className="page-link">{totalPages}</span>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">Next</span>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">{'>>'}</span>
                </li>
              </>
            ) : (
              <>
                <li className="page-item">
                  <button
                    className="page-link text-dark"
                    onClick={() => {
                      setPage(totalPages);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {totalPages}
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link text-dark"
                    onClick={() => {
                      setPage(page + 1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Next
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link text-dark"
                    onClick={() => {
                      setPage(totalPages);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {'>>'}
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </section>
    </>
  );
}
