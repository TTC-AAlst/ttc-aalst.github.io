import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { IClub, IClubLocation } from '../../models/model-interfaces';
import { t } from '../../locales';

type AdminClubFormProps = {
  club: IClub;
  updateClub: Function;
  onEnd: Function;
};

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
};

const LocationEditor = ({ location, onChange, onRemove, title }: LocationEditorProps) => {
  const fieldMargin = 15;
  return (
    <Card style={{ padding: 15, marginTop: 15 }}>
      <Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>{title}</h4>
          {onRemove && (
            <button className="btn btn-link btn-sm" onClick={onRemove} title="Verwijderen">
              <i className="fa fa-times" />
            </button>
          )}
        </div>
        <Form.Group style={{ width: 300, display: 'inline-block', marginRight: fieldMargin }}>
          <Form.Label>{t('Beschrijving')}</Form.Label>
          <Form.Control value={location.description} onChange={e => onChange({ ...location, description: e.target.value })} />
        </Form.Group>
        <Form.Group style={{ width: 200, display: 'inline-block', marginRight: fieldMargin }}>
          <Form.Label>{t('Telefoon')}</Form.Label>
          <Form.Control value={location.mobile} onChange={e => onChange({ ...location, mobile: e.target.value })} />
        </Form.Group>
        <br />
        <br />
        <Form.Group style={{ width: 300, display: 'inline-block', marginRight: fieldMargin }}>
          <Form.Label>{t('Adres')}</Form.Label>
          <Form.Control value={location.address} onChange={e => onChange({ ...location, address: e.target.value })} />
        </Form.Group>
        <Form.Group style={{ width: 100, display: 'inline-block', marginRight: fieldMargin }}>
          <Form.Label>{t('Postcode')}</Form.Label>
          <Form.Control value={location.postalCode} onChange={e => onChange({ ...location, postalCode: e.target.value })} />
        </Form.Group>
        <Form.Group style={{ width: 200, display: 'inline-block', marginRight: fieldMargin }}>
          <Form.Label>{t('Gemeente')}</Form.Label>
          <Form.Control value={location.city} onChange={e => onChange({ ...location, city: e.target.value })} />
        </Form.Group>
        <br />
        <br />
        <Form.Group style={{ width: 630 }}>
          <Form.Label>{t('Opmerking')}</Form.Label>
          <Form.Control as="textarea" rows={3} value={location.comment} onChange={e => onChange({ ...location, comment: e.target.value })} />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

const AdminClubForm = ({ club: initialClub, updateClub, onEnd }: AdminClubFormProps) => {
  const [club, setClub] = useState(initialClub);
  const fieldMargin = 30;

  const handleMainLocationChange = (mainLocation: IClubLocation) => {
    setClub({ ...club, mainLocation });
  };

  const handleAlternativeLocationChange = (index: number, location: IClubLocation) => {
    const alternativeLocations = [...club.alternativeLocations];
    alternativeLocations[index] = location;
    setClub({ ...club, alternativeLocations });
  };

  const handleAddAlternativeLocation = () => {
    setClub({
      ...club,
      alternativeLocations: [...club.alternativeLocations, getEmptyLocation()],
    });
  };

  const handleRemoveAlternativeLocation = (index: number) => {
    const alternativeLocations = club.alternativeLocations.filter((_, i) => i !== index);
    setClub({ ...club, alternativeLocations });
  };

  return (
    <div style={{ marginLeft: 10, marginRight: 10 }}>
      <h3>{club.name}</h3>
      <div>
        <Card style={{ padding: 15 }}>
          <Card.Body>
            <h4>Gegevens</h4>
            <Form.Group style={{ width: 200, display: 'inline-block', marginRight: fieldMargin }}>
              <Form.Label>{t('Naam')}</Form.Label>
              <Form.Control value={club.name} onChange={e => setClub({ ...club, name: e.target.value })} />
            </Form.Group>

            <Form.Group style={{ width: 300, display: 'inline-block', marginRight: fieldMargin }}>
              <Form.Label>{t('Website')}</Form.Label>
              <Form.Control value={club.website || ''} onChange={e => setClub({ ...club, website: e.target.value })} />
            </Form.Group>

            <Form.Check type="checkbox" inline checked={club.shower} onChange={() => setClub({ ...club, shower: !club.shower })} label={t('Shower')} />
          </Card.Body>
        </Card>

        <LocationEditor location={club.mainLocation} onChange={handleMainLocationChange} title="Hoofdlocatie" />

        {club.alternativeLocations.map((loc, index) => (
          <LocationEditor
            key={index}
            location={loc}
            onChange={location => handleAlternativeLocationChange(index, location)}
            onRemove={() => handleRemoveAlternativeLocation(index)}
            title={`Alternatieve locatie ${index + 1}`}
          />
        ))}

        <Button variant="outline-primary" style={{ marginTop: 15 }} onClick={handleAddAlternativeLocation}>
          Locatie toevoegen
        </Button>
      </div>
      <Button
        variant="primary"
        style={{ marginTop: 15 }}
        onClick={() => {
          updateClub(club);
          onEnd();
        }}
      >
        {t('common.save')}
      </Button>

      <Button variant="primary" style={{ marginTop: 15, marginLeft: 10 }} onClick={() => onEnd()}>
        {t('common.cancel')}
      </Button>
    </div>
  );
};

export default AdminClubForm;
