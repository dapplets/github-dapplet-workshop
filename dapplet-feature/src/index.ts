import { } from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/ex08.png';

@Injectable
export default class GoogleFeature {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  @Inject('github-adapter-example.dapplet-base.eth') public adapter: any;

  activate(): void {
    const { button } = this.adapter.exports;
    const state = Core.state({ counter: 0, text: '' });
    const overlay = Core.overlay({ name: 'github-dapplet-overlay', title: 'GitHub Dapplet' })
      .useState(state);

    Core.onAction(() => overlay.open());

    this.adapter.attachConfig({
      ISSUE: (ctx) =>
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: 'Hi',
            img: EXAMPLE_IMG,
            tooltip: 'Hi, friend!',
            isActive: false,
            exec: (_, me) => { },
          },
          FRIENDS: {
            label: 'Hi',
            img: EXAMPLE_IMG,
            tooltip: 'Go to default',
            isActive: true,
            exec: (_, me) => { },
          },
        }),
    });
  }
}
