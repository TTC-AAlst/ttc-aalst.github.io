import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { t } from '../../locales';

const divStyle: CSSProperties = {
  marginTop: 60,
  marginBottom: 60,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
};

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={divStyle}>
      <div style={{ fontSize: 120, marginBottom: 20 }}>🏓</div>

      <h1 style={{ fontSize: 72, fontWeight: 'bold', color: '#D32F2F', marginBottom: 10, marginTop: 0 }}>404</h1>

      <h2 style={{ fontSize: 28, marginBottom: 10, color: '#333' }}>{t('notFound.title')}</h2>

      <p style={{ fontSize: 18, color: '#666', marginBottom: 40, maxWidth: 500 }}>{t('notFound.description')}</p>

      <div style={{ display: 'flex', gap: 15 }}>
        <Button variant="primary" onClick={() => navigate('/')}>
          {t('notFound.goHome')}
        </Button>

        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          {t('notFound.goBack')}
        </Button>
      </div>
    </div>
  );
};
