import React, { useEffect, useState } from 'react';
import Bridge, { IDappStateProps } from '@dapplets/dapplet-overlay-bridge';
import { LogInButton, LogInButtonProps } from './components/LogInButton';
import { Profile, ProfileProps } from './components/Profile';
import Avatar from './assets/images/UserAvatarBig.png';
import { Header, List } from 'semantic-ui-react';

interface IStorage {
  likes: string[]
  counter: number
  userAccount: string
}

interface IBridge {
  login: () => Promise<void>
  logout: () => Promise<void>
}

const App = (props: IDappStateProps<IStorage>) => {
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  const { sharedState } = props;
  const bridge = new Bridge<IBridge>();

  if (isOpenLogin && sharedState.global?.userAccount === '') setIsOpenLogin(false);

  return sharedState && (
    <div>
      {sharedState.global?.userAccount === ''
        ? <LogInButton
          label='Log in'
          onLogin={() => bridge.login()}
        />
        : <Profile
          avatar={Avatar}
          name={sharedState.global?.userAccount}
          isOpen={isOpenLogin}
          openClose={() => setIsOpenLogin(!isOpenLogin)}
          onLogout={() => bridge.logout()}
        />}
      <Header as='h1'>GitHub Dapplet</Header>
      {Object.entries(sharedState)
        .filter(([x]) => x !== 'global')
        .filter(([x, y]) => y.counter > 0)
        .map(([key, value]) => {
          return (
            <List key={key}>
              <List.Item><b>{key}:</b> {value.counter}</List.Item>
              <List.Item>
                <List.List>
                {value.likes.map((v, i) => <List.Item key={i}>{v}</List.Item>)}
                </List.List>
              </List.Item>
            </List>
          );
        })}
    </div>
  );
}

export default App;
