import http from '../utils/httpClient.js';
import {showSnackbar} from './configActions.js';
import trans from '../locales.js';

export function emailFormation(title, email) {
  return dispatch => http.post('/matches/WeekCompetitionEmail', {title, email})
    .then(() => {
        console.log('Email formation succesfully sent!'); // eslint-disable-line
      dispatch(showSnackbar(trans('week.formationMailed')));
    }, err => {
        console.log('Email formation!', err); // eslint-disable-line
      dispatch(showSnackbar('Fout bij versturen email!?'));
    });
}
