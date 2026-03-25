import React from 'react';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';

export const GoogleMap = () => {
  const googleMapsUrl = useTtcSelector(state => state.config.params.googleMapsUrl);
  return (
    <iframe
      title="Google Maps Clublokaal"
      src={googleMapsUrl}
      frameBorder={0}
      style={{border: 0, width: '100%', height: 450}}
      allowFullScreen
    />
  );
};
