import React, { Component } from 'react';
import cn from 'classnames';
import { Icon } from '../Icons/Icon';
import { withTooltip } from '../../../utils/decorators/withTooltip';

export type ButtonComponentProps = {
  onClick: () => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

class ButtonComponent extends Component<ButtonComponentProps> {
  render() {
    return (
      <a
        onClick={this.props.onClick}
        className={cn(this.props.className, 'btn btn-outline-secondary')}
        style={this.props.style}
        role="button"
        tabIndex={0}
      >
        {this.props.label}
      </a>
    );
  }
}

export const Button = withTooltip(ButtonComponent);


export type IconButtonComponentProps = {
  onClick: () => void;
  fa: string;
  className?: string;
  style?: React.CSSProperties;
}

class IconButtonComponent extends Component<IconButtonComponentProps> {
  render() {
    return (
      <a
        onClick={this.props.onClick}
        className={cn(this.props.className, 'btn btn-outline-secondary')}
        style={this.props.style}
        role="button"
        tabIndex={0}
      >
        <Icon fa={this.props.fa} />
      </a>
    );
  }
}

export const IconButton = withTooltip(IconButtonComponent);
