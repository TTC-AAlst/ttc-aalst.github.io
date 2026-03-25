 
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import http from '../../../utils/httpClient';
import { t } from '../../../locales';

type ImageDropzoneProps = {
  fileUploaded: Function;
  type?: string;
  typeId?: number;
}

export default class ImageDropzone extends Component<ImageDropzoneProps> {
  _onDrop(files: File[]) {
    const self = this;
    console.log('uploading', files);
    http.upload(files[0], this.props.type, this.props.typeId)
      .then(data => {
        console.log('uploaded', data);
        if (data && data.fileName) {
          self.props.fileUploaded(data.fileName);
        }
      }, err => {
        console.error('upload fail!', err);  
      });
  }

  render() {
    const style: React.CSSProperties = {
      width: 250,
      height: 55,
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5,
      padding: 5,
    };

    return (
      <div style={style}>
        <Dropzone onDrop={files => this._onDrop(files)} multiple={false}>
          {({getRootProps, getInputProps}) => (
            <section className="clickable">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {t('photos.uploadNewInstructions')}
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    );
  }
}
