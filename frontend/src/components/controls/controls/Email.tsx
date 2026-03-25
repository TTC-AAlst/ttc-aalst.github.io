import React from 'react';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';

type EmailProps = {
  email: string;
  className?: string;
  showIcon?: boolean;
}

export const Email = ({email, className, showIcon = false}: EmailProps) => {
  if (!email) {
    return null;
  }

  if (showIcon) {
    return (
      <span>
        <i className="fa fa-envelope-o" style={{marginRight: 8}} />
        <a href={`mailto:${email}`} className={className}>{email}</a>
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={className}>{email}</a>
  );
};


type OwnEmailProps = {
  className?: string;
}

export const OwnEmail = (props: OwnEmailProps) => {
  const email = useTtcSelector(state => state.config.params.email);
  return <Email email={email} {...props} />;
};
