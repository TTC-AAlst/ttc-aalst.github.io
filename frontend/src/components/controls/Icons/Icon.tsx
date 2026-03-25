import React, {Component, MouseEventHandler} from 'react';
import cn from 'classnames';
import { withTooltip } from '../../../utils/decorators/withTooltip';

export type IconProps = {
  fa: string;
  color?: string | undefined;
  style?: React.CSSProperties;
  onClick?: MouseEventHandler<any> | undefined;
  className?: string;
}

class IconComponent extends Component<IconProps> {
  static defaultProps = {
    color: undefined,
    style: undefined,
    onClick: undefined,
    className: undefined,
  };

  render() {
    const {fa, color, style, onClick, className, ...props} = this.props;
    if (!onClick) {
      return (
        <i
          {...props}
          className={cn(fa, className, {clickable: !!onClick})}
          style={{color, ...style}}
        />
      );
    }
    return (
      <i
        {...props}
        className={cn(fa, className, {clickable: !!onClick})}
        onClick={onClick}
        style={{color, ...style}}
        role="button"
        tabIndex={0}
      />
    );
  }
}

export const Icon = withTooltip(IconComponent);
