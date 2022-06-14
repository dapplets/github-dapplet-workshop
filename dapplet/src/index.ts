import { } from '@dapplets/dapplet-extension';
import LOGO from './icons/logo.svg';
import ABI from './ABI';

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

    const nearContract = await Core.contract(
      'near',
      'dev-1655140102497-11577123962238',
      {
        viewMethods: ['getAccountsByCommentId', 'getAll'],
        changeMethods: ['addLike', 'removeLike', 'clearAll'],
        network: "testnet"
      }
    );

    const ethereumContract = await Core.contract(
      'ethereum',
      '0xEd087354AB06D15Bc03F4F2DB52B22A14e7A9AF9',
      ABI
    );

    // const allCommentsFromContract = await nearContract.getAll(); // NEAR
    const allCommentsFromContract = await ethereumContract.getAll(); // Ethereum
    console.log('allCommentsFromNear', allCommentsFromContract);

    for (const pair of allCommentsFromContract) {
      // const { key, value } = pair; // NEAR
      const [key, value] = pair; // Ethereum
      const [link, id] = key.split('#');
      state[id].likes.next(value);
      state[id].counter.next(value.length);
      state[id].link.next(key);
    }

    const prevSessions = await Core.sessions();
    // const prevSession = prevSessions.find(x => x.authMethod === 'near/testnet'); // NEAR
    const prevSession = prevSessions.find(x => x.authMethod === 'ethereum/goerli'); // Ethereum
    if (prevSession) {
      const wallet = await prevSession.wallet();
      // state.global.userAccount.next(wallet.accountId); // NEAR

      const accountIds = await wallet.request({ method: 'eth_accounts', params: [] }); // Ethereum
      state.global.userAccount.next(accountIds[0]); // Ethereum
    }

    const overlay = Core.overlay<IBridge>({ name: 'github-dapplet-overlay', title: 'GitHub Dapplet' })
      .useState(state)
      .declare({
        login: async () => {
          try {
            // let session = prevSession ?? (await Core.login({ authMethods: ['near/testnet'], target: overlay })); // NEAR
            let session = prevSession ?? (await Core.login({ authMethods: ['ethereum/goerli'], target: overlay })); // Ethereum
            let wallet = await session.wallet();
            if (!wallet) {
              // session = await Core.login({ authMethods: ['near/testnet'], target: overlay }); // NEAR
              session = await Core.login({ authMethods: ['ethereum/goerli'], target: overlay }); // Ethereum
              wallet = await session.wallet();
            }
            // state.global.userAccount.next(wallet.accountId); // NEAR

            const accountIds = await wallet.request({ method: 'eth_accounts', params: [] }); // Ethereum
            state.global.userAccount.next(accountIds[0]); // Ethereum
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
            isActive: state[ctx.id].likes.value.map(x => x.toLowerCase()).includes(state.global.userAccount.value.toLowerCase()),
            exec: async (_, me) => {
              let name = state.global.userAccount.value;
              if (name === '') {
                // const session = prevSession ?? await Core.login({ authMethods: ['near/testnet'], target: overlay }); // NEAR
                const session = prevSession ?? await Core.login({ authMethods: ['ethereum/goerli'], target: overlay }); // Ethereum

                const wallet = await session.wallet();

                // state.global.userAccount.next(wallet.accountId); // NEAR
                // name = wallet.accountId; // NEAR

                const accountIds = await wallet.request({ method: 'eth_accounts', params: [] }); // Ethereum
                state.global.userAccount.next(accountIds[0]); // Ethereum
                name = wallet.accountIds[0]; // Ethereum
              }
              const { likes, counter, link } = state[ctx.id];
              if (!likes.value.map(x => x.toLowerCase()).includes(name.toLowerCase())) {
                try {
                  // await nearContract.addLike({ commentId: ctx.page + '#' + ctx.id }); // NEAR
                  await ethereumContract.addLike(ctx.page + '#' + ctx.id); // Ethereum

                  const newValue = [...likes.value, name];
                  likes.next(newValue);
                  counter.next(counter.value + 1);
                  link.next(ctx.page + '#' + ctx.id);
                  me.isActive = true;
                } catch (err) {
                  console.log('Error calling addLike():', err);
                }
              } else {
                try {
                  // await nearContract.removeLike({ commentId: ctx.page + '#' + ctx.id }); // NEAR
                  await ethereumContract.removeLike(ctx.page + '#' + ctx.id); // Ethereum

                  const newValue = likes.value.filter(x => x !== name);
                  likes.next(newValue);
                  counter.next(counter.value - 1);
                  me.isActive = false;
                } catch (err) {
                  console.log('Error calling removeLike():', err);
                }
              }
            },
          },
        });
      }
    });
  }
}
