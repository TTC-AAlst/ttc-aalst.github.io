import React, {Component} from 'react';
import Paper from '@mui/material/Paper';

// export const RdInterieur = props => <ImageSponsor url="https://www.rd-interieur.be/" img="rd-interieur.png" {...props} />;
// export const BeSure2 = props => <ImageSponsor url="https://www.2besure2.be/" img="2be-sure2.png" {...props} />;
export const Itenium = props => <ImageSponsor url="https://itenium.be" img="itenium.png" {...props} />;
// export const AcademicSoftware = props => <ImageSponsor url="https://www.academicsoftware.eu" img="ACADEMIC-SOFTWARE.png" {...props} />;
// export const Bordman = props => <ImageSponsor url="https://www.bordman.be/" img="Bordman.png" {...props} />;
// export const COOLDown = props => <ImageSponsor url="https://www.facebook.com/CooldownAffligem" img="COOLDown.png" {...props} />;
// export const Geniaal = props => <ImageSponsor url="https://www.geniaal-vastgoed.be" img="Geniaal.jpg" {...props} />;
// export const RJConstruct = props => <ImageSponsor url="http://www.rjconstruct.com" img="rjconstruct.png" {...props} />;
// export const TuinenRottiers = props => <ImageSponsor url="https://www.facebook.com/Tuinen-Rottiers-708944405932087" img="Tuinen-Rottiers.png" {...props} />;
// export const EcoProject = props => <ImageSponsor url="https://eco-project.be/" img="eco-project.png" {...props} />;
// export const Woodchuck = props => <ImageSponsor url="https://woodchuck.be/" img="Woodchuck.png" {...props} />;


export const Capatt = props => <ImageSponsor url="https://www.capatt.be/" img="capatt.png" {...props} />;
export const Mijlbeek = props => <ImageSponsor url="https://www.frituur-mijlbeek.be/" img="mijlbeek.png" {...props} />;
export const HappyPlays = props => <ImageSponsor url="https://www.happyplays.be/" img="happy-plays.jpeg" {...props} />;
export const NextGenLED = props => <ImageSponsor url="https://www.nextgenerationled.be/" img="ngled.jpg" {...props} />;
export const NextGenLasers = props => <ImageSponsor img="nglasers.jpg" {...props} />;




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
}

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
      <Paper style={{...style, ...this.props.style}}>
        {this.props.url ? <a href={this.props.url} target="_blank" rel="noopener noreferrer">{img}</a> : img}
      </Paper>
    );
  }
}
