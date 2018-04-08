import {Category, Post} from './models';
import URLSearchParams from 'url-search-params';

export class WP {
    constructor(url) {
        this.url = url;
    }

    getURL(url) {
        return fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}});
    }

    getMediaUrl(post) {
        console.log(`${this.url}/media/${post.media_id}`);
        return this.getURL(`${this.url}/media/${post.media_id}`)
            .then((response) => response.json())
            .then((res) => {
                post.media_url = res.guid.rendered.replace("http", "https").replace(".jpeg", "-150x150.jpeg");
            });
    }

    categories(per_page = 100) {
        return this.getURL(`${this.url}/categories?per_page=${per_page}`)
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

    posts(params) {
        let url = `${this.url}/posts`;
        console.log(params);
        if (params) {
            let urlParams = new URLSearchParams();
            for (let p in params) {
                urlParams.append(p, params[p]);
            }
            const queryString = urlParams.toString();
            url += `?${queryString}`;
        }

        console.log(url);

        return this.getURL(url)
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(json => json.map(p => new Post(p.id, p.title.rendered, p.featured_media, null)))
            .then(posts => posts.map(p => {
                this.getMediaUrl(p);
                return p;
            }));
    }

    post(id) {
        let url = `${this.url}/post/${id}`
    }
}