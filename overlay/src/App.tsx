import React, { useEffect, useState } from 'react';
import Bridge, { IDappStateProps } from '@dapplets/dapplet-overlay-bridge';
import { Login, LoginProps } from './components/Login';
import { List, ListProps, Item, ItemProps } from './components/List';
import LOGO from './images/logo.svg';

interface IStorage {
  likes: string[]
  counter: number
  link: string
  userAccount: string
}

interface IBridge {
  login: () => Promise<void>
  logout: () => Promise<void>
}

const App = (props: IDappStateProps<IStorage>) => {
  const [isWaiting, setIsWaiting] = useState(false);

  const { sharedState } = props;
  const bridge = new Bridge<IBridge>();

  const handleLogIn = async (e: any) => {
    e.preventDefault();
    setIsWaiting(true);
    const res = await bridge.login();
    setIsWaiting(false);
  };

  const handleLogOut = async (e: any) => {
    e.preventDefault();
    setIsWaiting(true);
    const res = await bridge.logout();
    setIsWaiting(false);
  };

  return sharedState && (
    <div>
      <Login
        logo={LOGO}
        name={sharedState.global?.userAccount}
        message="To start liking issues and comments please connect your wallet"
        login={handleLogIn}
        logout={handleLogOut}
        disabled={isWaiting}
        loading={isWaiting}
      />
      <div className='title'>
        <h1 className='base'>GitHub dapplet</h1>
        <h3 className='base'>Workshop demo</h3>
      </div>
      <List>
        {Object.entries(sharedState)
          .filter(([x]) => x !== 'global')
          .filter(([x, y]) => y.counter > 0)
          .map(([key, value]) => (
            <Item
              key={key}
              title={key}
              accounts={value.likes}
              amount={value.counter}
              link={value.link}
              logo={LOGO}
            />
          ))}        
      </List>

    </div>
  );
}

export default App;
