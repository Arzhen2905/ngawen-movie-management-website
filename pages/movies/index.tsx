import Movies from '../../components/movies-page';
import styles from '../../styles/page.module.css';
import Footer from '../../components/footer';

export default function MoviesPage() {
  return (
    <>
      <div className={styles['main-content']}>
        <Movies isAllMovies />
      </div>
      <Footer />
    </>
  );
}
