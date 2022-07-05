import { ViewModel } from "hydrogen-view-sdk";
import { IChatterboxConfig } from "../types/IChatterboxConfig";

export class FooterViewModel extends ViewModel {
    private _config: IChatterboxConfig;

    constructor(options) {
        super(options);
        this._config = options.config;
    }

    get chatterboxLink(): string {
        return this._config.footer?.chatterbox_link ?? null;
    }

    get matrixLink(): string {
        return this._config.footer?.matrix_link ?? null;
    }
}
