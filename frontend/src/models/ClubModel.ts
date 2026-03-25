import {IClub, IClubManager, IClubLocation} from './model-interfaces';

export const OwnClubId = 1;

export default class ClubModel implements IClub {
  active: boolean;
  alternativeLocations: any[];
  codeSporta: string;
  codeVttl: string;
  id: number;
  name: string;
  shower: boolean;
  website: string;
  managers: IClubManager[];
  mainLocation: IClubLocation;

  constructor(json: ClubModel) {
    this.active = json.active;
    this.alternativeLocations = json.alternativeLocations;
    this.codeSporta = json.codeSporta;
    this.codeVttl = json.codeVttl;
    this.id = json.id;
    this.mainLocation = json.mainLocation;
    this.managers = json.managers;
    this.name = json.name;
    this.shower = json.shower;
    this.website = json.website;
  }
}
