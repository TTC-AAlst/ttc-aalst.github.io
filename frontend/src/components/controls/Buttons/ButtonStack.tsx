import React from 'react';
import cn from 'classnames';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

type ButtonStackProps = {
  small?: boolean;
  config: {key: string, text: string}[];
  activeView: string;
  onClick: (key: string) => void;
  id?: 'team-view' | string,
}


export const ButtonStack = ({small, config, activeView, onClick, id = 'team-view'}: ButtonStackProps) => {
  if (small) {
    return (
      <DropdownButton
        title={(config.find(x => x.key === activeView) || {text: activeView}).text}
        id={id}
        onSelect={key => onClick(key || activeView)}
      >
        {config.map(button => (
          <Dropdown.Item eventKey={button.key} key={button.key}>
            {button.text}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  }
  return (
    <div className="btn-group">
      {config.map(button => (
        <button
          className={cn('btn', button.key === activeView ? 'btn-info' : 'btn-outline-info')}
          key={button.key}
          onClick={() => onClick(button.key)}
          type="button"
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};
