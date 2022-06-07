import { } from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/ex08.png';

interface IStorage {
  likes: string[]
  counter: number
  userAccount: string
}

interface IBridge {
  login: () => Promise<void>
  logout: () => Promise<void>
}

@Injectable
export default class GoogleFeature {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  @Inject('github-adapter-example.dapplet-base.eth') public adapter: any;

  async activate(): Promise<void> {
    const { button } = this.adapter.exports;
    const state = Core.state<IStorage>({ likes: [], counter: 0, userAccount: '' });

    const prevSessions = await Core.sessions();
    const prevSession = prevSessions.find(x => x.authMethod === 'near/testnet');
    if (prevSession) {
      const wallet = await prevSession.wallet();
      state.global.userAccount.next(wallet.accountId);
    }

    const overlay = Core.overlay<IBridge>({ name: 'github-dapplet-overlay', title: 'GitHub Dapplet' })
      .useState(state)
      .declare({
        login: async () => {
          const session = prevSession ?? await Core.login({ authMethods: ['near/testnet'], target: overlay });
          const wallet = await session.wallet();
          state.global.userAccount.next(wallet.accountId);
        },
        logout: async () => {
          const sessions = await Core.sessions();
          sessions.forEach(x => x.logout());
          state.global.userAccount.next('');
        }
      });

    Core.onAction(() => overlay.open());

    this.adapter.attachConfig({
      ISSUE: (ctx) =>
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: state[ctx.id].counter,
            img: EXAMPLE_IMG,
            tooltip: 'Hi, friend!',
            // isActive: false,
            exec: async (_, me) => {
              let name = state.global.userAccount.value;
              if (name === '') {
                const session = prevSession ?? await Core.login({ authMethods: ['near/testnet'], target: overlay });
                const wallet = await session.wallet();
                state.global.userAccount.next(wallet.accountId);
                name = wallet.accountId;
              }
              const { likes, counter } = state[ctx.id];
              if (likes.value.includes(name)) {
                const newValue = likes.value.filter(x => x !== name);
                likes.next(newValue);
                counter.next(counter.value - 1);
              } else {
                const newValue = [...likes.value, name];
                likes.next(newValue);
                counter.next(counter.value + 1);
              }
            },
          },
        }),
    });
  }
}
