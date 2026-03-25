import React from 'react';
import Slider from '@mui/material/Slider';
import AvatarEditor from 'react-avatar-editor';
import { MaterialButton } from '../Buttons/MaterialButton';
import { t } from '../../../locales';

type ImageEditorProps = {
  image: string,
  updateImage: (preview: HTMLCanvasElement) => void,
  size: {
    width: number,
    height: number,
  },
  borderRadius: number,
}

type ImageEditorState = {
  scale: number;
  borderRadius: number;
}

export default class ImageEditor extends React.Component<ImageEditorProps, ImageEditorState> {
  editor?: AvatarEditor | null;

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      borderRadius: this.props.borderRadius,
    };
  }

  render() {
    return (
      <div style={{display: 'inline-block', width: '100%'}}>
        <AvatarEditor
          ref={editor => {
            this.editor = editor;
          }}
          scale={this.state.scale}
          borderRadius={this.state.borderRadius}
          image={this.props.image}
          width={this.props.size.width}
          height={this.props.size.height}
          style={{cursor: 'hand'}}
          crossOrigin="anonymous"
        />

        <Slider
          value={this.state.scale}
          min={0.1}
          max={5}
          step={0.01}
          style={{width: '100%', marginBottom: 20, marginTop: 20}}
          onChange={(event, newScale) => this.setState({scale: newScale as number})}
        />

        <br />

        <MaterialButton
          label={t('photos.preview')}
          color="secondary"
          style={{marginBottom: 10}}
          onClick={this.onClickSave}
        />
      </div>
    );
  }

  onClickSave = () => {
    if (this.editor) {
      const canvas = this.editor.getImageScaledToCanvas();
      this.props.updateImage(canvas);

      // Also possible to get a blob:
      // this.editor.getImageScaledToCanvas().toBlob(blob => {
      //   if (blob) {
      //     const file = new File([blob], 'updatedImage.png', { type: 'image/png' });
      //   }
      // });
    }
  };
}
