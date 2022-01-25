import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Footer from '../components/footer';

export default function PageNotFound() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push('/'), 5000);
  }, []);

  return (
    <>
      <div className="error">
        <h1 className="text-secondary">404</h1>
        <h3 className="text-secondary">Page was not found</h3>
        <p className="text-secondary">
          Redirecting to <a href="/">Home</a> Page...
        </p>
      </div>
      <Footer />
    </>
  );
}
