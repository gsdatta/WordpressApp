import {Category, PostMetadata} from './models';
import URLSearchParams from 'url-search-params';

export class WP {
    constructor(url) {
        this.url = url;
    }

    getURL(url) {
        return fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}});
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

    async posts(params) {
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

        let data = await this.getURL(url);
        let json = await data.json();
        return json.map(p => new PostMetadata(p.id, p.title.rendered, p.featured_media, p.featured_image_src.replace("http:", "https:"), new Date(p.date), p.link, p.featured_video, p.excerpt.rendered));
    }

    post(id) {
        let url = `${this.url}/posts/${id}`;

        return this.getURL(url)
            .then(res => res.json())
            .then(p => new PostMetadata(p.id, p.title.rendered, p.featured_media, p.featured_image_src.replace("http:", "https:"), new Date(p.date), p.link, p.featured_video, p.excerpt.rendered, p.content.rendered))
            .then(p => {console.log(p); return p});

    }
}