import * as React from 'react';

interface IColored {
  color?: string;
}

export const Colored = ({
  children,
  color = '#ff00ff',
}: React.PropsWithChildren<IColored>) => (
  <span style={{ color }}>{children}</span>
);
