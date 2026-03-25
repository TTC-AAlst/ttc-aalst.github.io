import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import {MaterialButton} from '../controls/Buttons/MaterialButton';
import {IClub, IClubLocation} from '../../models/model-interfaces';
import { t } from '../../locales';

type AdminClubFormProps = {
  club: IClub;
  updateClub: Function;
  onEnd: Function;
}

const getEmptyLocation = (): IClubLocation => ({
  id: 0,
  description: '',
  address: '',
  postalCode: '',
  city: '',
  mobile: '',
  comment: '',
});

type LocationEditorProps = {
  location: IClubLocation;
  onChange: (location: IClubLocation) => void;
  onRemove?: () => void;
  title: string;
}

const LocationEditor = ({location, onChange, onRemove, title}: LocationEditorProps) => {
  const fieldMargin = 15;
  return (
    <Paper style={{padding: 15, marginTop: 15}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h4>{title}</h4>
        {onRemove && (
          <IconButton onClick={onRemove} size="small" title="Verwijderen">
            <i className="fa fa-times" />
          </IconButton>
        )}
      </div>
      <TextField
        style={{width: 300, marginRight: fieldMargin}}
        label={t('Beschrijving')}
        value={location.description}
        onChange={e => onChange({...location, description: e.target.value})}
      />
      <TextField
        style={{width: 200, marginRight: fieldMargin}}
        label={t('Telefoon')}
        value={location.mobile}
        onChange={e => onChange({...location, mobile: e.target.value})}
      />
      <br />
      <br />
      <TextField
        style={{width: 300, marginRight: fieldMargin}}
        label={t('Adres')}
        value={location.address}
        onChange={e => onChange({...location, address: e.target.value})}
      />
      <TextField
        style={{width: 100, marginRight: fieldMargin}}
        label={t('Postcode')}
        value={location.postalCode}
        onChange={e => onChange({...location, postalCode: e.target.value})}
      />
      <TextField
        style={{width: 200, marginRight: fieldMargin}}
        label={t('Gemeente')}
        value={location.city}
        onChange={e => onChange({...location, city: e.target.value})}
      />
      <br />
      <br />
      <TextField
        style={{width: 630}}
        label={t('Opmerking')}
        value={location.comment}
        onChange={e => onChange({...location, comment: e.target.value})}
        multiline
        rows={3}
      />
    </Paper>
  );
};

const AdminClubForm = ({club: initialClub, updateClub, onEnd}: AdminClubFormProps) => {
  const [club, setClub] = useState(initialClub);
  const fieldMargin = 30;

  const handleMainLocationChange = (mainLocation: IClubLocation) => {
    setClub({...club, mainLocation});
  };

  const handleAlternativeLocationChange = (index: number, location: IClubLocation) => {
    const alternativeLocations = [...club.alternativeLocations];
    alternativeLocations[index] = location;
    setClub({...club, alternativeLocations});
  };

  const handleAddAlternativeLocation = () => {
    setClub({
      ...club,
      alternativeLocations: [...club.alternativeLocations, getEmptyLocation()],
    });
  };

  const handleRemoveAlternativeLocation = (index: number) => {
    const alternativeLocations = club.alternativeLocations.filter((_, i) => i !== index);
    setClub({...club, alternativeLocations});
  };

  return (
    <div style={{marginLeft: 10, marginRight: 10}}>
      <h3>{club.name}</h3>
      <div>
        <Paper style={{padding: 15}}>
          <h4>Gegevens</h4>
          <TextField
            style={{width: 200, marginRight: fieldMargin}}
            label={t('Naam')}
            value={club.name}
            onChange={e => setClub({...club, name: e.target.value})}
          />

          <TextField
            style={{width: 300, marginRight: fieldMargin}}
            label={t('Website')}
            value={club.website || ''}
            onChange={e => setClub({...club, website: e.target.value})}
          />

          <Checkbox
            checked={club.shower}
            onChange={() => setClub({...club, shower: !club.shower})}
            value="hasShower"
          />
          {t('Shower')}
        </Paper>

        <LocationEditor
          location={club.mainLocation}
          onChange={handleMainLocationChange}
          title="Hoofdlocatie"
        />

        {club.alternativeLocations.map((loc, index) => (
          <LocationEditor
            key={index}
            location={loc}
            onChange={location => handleAlternativeLocationChange(index, location)}
            onRemove={() => handleRemoveAlternativeLocation(index)}
            title={`Alternatieve locatie ${index + 1}`}
          />
        ))}

        <MaterialButton
          variant="outlined"
          label="Locatie toevoegen"
          style={{marginTop: 15}}
          onClick={handleAddAlternativeLocation}
        />
      </div>
      <MaterialButton
        variant="contained"
        label={t('common.save')}
        color="primary"
        style={{marginTop: 15}}
        onClick={() => {
          updateClub(club);
          onEnd();
        }}
      />

      <MaterialButton
        variant="contained"
        label={t('common.cancel')}
        style={{marginTop: 15, marginLeft: 10}}
        onClick={() => onEnd()}
      />
    </div>
  );
};

export default AdminClubForm;
