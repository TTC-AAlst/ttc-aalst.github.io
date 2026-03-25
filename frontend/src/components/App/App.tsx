import React, { Suspense, useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { Header } from '../skeleton/Header/Header';
import { Footer } from '../skeleton/Footer/Footer';
import { FullScreenSpinner } from '../controls/controls/Spinner';
import { useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { clearSnackbar } from '../../reducers/configReducer';
import { ErrorBoundary } from './ErrorBoundary';

import './App.scss';

export const App = ({ Component }: { Component: React.ComponentType }) => {
  const config = useTtcSelector(state => state.config);
  const dispatch = useTtcDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);

  useEffect(() => {
    if (location.search.startsWith('?/')) {
      navigate(location.search.substring(2));
    }
  }, [navigate, location.search]);

  if (config.initialLoad !== 'done') {
    return <FullScreenSpinner />;
  }

  const containerStyle: React.CSSProperties = { width: undefined };
  const isBigTodayMatches = config.settings.container100PerWidth;
  if (isBigTodayMatches) {
    containerStyle.width = '100%';
    containerStyle.maxWidth = '100%';
    containerStyle.paddingLeft = 12;
    containerStyle.paddingRight = 12;
  }

  return (
    <div id="react">
      <div style={{ height: '100%' }}>
        <div className="wrapper">
          <Header navOpen={navOpen} setNavOpen={setNavOpen} />
          <Container style={containerStyle} ref={ref}>
            <ErrorBoundary>
              <Suspense fallback={<FullScreenSpinner />}>
                <Component />
              </Suspense>
            </ErrorBoundary>
          </Container>
          <div className="push" />
        </div>
        {!isBigTodayMatches ? <Footer /> : null}
        <ToastContainer position="bottom-start" className="p-3">
          <Toast show={!!config.snackbar} onClose={() => dispatch(clearSnackbar())} delay={3000} autohide bg="dark">
            <Toast.Body className="text-white d-flex justify-content-between align-items-center">
              {config.snackbar}
              <button type="button" className="btn-close btn-close-white ms-2" aria-label="close" onClick={() => dispatch(clearSnackbar())} />
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
};
