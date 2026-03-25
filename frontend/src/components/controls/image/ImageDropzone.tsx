import React from 'react';
import Dropzone from 'react-dropzone';
import http from '../../../utils/httpClient';
import { t } from '../../../locales';

type ImageDropzoneProps = {
  fileUploaded: Function;
  type?: string;
  typeId?: number;
};

const ImageDropzone = ({ fileUploaded, type, typeId }: ImageDropzoneProps) => {
  const onDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    console.log('uploading', files);
    http.upload(file, type, typeId).then(
      data => {
        console.log('uploaded', data);
        if (data && data.fileName) {
          fileUploaded(data.fileName);
        }
      },
      err => {
        console.error('upload fail!', err);
      },
    );
  };

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
      <Dropzone onDrop={onDrop} multiple={false}>
        {({ getRootProps, getInputProps }) => (
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
};

export default ImageDropzone;
