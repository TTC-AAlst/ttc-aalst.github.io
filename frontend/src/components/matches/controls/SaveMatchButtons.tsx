import React from 'react';
import { CommentButton } from '../../controls/Buttons/CommentButton';
import { Icon } from '../../controls/Icons/Icon';
import { SaveButton } from '../../controls/Buttons/SaveButton';
import { t } from '../../../locales';


type SaveMatchButtonsProps = {
  onSave: () => void;
  onBlock: (block: 'Captain' | 'Major') => void;
  onCommentsToggle: Function;
  canMajorBlock: boolean;
}

export const SaveMatchButtons = ({onSave, onBlock, onCommentsToggle, canMajorBlock}: SaveMatchButtonsProps) => (
  <div className="pull-right" style={{whiteSpace: 'nowrap'}}>
    <CommentButton onClick={() => onCommentsToggle()} style={{marginRight: 5}} />
    {canMajorBlock && (
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => onBlock('Major')}
        style={{marginRight: 5}}
        title={t('match.plys.tooltipSaveAndBlock')}
      >
        <Icon fa="fa fa-angle-double-up" />
      </button>
    )}
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => onBlock('Captain')}
      style={{marginRight: 5}}
      title={t('match.plys.tooltipSaveAndBlock')}
    >
      <Icon fa="fa fa-star" />
    </button>

    <SaveButton onClick={onSave} title={t('match.plys.tooltipSave')} />
  </div>
);
