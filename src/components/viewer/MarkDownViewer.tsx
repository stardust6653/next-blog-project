'use client';

import React from 'react';

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import style from './MarkDownViewer.module.css';

interface ValueProps {
  html: string;
}

const MarkDownViewer = ({ html }: ValueProps) => {
  return (
    <div className={style.container}>
      <Viewer initialValue={html} />
    </div>
  );
};

export default MarkDownViewer;
