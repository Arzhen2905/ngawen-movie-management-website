import styles from '../styles/page.module.css';
import Navbar from '../components/navigation-bar';
import Carousel from '../components/carousel';
import LandingPageMovieList from '../components/movie-list-landing-page';
import Footer from '../components/footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Carousel />
      <div className={styles['main-content']}>
        <LandingPageMovieList isNowPlaying />
        <LandingPageMovieList isAllMovies />
      </div>
      <Footer />
    </>
  );
}
