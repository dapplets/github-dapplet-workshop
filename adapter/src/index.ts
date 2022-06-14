import { IFeature } from '@dapplets/dapplet-extension';
import { Button } from './button';

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
    button: this.adapter.createWidgetFactory(Button),
  });
  public config = {
    ISSUE_COMMENT: {
      containerSelector: '.js-discussion.js-socket-channel',
      contextSelector: '.TimelineItem.js-comment-container',
      insPoints: {
        HEADER_BUTTONS: {
          selector: '.timeline-comment-actions',
          insert: 'end'
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contextBuilder: (searchNode: any): ContextBuilder => ({
        id: searchNode.querySelector('.timeline-comment-group')?.id,
        page: document.location.origin + document.location.pathname,
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
