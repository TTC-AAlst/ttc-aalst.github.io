import React from 'react';
import Paper from '@mui/material/Paper';

const eetfesijnStyle = {
  padding: 0,
  width: '100%',
  margin: 'auto',
};

// eslint-disable-next-line
const eetfestijnGoogleMaps = 'https://maps.google.com/maps?q=Botermelkstraat+63,+9300+Aalst&hl=en&ll=50.953115,4.061058&spn=0.009449,0.023475&sll=50.952442,4.062345&sspn=0.001188,0.002934&t=m&hnear=Botermelkstraat+63,+Aalst+9300+Aalst,+Oost-Vlaanderen,+Vlaams+Gewest,+Belgium&z=16';

const eetfestijnSets = {
  date: 'Zaterdag 28 september 2019',
  startHour: '17u30',
  endHour: '22u00',
  meat: {
    price: 17,
  },
  fish: {
    price: 17,
  },
  child: {
    price: '8,50',
  },
  support: {
    price: '2,50',
  },
};

export const Eetfestijn = () => (
  <Paper style={eetfesijnStyle}>
    <div id="eetfestijn">
      <h1 style={{fontSize: 26}}>
        Eetfestijn TTC Aalst
        <br />
        {eetfestijnSets.date}
      </h1>

      Van {eetfestijnSets.startHour} tot {eetfestijnSets.endHour} in zaal
      &nbsp;
      <a className="eetfestijn" href={eetfestijnGoogleMaps} target="_blank" rel="noopener noreferrer">Sint-Paulus</a>
      <br />
      Botermelkstraat 63, 9300 Aalst

      <br /><br />

      <table width="100%">
        <tbody>
          <tr><th colSpan={2} style={{textAlign: 'center'}}>Menu</th></tr>
          <tr>
            <td width="99%"><b>Varkenshaasje</b> met sla, tomaten<br /> en saus naar keuze</td><td width="1%">&euro;{eetfestijnSets.meat.price}</td>
          </tr>
          <tr>
            <td><b>Tongrolletjes</b></td><td>&euro;{eetfestijnSets.fish.price}</td>
          </tr>
          <tr>
            <td><b>Kindermenu</b>: kip met appelmoes</td><td>&euro;{eetfestijnSets.child.price}</td>
          </tr>
        </tbody>
      </table>

      <br />
      <span>Steunkaarten ook beschikbaar voor &euro;{eetfestijnSets.support.price}</span>
    </div>
  </Paper>
);
