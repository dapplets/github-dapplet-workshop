import { } from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/ex08.png';

interface Storage {
  likes: string[]
  counter: number
}

@Injectable
export default class GoogleFeature {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  @Inject('github-adapter-example.dapplet-base.eth') public adapter: any;

  activate(): void {
    const { button } = this.adapter.exports;
    const state = Core.state<Storage>({ likes: [], counter: 0 });
    const overlay = Core.overlay({ name: 'github-dapplet-overlay', title: 'GitHub Dapplet' })
      .useState(state);

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
            exec: (_, me) => {
              const { likes, counter } = state[ctx.id];
              if (likes.value.includes('name')) {
                const newValue = likes.value.filter(x => x !== 'name');
                likes.next(newValue);
                counter.next(counter.value - 1);
              } else {
                const newValue = [...likes.value, 'name'];
                likes.next(newValue);
                counter.next(counter.value + 1);
              }
            },
          },
        }),
    });
  }
}
