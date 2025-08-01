import React, { useState } from 'react';
import { Box, Button, Grid2, IconButton, TextField, Typography } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { t } from '../../locales';
import { saveConfig } from '../../reducers/configReducer';

export const AdminEvents = () => {
  const eventsString = useTtcSelector(state => state.config.params.events);
  const [events, setEvents] = useState<string[]>(JSON.parse(eventsString));
  const dispatch = useTtcDispatch();

  return (
    <Box sx={{ mt: 2 }}>
      <Grid2 container spacing={1}>
        <Grid2 size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>
              Beheer Events
            </h3>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setEvents([...events, ''])}
              size="small"
            >
              Voeg Event Toe
            </Button>
          </Box>
        </Grid2>

        {events.map((event, index) => (
          <>
            <Grid2 size={11} key={index} mb={1}>
              <TextField
                fullWidth
                label="Event"
                value={event}
                onChange={e => setEvents(events.map((item, i) => {
                  if (i === index) {
                    return e.target.value;
                  }
                  return item;
                }))}
              />
            </Grid2>
            <IconButton
              onClick={() => setEvents(events.filter((_, i) => i !== index))}
              color="error"
              size="small"
            >
              <Delete />
            </IconButton>
          </>
        ))}

        {events.length === 0 && (
          <Grid2 size={12}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
              Geen actieve events. Klik op &quot;Voeg Event Toe&quot; om te beginnen.
            </Typography>
          </Grid2>
        )}
      </Grid2>

      <div style={{paddingTop: 10}}>
        <MaterialButton
          variant="contained"
          label={t('common.save')}
          color="primary"
          style={{marginTop: 5}}
          onClick={() => dispatch(saveConfig({key: 'events', value: JSON.stringify(events)}))}
        />
      </div>
    </Box>
  );
};
