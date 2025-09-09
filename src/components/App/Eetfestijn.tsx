import React from 'react';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import { useTtcSelector } from '../../utils/hooks/storeHooks';
import { EetfestijnModel } from '../admin/EetfestijnModel';
import { parseEetfestijn } from '../../utils/paramParser';

const eetfestijnStyle = {
  padding: 0,
  width: '100%',
  margin: 'auto',
  marginLeft: 5,
  marginBottom: 16,
};


export const Eetfestijn = () => {
  const eetfestijnString = useTtcSelector(state => state.config.params.eetfestijn);
  if (!eetfestijnString) {
    return null;
  }

  const eetfestijn: EetfestijnModel = parseEetfestijn(eetfestijnString);
  if (!eetfestijn.show) {
    return null;
  }

  return (
    <Paper style={eetfestijnStyle}>
      <div id="eetfestijn">
        <h1 style={{fontSize: 26}}>
          Eetfestijn TTC Aalst
          <br />
          {moment(eetfestijn.date).format('ddd DD MMMM YYYY')}
        </h1>

        Van {eetfestijn.hour.from} tot {eetfestijn.hour.to} in zaal
        &nbsp;
        <a className="eetfestijn" href={eetfestijn.venue.mapsUrl} target="_blank" rel="noopener noreferrer">
          {eetfestijn.venue.name}
        </a>
        <br />
        {eetfestijn.venue.address}

        <br /><br />

        <table width="100%">
          <tbody>
            <tr><th colSpan={2} style={{textAlign: 'center'}}>Menu</th></tr>
            {eetfestijn.menu.map(menu => (
              <tr key={menu.name}>
                <td width="99%">
                  <b>{menu.name}</b>
                  &nbsp;{menu.desc}
                </td>
                <td width="1%">&euro;{menu.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {eetfestijn.steunkaart > 0 && (
          <>
            <br />
            <span>Steunkaarten ook beschikbaar voor &euro;{eetfestijn.steunkaart}</span>
          </>
        )}
      </div>
    </Paper>
  );
};
