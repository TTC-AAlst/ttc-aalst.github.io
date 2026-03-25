import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';
import TextField from '@mui/material/TextField';
import { connect } from 'react-redux';
import AdminClubForm from './AdminClubForm';
import {EditButton} from '../controls/Buttons/EditButton';
import {IClub, IClubLocation} from '../../models/model-interfaces';
import { frenoyClubSync, updateClub } from '../../reducers/clubsReducer';
import { RootState } from '../../store';

type AdminClubsProps = {
  clubs: IClub[];
  updateClub: Function;
  frenoyClubSync: Function;
}

type AdminClubsState = {
  clubFilter: string;
  editClub: null | IClub;
}

class AdminClubs extends Component<AdminClubsProps, AdminClubsState> {
  constructor(props) {
    super(props);
    this.state = {clubFilter: '', editClub: null};
  }

  render() {
    if (this.state.editClub) {
      return (
        <AdminClubForm
          club={this.state.editClub}
          updateClub={this.props.updateClub}
          onEnd={() => this.setState({editClub: null})}
        />
      );
    }


    let {clubs} = this.props;
    if (this.state.clubFilter) {
      clubs = clubs.filter(x => x.name.toLowerCase().includes(this.state.clubFilter));
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <TextField
            placeholder="Zoek club"
            onChange={e => this.setState({clubFilter: e.target.value.toLowerCase()})}
            style={{width: 150, marginLeft: 10}}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            style={{marginRight: 15}}
            onClick={() => this.props.frenoyClubSync()}
          >
            Frenoy Sync
          </button>
        </div>

        <ClubsTable
          clubs={clubs}
          onEditClub={club => this.setState({editClub: club})}
        />
      </div>
    );
  }
}


const ClubsTable = ({clubs, onEditClub}: {clubs: IClub[], onEditClub: (club: IClub) => void}) => (
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
      {clubs.slice().sort((a, b) => a.name.localeCompare(b.name)).map(club => (
        <tr key={club.id}>
          <td>
            <b>{club.name}</b>
            <br />
            <ClubLocation location={club.mainLocation} />
          </td>
          <td className="d-none d-sm-table-cell">{club.codeVttl}</td>
          <td className="d-none d-sm-table-cell">{club.codeSporta}</td>
          <td>
            <EditButton onClick={() => onEditClub(club)} style={{fontSize: 26}} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const mapDispatchToProps = (dispatch: any) => ({
  updateClub: (club: IClub) => dispatch(updateClub(club)),
  frenoyClubSync: () => dispatch(frenoyClubSync()),
});

export default connect((state: RootState) => ({clubs: state.clubs}), mapDispatchToProps)(AdminClubs);


const ClubLocation = ({location}: {location: IClubLocation}) => (
  <small>
    {location.description}
    <span style={{marginLeft: 20, marginRight: 20}}>
      {location.address}, {location.city}
    </span>
    {location.mobile}
  </small>
);
