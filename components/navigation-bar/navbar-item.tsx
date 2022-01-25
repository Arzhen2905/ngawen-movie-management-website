import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Class from 'classnames';
import styles from '../../styles/navigation-bar.module.css';

interface NavItemTypes {
  title: string;
}

interface GetMovieListTypes {
  id: number;
  poster_path: string;
  vote_average: number;
  title: string;
  release_date: string;
}

export default function NavItem(props: NavItemTypes) {
  const { title } = props;
  const [href, setURL] = useState<string>('/');
  const [isActive, setActive] = useState<boolean>(false);
  const [favoriteListSection, setfavoriteListSection] = useState<
    Array<GetMovieListTypes>
  >([]);
  const router = useRouter();
  const page = router.pathname;

  useEffect(() => {
    if (title !== 'Home') {
      setURL(`/${title.toLowerCase()}`);
    }

    if (
      page === `/${title.toLowerCase()}` ||
      (title === 'Home' && page === '/')
    ) {
      setActive(true);
    }

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

  const classNavItem = Class('nav-item', 'px-4', styles['nav-item-custom']);

  const classNavLink = Class(
    'nav-link',
    { active: isActive },
    styles['nav-link-custom']
  );

  return title === 'Favorites' ? (
    <li className={classNavItem}>
      <Link href={href}>
        <a className={classNavLink}>Favorites({favoriteListSection.length})</a>
      </Link>
    </li>
  ) : (
    <li className={classNavItem}>
      <Link href={href}>
        <a className={classNavLink}>{title}</a>
      </Link>
    </li>
  );
}
