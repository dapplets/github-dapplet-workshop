import { } from '@dapplets/dapplet-extension';
// import LOGO from './icons/logo.svg';
// import ABI from './ABI';

interface IStorage {
  // ... specify the data to store
}

interface IBridge {
  // ... specify the functions that will be available in the overlay
}

@Injectable
export default class GitHubDapplet {
  @Inject('') public adapter: any; // ... specify the adapter

  async activate(): Promise<void> {
    const { } = this.adapter.exports; // get widgets
    this.adapter.attachConfig(
      // add config
    );
  }
}

// const changeIsActiveStates = (state: any) => {
//   const commentsInState = state.getAll();
//   delete commentsInState.global;
//   const currentAccount = state.global.userAccount.value.toLowerCase();
//   Object.entries(commentsInState).forEach(([id, commentData]: [id: string, commentData: IStorage]) => {
//     if (commentData.likes.map(x => x.toLowerCase()).includes(currentAccount) !== commentData.isActive) {
//       state[id].isActive.next(!commentData.isActive);
//     }
//   });
// }
