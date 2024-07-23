import React from 'react';

export function InlineChromiumBugfix() {
  return React.useMemo(
    () => (
      <span
        className={'h-0 leading-none'}
        contentEditable={false}
        style={{ fontSize: 0 }}
      >
        {String.fromCodePoint(160)}
      </span>
    ),
    [],
  );
}
