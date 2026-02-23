import React, { Component } from 'react';
import Paper from '@mui/material/Paper';

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

class ImageSponsor extends Component<ImageSponsorProps> {
  static defaultProps = {
    style: {},
    url: undefined,
  };

  render() {
    const style = this.props.big ? bottomSponsorsStyleBig : bottomSponsorsStyleSmall;
    const img = <img src={`/img/sponsors/${this.props.img}`} alt="Sponsor logo" style={imgStyle} />;
    return (
      <Paper style={{ ...style, ...this.props.style }}>
        {this.props.url ? (
          <a href={this.props.url} target="_blank" rel="noopener noreferrer">
            {img}
          </a>
        ) : (
          img
        )}
      </Paper>
    );
  }
}
