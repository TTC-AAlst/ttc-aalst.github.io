import React, {Component} from 'react';
import Table from 'react-bootstrap/lib/Table';
import TextField from '@material-ui/core/TextField';
import PropTypes, {connect, withViewport} from '../PropTypes';
import {updateClub} from '../../actions/clubActions';
import AdminClubForm from './AdminClubForm';
import {EditButton} from '../controls/Buttons/EditButton';
import {IClub, Viewport, IClubLocation} from '../../models/model-interfaces';

type AdminClubsProps = {
  clubs: IClub[];
  updateClub: Function;
  viewport: Viewport;
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
        <TextField
          placeholder="Zoek club"
          onChange={e => this.setState({clubFilter: e.target.value.toLowerCase()})}
          style={{width: 150, marginLeft: 10}}
        />

        <ClubsTable
          clubs={clubs}
          onEditClub={club => this.setState({editClub: club})}
        />
      </div>
    );
  }
}


const ClubsTable = ({clubs, onEditClub}: {clubs: IClub[], onEditClub: (club: IClub) => void}) => (
  <Table condensed hover>
    <thead>
      <tr>
        <th>Club</th>
        <th className="hidden-xs">Vttl</th>
        <th className="hidden-xs">Sporta</th>
        <th>Acties</th>
      </tr>
    </thead>
    <tbody>
      {clubs.sort((a, b) => a.name.localeCompare(b.name)).map(club => (
        <tr key={club.id}>
          <td>
            <b>{club.name}</b>
            <br />
            <ClubLocation location={club.mainLocation} />
          </td>
          <td className="hidden-xs">{club.codeVttl}</td>
          <td className="hidden-xs">{club.codeSporta}</td>
          <td>
            <EditButton onClick={() => onEditClub(club)} style={{fontSize: 26}} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default withViewport(connect(() => ({}), {updateClub})(AdminClubs));


const ClubLocation = ({location}: {location: IClubLocation}) => (
  <small>
    {location.description}
    <span style={{marginLeft: 20, marginRight: 20}}>
      {location.address}, {location.city}
    </span>
    {location.mobile}
  </small>
);
