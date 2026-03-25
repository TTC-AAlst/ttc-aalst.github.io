import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import AvatarEditor, { type AvatarEditorRef } from 'react-avatar-editor';
import { MaterialButton } from '../Buttons/MaterialButton';
import { t } from '../../../locales';

type ImageEditorProps = {
  image: string;
  updateImage: (preview: HTMLCanvasElement) => void;
  size: {
    width: number;
    height: number;
  };
  borderRadius: number;
};

const ImageEditor = ({ image, updateImage, size, borderRadius }: ImageEditorProps) => {
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditorRef | null>(null);

  const onClickSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      updateImage(canvas);
    }
  };

  return (
    <div style={{ display: 'inline-block', width: '100%' }}>
      <AvatarEditor
        ref={editorRef}
        scale={scale}
        borderRadius={borderRadius}
        image={image}
        width={size.width}
        height={size.height}
        style={{ cursor: 'hand' }}
        crossOrigin="anonymous"
      />

      <Form.Range
        value={scale}
        min={0.1}
        max={5}
        step={0.01}
        style={{ width: '100%', marginBottom: 20, marginTop: 20 }}
        onChange={e => setScale(parseFloat(e.target.value))}
      />

      <br />

      <MaterialButton label={t('photos.preview')} color="secondary" style={{ marginBottom: 10 }} onClick={onClickSave} />
    </div>
  );
};

export default ImageEditor;
