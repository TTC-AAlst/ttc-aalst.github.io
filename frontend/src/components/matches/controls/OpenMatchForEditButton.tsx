import React from 'react';
import {EditIcon} from '../../controls/Icons/EditIcon';
import {IMatch} from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { MatchBlock } from '../Match/MatchBlock';

type OpenMatchForEditButtonProps = {
  onClick: () => void;
  match: IMatch;
}

export const OpenMatchForEditButton = ({onClick, match}: OpenMatchForEditButtonProps) => (
  <button
    type="button"
    tabIndex={0}
    onClick={onClick}
    className="btn btn-outline-secondary pull-right"
    style={{marginRight: 5}}
    title={t('match.plys.tooltipOpenForm')}
  >
    <span className="fa-stack fa-sm">
      {!match.block ? (
        <EditIcon />
      ) : (
        <MatchBlock block={match.block} displayNonBlocked />
      )}
    </span>
  </button>
);
