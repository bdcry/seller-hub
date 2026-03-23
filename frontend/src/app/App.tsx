import { Navigate, Route, Routes } from 'react-router-dom';
import { AdsListPage } from '../pages/ads-list-page/ui/ads-list-page';
import { AdDetailsPage } from '../pages/ad-details-page/ad-details-page';
import { AdDetailsLayout } from './routes/ad-details-layout';
import { AdsLayout } from './routes/ads-layout';

const App = () => {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/ads" replace />} />

          <Route path="/ads" element={<AdsLayout />}>
            <Route index element={<AdsListPage />} />

            <Route path=":id" element={<AdDetailsLayout />}>
              <Route index element={<AdDetailsPage />} />
              <Route path="edit" element={<div>Ad edit page</div>} />
            </Route>
          </Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
