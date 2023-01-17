/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, RouterMatch } from './types/interface';
import { Home } from './view/Home';
import { CartPage } from './view/CartPage';
import { ProductPage } from './view/ProductPage';
import { Page404 } from './view/Page404';

function pathToRegex(path: string) {
    return new RegExp(`^${path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)')}$`);
}

function getParams(match: RouterMatch) {
    const values = match.result ? match.result.slice(1) : [];
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);

    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
}

async function router() {
    const routes: Router[] = [
        { path: '/', view: Home },
        { path: '/404', view: Page404 },
        { path: '/cart', view: CartPage },
        { path: '/product/:type', view: ProductPage },
    ];

    const potentialMatches = routes.map((route) => ({
        route,
        result: window.location.pathname.match(<RegExp>(<unknown>pathToRegex(route.path))),
    }));

    let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[1],
            result: [window.location.pathname],
        };
    }

    // eslint-disable-next-line new-cap
    const view = new match.route.view(getParams(match));
    try {
        (document.querySelector('.main') as HTMLElement).innerHTML = await view.getHtml();
        view.mounted();
    } catch (error) {
        (document.querySelector('.main') as HTMLElement).innerHTML = 'error';
    }
}

async function navigateTo(url: string) {
    window.history.pushState(null, '', url);
    await router();
}

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', async () => {
    document.body.addEventListener('click', async (e) => {
        if ((<HTMLElement>e.target).matches('[data-link]')) {
            e.preventDefault();
            await navigateTo((<HTMLAnchorElement>e.target).href);
        }
    });

    await router();
});
