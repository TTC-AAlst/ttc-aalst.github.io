import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import { t } from '../../locales';

type QuillEditorProps = {
  text: string;
  style: React.CSSProperties;
  onChange: (text: string) => void;
  readOnly: boolean;
}

const QuillEditor = (props: QuillEditorProps) => {
  const quillRef = useRef<any>(null);
  return <Editor ref={quillRef} {...props} />;
};


type EditorRef = Quill | null;

const Editor = forwardRef<EditorRef, QuillEditorProps>(
  ({ readOnly, text, onChange, style }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<any>(text);
    const onTextChangeRef = useRef(onChange);
    // const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onChange;
      // onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const editorOptions = {
        placeholder: t('match.report.placeHolder'),
        modules: {
          toolbar: true,
        },
        theme: 'snow',
      };
      const quill = new Quill(editorContainer, editorOptions);
      if (ref) {
        if (typeof ref === 'function') {
          ref(quill);
        } else {
          (ref as React.MutableRefObject<EditorRef>).current = quill;
        }
      }

      if (textRef.current) {
        const delta = quill.clipboard.convert({html: textRef.current});
        quill.setContents(delta);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        // args contains the json delta
        onTextChangeRef.current?.(quill.root.innerHTML);
      });

      // quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      //   onSelectionChangeRef.current?.(...args);
      // });

      return () => {  
        if (ref && typeof ref !== 'function') {
          (ref as React.MutableRefObject<EditorRef>).current = null;
        }
        container.innerHTML = '';
      };
    }, [ref]);

    useEffect(() => {
      if (ref && typeof ref !== 'function') {
        ref.current?.enable(!readOnly);
      }
    }, [ref, readOnly]);

    return <div style={style} ref={containerRef} />;
  },
);

Editor.displayName = 'Editor';

export default QuillEditor;
