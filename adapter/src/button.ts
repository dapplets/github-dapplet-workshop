import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export interface IButtonProps {
    img: string;
    label: string;
    loading: boolean;
    disabled: boolean;
    hidden: boolean;
    tooltip: string;
    isActive: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exec: (ctx: any, me: IButtonProps) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init: (ctx: any, me: IButtonProps) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any;
    insPointName: string;
}

export class Button extends LitElement implements IButtonProps {

    public static override styles = css`
        .dapplet-widget-results {
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .dapplet-widget-results > img {
            width: 20px;
            margin-right: 5px;
            margin-bottom: 3px;
        }
        .dapplet-widget-results > div {
            display: inline-block;
            font-size: 1.1em;
            color: #f5504a;
            font-weight: bold;
        }
        
        .dapplet-widget-results:hover {
            text-decoration: underline;
            text-decoration-color: #f5504a;
        }
        :host {
            display: table;
            padding: 2px 10px 2px 20px;
        }
    `;
    
    public static contextInsPoints = {
        ISSUE: 'ISSUE',
    };
    
    @property() state;
    @property() ctx;
    @property() insPointName: string;
    @property() img: string;
    @property() label: string;
    @property() loading: boolean;
    @property() disabled: boolean;
    @property() hidden: boolean;
    @property() tooltip: string;
    @property() isActive: boolean;
    @property() exec: (ctx: any, me: IButtonProps) => void;
    @property() init: (ctx: any, me: IButtonProps) => void;
    
    connectedCallback() {
        super.connectedCallback();
        this.init?.(this.ctx, this.state);
    }
    
    private _clickHandler(e) {
        this.exec?.(this.ctx, this.state);
        e.stopPropagation();
    }

    override render() {
        if (this.hidden) return null;

        return html`
            <div
                @click=${this._clickHandler}
                class="dapplet-widget-results"
                title="${this.tooltip}"
            >
                <img src="${this.img}" />
                <div>${this.label}</div>
            </div>
        `;
    }
}