import { ViewModel } from "hydrogen-view-sdk";
import { IChatterboxConfig } from "../types/IChatterboxConfig";

export class FooterViewModel extends ViewModel {
    private _config: IChatterboxConfig;

    constructor(options) {
        super(options);
        this._config = options.config;
    }

    openChatterboxLink() {
        const link = this._config.footer?.chatterbox_link;
        if (link) {
            (window as any).sendOpenLink(link);
        }
    }

    openMatrixLink() {
        const link = this._config.footer?.matrix_link;
        if (link) {
            (window as any).sendOpenLink(link);
        }
    }
}
