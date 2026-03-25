import React, {Component} from 'react';
import { t } from '../../../locales';

import './CookieNotice.css';

export class CookieNotice extends Component {
  render() {
    if (localStorage.getItem('cookieNoticeKilled')) {
      return null;
    }

    return (
      <div className="cookie-notice">
        {t('footer.cookieNotice')}
        <button
          type="button"
          className="btn btn-link"
          style={{marginLeft: 8}}
          onClick={e => this._killCookieNotice(e)}
        >
          {t('footer.cookieNoticeClose')}
        </button>
      </div>
    );
  }

  _killCookieNotice(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    localStorage.setItem('cookieNoticeKilled', "true");
    this.forceUpdate();
  }
}
