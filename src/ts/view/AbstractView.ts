import { QueryStringParams } from '../types/type';
export abstract class AbstractView {
    title: string;
    params: QueryStringParams = {};
    abstract mounted(): void;

    constructor(params: QueryStringParams) {
        if (params) {
            this.params = params;
        }
        this.title = 'RS Store - ';
    }

    setTitle(title: string) {
        document.title = this.title + title;
    }

    async getHtml() {
        return '';
    }
}
