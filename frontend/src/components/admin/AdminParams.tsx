import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { saveConfig } from '../../reducers/configReducer';
import http from '../../utils/httpClient';
import { useViewport } from '../../utils/hooks/useViewport';
import { ButtonStack } from '../controls/Buttons/ButtonStack';
import { AdminEetfestijn } from './AdminEetfestijn';
import { AdminEvents } from './AdminEvents';

const nonDefaultParams = ['eetfestijn', 'events'];

type Pages = 'params' | 'eetfestijn' | 'events';

const viewsConfig = [
  { key: 'params', text: 'Parameters' },
  { key: 'eetfestijn', text: 'Eetfestijn' },
  { key: 'events', text: 'Events' },
];

export const AdminParams = () => {
  const [filter, setFilter] = useState<Pages>('params');
  const viewport = useViewport();

  let content: any;
  switch (filter) {
    case 'eetfestijn':
      content = <AdminEetfestijn />;
      break;
    case 'events':
      content = <AdminEvents />;
      break;
    default:
      content = <AdminParamsSimple />;
      break;
  }

  return (
    <div style={{padding: 15}}>
      <ButtonStack
        config={viewsConfig}
        small={viewport.width < 550}
        activeView={filter}
        onClick={newFilter => setFilter(newFilter as Pages)}
      />
      <div style={{marginTop: 15}}>
        {content}
      </div>
    </div>
  );
};

export const AdminParamsSimple = () => {
  const storeParams = useTtcSelector(state => state.config.params);
  const [params, setParams] = useState(storeParams);
  const dispatch = useTtcDispatch();

  return (
    <>
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
          {Object.keys(storeParams).filter(x => !nonDefaultParams.includes(x)).sort((a, b) => a.localeCompare(b)).map(key => (
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
    </>
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
