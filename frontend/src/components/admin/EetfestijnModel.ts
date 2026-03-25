export type EetfestijnModel = {
  show: boolean;
  date: string;
  hour: {
    from: string;
    to: string;
  };
  venue: {
    name: string;
    address: string;
    mapsUrl: string;
  };
  menu: EetfestijnMenu[];
  steunkaart: number;
}

export type EetfestijnMenu = {
  name: string;
  desc: string;
  price: number;
};
