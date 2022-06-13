import { } from '@dapplets/dapplet-extension';
import LOGO from './icons/logo.svg';

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

@Injectable
export default class GoogleFeature {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  @Inject('github-adapter-example.dapplet-base.eth') public adapter: any;

  async activate(): Promise<void> {
    const { button } = this.adapter.exports;
    const state = Core.state<IStorage>({ likes: [], counter: 0, link: '', userAccount: '' });

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
          try {
            let session = prevSession ?? (await Core.login({ authMethods: ['near/testnet'], target: overlay }));
            let wallet = await session.wallet();
            if (!wallet) {
              session = await Core.login({ authMethods: ['near/testnet'], target: overlay });
              wallet = await session.wallet();
            }
            state.global.userAccount.next(wallet.accountId);
          } catch (err) {
            console.log('Login was denied', err);
          }
          
        },
        logout: async () => {
          const sessions = await Core.sessions();
          sessions.forEach(x => x.logout());
          state.global.userAccount.next('');
        }
      });

    Core.onAction(() => overlay.open());

    this.adapter.attachConfig({
      ISSUE: (ctx) => {

        return button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: state[ctx.id].counter,
            img: LOGO,
            tooltip: 'Hi, friend!',
            isActive: state[ctx.id].likes.value.includes(state.global.userAccount.value),
            exec: async (_, me) => {
              let name = state.global.userAccount.value;
              if (name === '') {
                const session = prevSession ?? await Core.login({ authMethods: ['near/testnet'], target: overlay });
                const wallet = await session.wallet();
                state.global.userAccount.next(wallet.accountId);
                name = wallet.accountId;
              }
              const { likes, counter, link } = state[ctx.id];
              if (likes.value.includes(name)) {
                const newValue = likes.value.filter(x => x !== name);
                likes.next(newValue);
                counter.next(counter.value - 1);
                me.isActive = false;
              } else {
                const newValue = [...likes.value, name];
                likes.next(newValue);
                counter.next(counter.value + 1);
                link.next(ctx.page + '#' + ctx.id);
                me.isActive = true;
              }
            },
          },
        });
      }
    });
  }
}
