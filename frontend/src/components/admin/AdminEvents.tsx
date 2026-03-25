import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { t } from '../../locales';
import { saveConfig } from '../../reducers/configReducer';
import { parseEvents } from '../../utils/paramParser';

export const AdminEvents = () => {
  const eventsString = useTtcSelector(state => state.config.params.events);
  const [events, setEvents] = useState<string[]>(parseEvents(eventsString));
  const dispatch = useTtcDispatch();

  return (
    <div className="mt-2">
      <Row className="g-1">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h3>Beheer Events</h3>
            <Button variant="primary" size="sm" onClick={() => setEvents([...events, ''])}>
              <i className="fa fa-plus" /> Voeg Event Toe
            </Button>
          </div>
        </Col>

        {events.map((event, index) => (
          <React.Fragment key={index}>
            <Col xs={11} className="mb-1">
              <Form.Group>
                <Form.Label>Event</Form.Label>
                <Form.Control
                  value={event}
                  onChange={e =>
                    setEvents(
                      events.map((item, i) => {
                        if (i === index) {
                          return e.target.value;
                        }
                        return item;
                      }),
                    )
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={1} className="d-flex align-items-end mb-1">
              <button className="btn btn-link btn-sm" onClick={() => setEvents(events.filter((_, i) => i !== index))}>
                <i className="fa fa-trash-o text-danger" />
              </button>
            </Col>
          </React.Fragment>
        ))}

        {events.length === 0 && (
          <Col xs={12}>
            <p className="text-muted small" style={{ textAlign: 'center', paddingTop: 4, paddingBottom: 4 }}>
              Geen actieve events. Klik op &quot;Voeg Event Toe&quot; om te beginnen.
            </p>
          </Col>
        )}
      </Row>

      <div style={{ paddingTop: 10 }}>
        <MaterialButton
          variant="contained"
          label={t('common.save')}
          color="primary"
          style={{ marginTop: 5 }}
          onClick={() => dispatch(saveConfig({ key: 'events', value: JSON.stringify(events) }))}
        />
      </div>
    </div>
  );
};
