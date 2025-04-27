import React, { useState } from 'react';
import { ButtonStack } from '../controls/Buttons/ButtonStack';
import { Icon } from '../controls/Icons/Icon';
import { useTtcSelector } from '../../utils/hooks/storeHooks';
import { config } from '../../config';

const AdminDev = () => {
  const storeState = useTtcSelector(state => state);
  const [filter, setFilter] = useState('matches');

  const viewsConfig = Object.keys(storeState).map(key => ({ key, text: key }));
  const data = storeState[filter];
  return (
    <div style={{padding: 5}}>
      <div className="pull-right">
        <a href="https://itenium-test.synology.me:1709" target="_blank" rel="noopener noreferrer">Goto TabT test site</a>
        <br />
        <a href={`${config.backend}/api/config/Log/Get`} target="_blank" rel="noopener noreferrer">Goto log dump</a>
      </div>
      <ButtonStack
        config={viewsConfig}
        small={false}
        activeView={filter}
        onClick={newFilter => setFilter(newFilter)}
      />

      <AdminStateDisplayer data={data} />
    </div>
  );
};


const AdminStateDisplayer = ({data}: {data: any}) => {
  const [filter, setFilter] = useState('');

  let filteredData = data;
  if (filter) {
    if (filteredData.length) {
      filteredData = filteredData.filter(entry => JSON.stringify(entry).toLowerCase().includes(filter));
    }
  }

  return (
    <div style={{padding: 5}}>
      <div>
        <Icon fa="fa fa-search" />
        &nbsp;
        <input type="text" width={150} onChange={e => setFilter(e.target.value.toLowerCase())} />
        {filteredData.length ? <span style={{marginLeft: 10}}>Records: {data.length}</span> : null}
      </div>
      <pre style={{marginTop: 20}}>{JSON.stringify(filteredData, null, 4)}</pre>
    </div>
  );
};

export default AdminDev;
