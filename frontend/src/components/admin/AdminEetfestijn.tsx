import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Box, Button, Grid2, IconButton, Paper, TextField, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
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
      <Checkbox
        checked={eetfestijn.show}
        onChange={() => setEetfestijn({...eetfestijn, show: !eetfestijn.show})}
        value="show"
      />
      Eetfestijn tonen?

      {eetfestijn.show && <AdminEetfestijnForm eetfestijn={eetfestijn} setEetfestijn={setEetfestijn} />}

      <div>
        <MaterialButton
          variant="contained"
          label={t('common.save')}
          color="primary"
          style={{marginTop: 5}}
          onClick={() => dispatch(saveConfig({key: 'eetfestijn', value: JSON.stringify(eetfestijn)}))}
        />
      </div>
    </>
  );
};


type AdminEetfestijnFormProps = {
  eetfestijn: EetfestijnModel;
  setEetfestijn: React.Dispatch<React.SetStateAction<EetfestijnModel>>;
}

const AdminEetfestijnForm = ({ eetfestijn, setEetfestijn }: AdminEetfestijnFormProps) => {
  const updateMenu = (menuIndex: number, menuItem: Partial<EetfestijnMenu>) => {
    const newMenu = eetfestijn.menu.map((item, i) => {
      if (i === menuIndex) {
        return {...item, ...menuItem};
      }
      return item;
    });
    setEetfestijn({...eetfestijn, menu: newMenu});
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Datum"
            type="date"
            value={eetfestijn.date}
            onChange={e => setEetfestijn({...eetfestijn, date: e.target.value})}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Van"
            type="time"
            value={eetfestijn.hour.from}
            onChange={e => setEetfestijn({...eetfestijn, hour: {...eetfestijn.hour, from: e.target.value}})}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Tot"
            type="time"
            value={eetfestijn.hour.to}
            onChange={e => setEetfestijn({...eetfestijn, hour: {...eetfestijn.hour, to: e.target.value}})}
          />
        </Grid2>

        {/* Venue */}
        <Grid2 size={12}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Locatie
          </Typography>
        </Grid2>
        <Grid2 size={{xs: 12, sm: 4}}>
          <TextField
            fullWidth
            label="Naam van de locatie"
            value={eetfestijn.venue.name}
            onChange={e => setEetfestijn({...eetfestijn, venue: {...eetfestijn.venue, name: e.target.value}})}
          />
        </Grid2>
        <Grid2 size={{xs: 12, sm: 8}}>
          <TextField
            fullWidth
            label="Adres"
            value={eetfestijn.venue.address}
            onChange={e => setEetfestijn({...eetfestijn, venue: {...eetfestijn.venue, address: e.target.value}})}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            fullWidth
            label="Google Maps URL"
            value={eetfestijn.venue.mapsUrl}
            onChange={e => setEetfestijn({...eetfestijn, venue: {...eetfestijn.venue, mapsUrl: e.target.value}})}
          />
        </Grid2>

        {/* Menu */}
        <Grid2 size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
            <Typography variant="h6">
              Menu Items
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setEetfestijn({...eetfestijn, menu: [...eetfestijn.menu, { name: '', desc: '', price: 0 }]})}
              size="small"
            >
              Voeg Item Toe
            </Button>
          </Box>
        </Grid2>

        {eetfestijn.menu.map((item, index) => (
          <Grid2 size={12} key={index}>
            <Paper sx={{ p: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Menu Item {index + 1}
                </Typography>
                <IconButton
                  onClick={() => setEetfestijn({...eetfestijn, menu: eetfestijn.menu.filter((_, i) => i !== index)})}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>

              <Grid2 container spacing={2}>
                <Grid2 size={{xs: 12, md: 3}}>
                  <TextField
                    fullWidth
                    label="Naam"
                    value={item.name}
                    onChange={e => updateMenu(index, {name: e.target.value})}
                  />
                </Grid2>
                <Grid2 size={{xs: 12, md: 7}}>
                  <TextField
                    fullWidth
                    label="Beschrijving"
                    value={item.desc}
                    onChange={e => updateMenu(index, {desc: e.target.value})}
                  />
                </Grid2>
                <Grid2 size={{xs: 12, md: 2}}>
                  <TextField
                    fullWidth
                    label="Prijs (€)"
                    type="number"
                    value={item.price}
                    onChange={e => updateMenu(index, {price: parseFloat(e.target.value) || 0})}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid2>
              </Grid2>
            </Paper>
          </Grid2>
        ))}

        {/* Steunkaart */}
        <Grid2 size={12}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Steunkaart
          </Typography>
        </Grid2>
        <Grid2 size={{xs: 12, sm: 6, md: 3}}>
          <TextField
            label="Steunkaart Prijs (€)"
            type="number"
            value={eetfestijn.steunkaart}
            onChange={e => setEetfestijn({...eetfestijn, steunkaart: parseFloat(e.target.value) || 0})}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};
