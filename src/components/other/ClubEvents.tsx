import React from 'react';
import { useTtcSelector } from "../../utils/hooks/storeHooks";
import { Strike } from "../controls/controls/Strike";

export const ClubEvents = () => {
  const eventsString = useTtcSelector(state => state.config.params.events);
  const events: string[] = JSON.parse(eventsString);

  if (!events.length) {
    return null;
  }

  return (
    <div className="col-md-12 mb-3">
      {events.map((evnt, index) => (
        <Strike key={index} text={evnt} />
      ))}
    </div>
  );
};
