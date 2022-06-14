import { IFeature } from '@dapplets/dapplet-extension';
// import Widgets

type ContextBuilder = {
  [propName: string]: string;
};
type Exports = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
};

@Injectable
export default class GitHubAdapter {
  public exports = (): Exports => ({
    button: '', // use this.adapter.createWidgetFactory(<SOME_WIDGET>)
  });
  public config = {
    ISSUE_COMMENT: {
      containerSelector: '',
      contextSelector: '',
      insPoints: {
        HEADER_BUTTONS: {
          selector: '',
          insert: ''
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contextBuilder: (searchNode: any): ContextBuilder => ({
        id: '',
        // ... some other parameters that we need in dapplets
      }),
    },
  };

  constructor(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    @Inject('dynamic-adapter.dapplet-base.eth') readonly adapter: any,
  ) {
    this.adapter.configure(this.config);
  }

  public attachConfig(feature: IFeature): void {
    this.adapter.attachConfig(feature);
  }

  public detachConfig(feature: IFeature): void {
    this.adapter.detachConfig(feature);
  }
}
