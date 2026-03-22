import { Navigate, Route, Routes } from 'react-router-dom';
import { AdsListPage } from '../pages/ads-list-page/ui/ads-list-page';

const App = () => {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/ads" replace />} />
          <Route path="/ads" element={<AdsListPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
