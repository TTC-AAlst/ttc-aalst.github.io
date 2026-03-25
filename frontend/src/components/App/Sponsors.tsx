import React from 'react';
import Card from 'react-bootstrap/Card';

type SponsorWrapperProps = Omit<ImageSponsorProps, 'img'> & Partial<Pick<ImageSponsorProps, 'img'>>;

export const Itenium = (props: SponsorWrapperProps) => <ImageSponsor url="https://itenium.be" img="itenium.png" {...props} />;
export const Capatt = (props: SponsorWrapperProps) => <ImageSponsor url="https://www.capatt.be/" img="capatt.png" {...props} />;
export const Mijlbeek = (props: SponsorWrapperProps) => <ImageSponsor url="https://www.frituur-mijlbeek.be/" img="mijlbeek.png" {...props} />;
export const HappyPlays = (props: SponsorWrapperProps) => <ImageSponsor url="https://www.happyplays.be/" img="happy-plays.jpeg" {...props} />;
export const NextGenLED = (props: SponsorWrapperProps) => <ImageSponsor url="https://www.nextgenerationled.be/" img="ngled.jpg" {...props} />;
export const NextGenLasers = (props: SponsorWrapperProps) => <ImageSponsor img="nglasers.jpg" {...props} />;

const bottomSponsorsStyleBig: React.CSSProperties = {
  padding: 5,
  textAlign: 'center',
  display: 'inline-block',
};

const bottomSponsorsStyleSmall: React.CSSProperties = {
  padding: 15,
  width: '100%',
  textAlign: 'center',
  margin: 'auto',
};

type ImageSponsorProps = {
  big: boolean;
  url?: string;
  img: string;
  style?: React.CSSProperties;
};

const imgStyle = {
  maxWidth: '100%',
};

const ImageSponsor = ({ big, url, img, style = {} }: ImageSponsorProps) => {
  const containerStyle = big ? bottomSponsorsStyleBig : bottomSponsorsStyleSmall;
  const imgEl = <img src={`/img/sponsors/${img}`} alt="Sponsor logo" style={imgStyle} />;
  return (
    <Card style={{ ...containerStyle, ...style }}>
      <Card.Body style={{ padding: 0 }}>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {imgEl}
          </a>
        ) : (
          imgEl
        )}
      </Card.Body>
    </Card>
  );
};
