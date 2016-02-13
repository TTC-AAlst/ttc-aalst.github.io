import React, { PropTypes, Component } from 'react';
import MatchModel, { matchOutcome } from '../../models/MatchModel.js';

import { contextTypes } from '../../utils/decorators/withContext.js';
import cn from 'classnames';

function getClassName(scoreType) {
  switch (scoreType) {
  case matchOutcome.Won:
    return 'label-info';
  case matchOutcome.Draw:
    return 'label-default';
  }
  return 'label-warning';
}

export default class MatchScore extends Component {
  static contextTypes = contextTypes;

  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired
  }

  render() {
    var match = this.props.match;
    if (!match.score || (match.score.home === 0 && match.score.out === 0)) {
      return null;
    }

    var classColor = this.props.match.isDerby ? getClassName(matchOutcome.Won) : getClassName(match.scoreType);
    return (
      <span className={cn('match-score label label-as-badge', classColor)}>
        {match.score.home + ' - ' + match.score.out}
      </span>
    );
  }
}