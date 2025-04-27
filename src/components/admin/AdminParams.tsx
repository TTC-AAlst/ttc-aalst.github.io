import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { saveConfig } from '../../reducers/configReducer';
import http from '../../utils/httpClient';

export const AdminParams = () => {
  const storeParams = useTtcSelector(state => state.config.params);
  const [params, setParams] = useState(storeParams);
  const dispatch = useTtcDispatch();

  return (
    <div style={{paddingLeft: 15}}>
      <h3>Beheer Parameters</h3>
      <Button variant="outline-danger float-end me-2" onClick={() => http.post('/config/ClearCache')}>
        Clear Cache
      </Button>
      <div>Einde Seizoen? Bewaar de &quot;endOfSeason&quot; parameter (false=Seizoen bezig, true=Seizoen einde)</div>
      <span>Nieuw Seizoen? Bewaar de &quot;year&quot; parameter!</span>
      <Table size="sm" hover width="100%">
        <thead>
          <tr>
            <th style={{width: 200}}>Key</th>
            <th style={{width: "99%"}}>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(storeParams).sort((a, b) => a.localeCompare(b)).map(key => (
            <AdminParamRow
              key={key}
              propName={key}
              value={params[key]}
              onChange={value => setParams(prevState => ({...prevState, [key]: value}))}
              onSave={() => dispatch(saveConfig({key, value: params[key]}))}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

type AdminParamRowProps = {
  propName: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

const AdminParamRow = ({propName, value, onChange, onSave}: AdminParamRowProps) => (
  <tr>
    <td>{propName}:</td>
    <td>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{width: '90%', marginRight: 6}} />
      <button type="button" aria-label="Save" className="btn btn-outline-secondary btn-sm" onClick={onSave}>
        <i className="fa fa-floppy-o" />
      </button>
    </td>
  </tr>
);
