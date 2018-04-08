import {Category} from './models';

export class WP {
    constructor(url) {
        this.url = url;
    }

    getURL(url) {
        return fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}});
    }

    categories() {
        return this.getURL(`${this.url}/categories`)
            .then(res => {
                console.log(res);
                return res;
            })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                return json.map(c => new Category(c.id, c.name, c.count));
            });
    }

    posts() {
        let url = `${this.url}/posts`
    }

    post(id) {
        let url = `${this.url}/post/${id}`
    }
}