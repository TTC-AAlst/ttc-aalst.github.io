/* eslint-disable react/no-string-refs */
import React from 'react';
import Slider from '@mui/material/Slider';
import AvatarEditor from 'react-avatar-editor';
import {MaterialButton} from '../Buttons/MaterialButton';
import { t } from '../../../locales';

// TODO: Check to replace with: http://blog.mmcfarland.net/react-darkroom/

type ImageEditorProps = {
  image: string,
  updateImage: Function,
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
  editor: any;

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      borderRadius: this.props.borderRadius,
    };
  }

  setEditorRef = editor => {
    this.editor = editor;
  };

  render() {
    return (
      <div style={{display: 'inline-block', width: '100%'}}>
        <AvatarEditor
          ref={this.setEditorRef}
          scale={this.state.scale}
          borderRadius={this.state.borderRadius}
          image={this.props.image}
          style={{width: this.props.size.width, height: this.props.size.height, cursor: 'hand'}}
          crossOrigin="anonymous"
        />

        <Slider
          value={this.state.scale}
          min={0.1}
          max={5}
          step={0.01}
          style={{width: 230, marginBottom: 20, marginTop: 20}}
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
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage();

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      // const canvasScaled = this.editor.getImageScaledToCanvas();
      this.props.updateImage(canvas, {});
    }
  };
}
