import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import AdminClubForm from './AdminClubForm';
import { EditButton } from '../controls/Buttons/EditButton';
import { IClub, IClubLocation } from '../../models/model-interfaces';
import { frenoyClubSync, updateClub } from '../../reducers/clubsReducer';
import { useTtcSelector, useTtcDispatch } from '../../utils/hooks/storeHooks';

const AdminClubs = () => {
  const dispatch = useTtcDispatch();
  const allClubs = useTtcSelector(state => state.clubs);
  const [clubFilter, setClubFilter] = useState('');
  const [editClub, setEditClub] = useState<null | IClub>(null);

  if (editClub) {
    return <AdminClubForm club={editClub} updateClub={(club: IClub) => dispatch(updateClub(club))} onEnd={() => setEditClub(null)} />;
  }

  let clubs = allClubs;
  if (clubFilter) {
    clubs = clubs.filter(x => x.name.toLowerCase().includes(clubFilter));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Form.Control placeholder="Zoek club" onChange={e => setClubFilter(e.target.value.toLowerCase())} style={{ width: 150, marginLeft: 10 }} />
        <button type="button" className="btn btn-outline-secondary" style={{ marginRight: 15 }} onClick={() => dispatch(frenoyClubSync())}>
          Frenoy Sync
        </button>
      </div>

      <ClubsTable clubs={clubs} onEditClub={club => setEditClub(club)} />
    </div>
  );
};

const ClubsTable = ({ clubs, onEditClub }: { clubs: IClub[]; onEditClub: (club: IClub) => void }) => (
  <Table size="sm" hover>
    <thead>
      <tr>
        <th>Club</th>
        <th className="d-none d-sm-table-cell">Vttl</th>
        <th className="d-none d-sm-table-cell">Sporta</th>
        <th>Acties</th>
      </tr>
    </thead>
    <tbody>
      {clubs
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(club => (
          <tr key={club.id}>
            <td>
              <b>{club.name}</b>
              <br />
              <ClubLocation location={club.mainLocation} />
            </td>
            <td className="d-none d-sm-table-cell">{club.codeVttl}</td>
            <td className="d-none d-sm-table-cell">{club.codeSporta}</td>
            <td>
              <EditButton onClick={() => onEditClub(club)} style={{ fontSize: 26 }} />
            </td>
          </tr>
        ))}
    </tbody>
  </Table>
);

export default AdminClubs;

const ClubLocation = ({ location }: { location: IClubLocation }) => (
  <small>
    {location.description}
    <span style={{ marginLeft: 20, marginRight: 20 }}>
      {location.address}, {location.city}
    </span>
    {location.mobile}
  </small>
);
