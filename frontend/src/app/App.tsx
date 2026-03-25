import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AdsListPage } from '../pages/ads-list-page/ui/ads-list-page';
import { AdDetailsPage } from '../pages/ad-details-page/ui/ad-details-page';
import { AdDetailsLayout } from './routes/ad-details-layout';
import { AdEditPage } from '../pages/ad-edit-page/ui/ad-edit-page';
import { AdsLayout } from './routes/ads-layout';

type TTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'seller-hub-theme';

const getInitialTheme = (): TTheme => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return 'light';
};

const App = () => {
  const [theme, setTheme] = useState<TTheme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <button
        type="button"
        className="themeToggle"
        onClick={handleToggleTheme}
        aria-pressed={theme === 'dark'}
      >
        {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      </button>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/ads" replace />} />

          <Route path="/ads" element={<AdsLayout />}>
            <Route index element={<AdsListPage />} />

            <Route path=":id" element={<AdDetailsLayout />}>
              <Route index element={<AdDetailsPage />} />
              <Route path="edit" element={<AdEditPage />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
