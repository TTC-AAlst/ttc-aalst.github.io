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
    http.upload(file, type, typeId).then(
      data => {
        if (data && data.fileName) {
          fileUploaded(data.fileName);
        }
      },
      _err => {
        // Upload failure is visible via missing image
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
