import React from 'react';
import Bridge, { IDappStateProps } from '@dapplets/dapplet-overlay-bridge';

const App = (props: IDappStateProps<any>) => {
  return (
    <div>
      <h1>GitHub Dapplet</h1>
      {Object.entries(props.sharedState)
        .filter(([x]) => x !== 'global')
        .filter(([x, y]) => y.counter > 0)
        .map(([key, value]) => {
          return (
            <div key={key}>
              <b>{key}:</b> {value.counter}
            </div>
          );
        })}
    </div>
  );
}

export default App;
