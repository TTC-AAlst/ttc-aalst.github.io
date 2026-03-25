import React, { useState } from 'react';
import { t } from '../../../locales';

import './CookieNotice.css';

export const CookieNotice = () => {
  const [killed, setKilled] = useState(() => !!localStorage.getItem('cookieNoticeKilled'));

  if (killed) {
    return null;
  }

  const killCookieNotice = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    localStorage.setItem('cookieNoticeKilled', 'true');
    setKilled(true);
  };

  return (
    <div className="cookie-notice">
      {t('footer.cookieNotice')}
      <button type="button" className="btn btn-link" style={{ marginLeft: 8 }} onClick={killCookieNotice}>
        {t('footer.cookieNoticeClose')}
      </button>
    </div>
  );
};
