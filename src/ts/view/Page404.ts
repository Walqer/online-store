import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';

export class Page404 extends AbstractView {
    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('404 Not Found');
    }

    async getHtml() {
        return `
      <h1 class="main-title visually-hidden">404 - Page not found</h1>
      <div class="not-found">
          <img src="../assets/icons/not-found.png" alt="404 error" width="659">
      </div>
    `;
    }
    async mounted() {}
}
