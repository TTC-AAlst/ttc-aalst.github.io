import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { saveConfig } from '../../reducers/configReducer';
import { t } from '../../locales';
import { EetfestijnModel, EetfestijnMenu } from './EetfestijnModel';
import { parseEetfestijn } from '../../utils/paramParser';

export const AdminEetfestijn = () => {
  const eetfestijnString = useTtcSelector(state => state.config.params.eetfestijn);
  const eetfestijnInitial = parseEetfestijn(eetfestijnString);
  const [eetfestijn, setEetfestijn] = useState<EetfestijnModel>(eetfestijnInitial);
  const dispatch = useTtcDispatch();

  return (
    <>
      <h3>Beheer Eetfestijn</h3>
      <Form.Check
        type="checkbox"
        inline
        checked={eetfestijn.show}
        onChange={() => setEetfestijn({ ...eetfestijn, show: !eetfestijn.show })}
        label="Eetfestijn tonen?"
      />
      {eetfestijn.show && <AdminEetfestijnForm eetfestijn={eetfestijn} setEetfestijn={setEetfestijn} />}
      <div>
        <MaterialButton
          variant="contained"
          label={t('common.save')}
          color="primary"
          style={{ marginTop: 5 }}
          onClick={() => dispatch(saveConfig({ key: 'eetfestijn', value: JSON.stringify(eetfestijn) }))}
        />
      </div>
    </>
  );
};

type AdminEetfestijnFormProps = {
  eetfestijn: EetfestijnModel;
  setEetfestijn: React.Dispatch<React.SetStateAction<EetfestijnModel>>;
};

const AdminEetfestijnForm = ({ eetfestijn, setEetfestijn }: AdminEetfestijnFormProps) => {
  const updateMenu = (menuIndex: number, menuItem: Partial<EetfestijnMenu>) => {
    const newMenu = eetfestijn.menu.map((item, i) => {
      if (i === menuIndex) {
        return { ...item, ...menuItem };
      }
      return item;
    });
    setEetfestijn({ ...eetfestijn, menu: newMenu });
  };

  return (
    <div className="mt-2">
      <Row className="g-3">
        <Col xs={12} md={4}>
          <Form.Group>
            <Form.Label>Datum</Form.Label>
            <Form.Control type="date" value={eetfestijn.date} onChange={e => setEetfestijn({ ...eetfestijn, date: e.target.value })} />
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group>
            <Form.Label>Van</Form.Label>
            <Form.Control
              type="time"
              value={eetfestijn.hour.from}
              onChange={e => setEetfestijn({ ...eetfestijn, hour: { ...eetfestijn.hour, from: e.target.value } })}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group>
            <Form.Label>Tot</Form.Label>
            <Form.Control
              type="time"
              value={eetfestijn.hour.to}
              onChange={e => setEetfestijn({ ...eetfestijn, hour: { ...eetfestijn.hour, to: e.target.value } })}
            />
          </Form.Group>
        </Col>

        {/* Venue */}
        <Col xs={12}>
          <h6 className="mt-2 mb-1">Locatie</h6>
        </Col>
        <Col xs={12} sm={4}>
          <Form.Group>
            <Form.Label>Naam van de locatie</Form.Label>
            <Form.Control
              value={eetfestijn.venue.name}
              onChange={e => setEetfestijn({ ...eetfestijn, venue: { ...eetfestijn.venue, name: e.target.value } })}
            />
          </Form.Group>
        </Col>
        <Col xs={12} sm={8}>
          <Form.Group>
            <Form.Label>Adres</Form.Label>
            <Form.Control
              value={eetfestijn.venue.address}
              onChange={e => setEetfestijn({ ...eetfestijn, venue: { ...eetfestijn.venue, address: e.target.value } })}
            />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group>
            <Form.Label>Google Maps URL</Form.Label>
            <Form.Control
              value={eetfestijn.venue.mapsUrl}
              onChange={e => setEetfestijn({ ...eetfestijn, venue: { ...eetfestijn.venue, mapsUrl: e.target.value } })}
            />
          </Form.Group>
        </Col>

        {/* Menu */}
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center mt-2 mb-1">
            <h6>Menu Items</h6>
            <Button variant="primary" size="sm" onClick={() => setEetfestijn({ ...eetfestijn, menu: [...eetfestijn.menu, { name: '', desc: '', price: 0 }] })}>
              <i className="fa fa-plus" /> Voeg Item Toe
            </Button>
          </div>
        </Col>

        {eetfestijn.menu.map((item, index) => (
          <Col xs={12} key={index}>
            <Card style={{ padding: 8, marginBottom: 4 }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Menu Item {index + 1}</strong>
                  <button className="btn btn-link btn-sm" onClick={() => setEetfestijn({ ...eetfestijn, menu: eetfestijn.menu.filter((_, i) => i !== index) })}>
                    <i className="fa fa-trash-o text-danger" />
                  </button>
                </div>

                <Row className="g-2">
                  <Col xs={12} md={3}>
                    <Form.Group>
                      <Form.Label>Naam</Form.Label>
                      <Form.Control value={item.name} onChange={e => updateMenu(index, { name: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={7}>
                    <Form.Group>
                      <Form.Label>Beschrijving</Form.Label>
                      <Form.Control value={item.desc} onChange={e => updateMenu(index, { desc: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={2}>
                    <Form.Group>
                      <Form.Label>Prijs (&euro;)</Form.Label>
                      <Form.Control
                        type="number"
                        value={item.price}
                        onChange={e => updateMenu(index, { price: parseFloat(e.target.value) || 0 })}
                        min={0}
                        step={0.01}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Steunkaart */}
        <Col xs={12}>
          <h6 className="mt-2 mb-1">Steunkaart</h6>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Form.Group>
            <Form.Label>Steunkaart Prijs (&euro;)</Form.Label>
            <Form.Control
              type="number"
              value={eetfestijn.steunkaart}
              onChange={e => setEetfestijn({ ...eetfestijn, steunkaart: parseFloat(e.target.value) || 0 })}
              min={0}
              step={0.01}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};
