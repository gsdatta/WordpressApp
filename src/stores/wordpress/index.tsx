import {Category, PostMetadata, PostSearchParams} from './models';
import URLSearchParams from 'url-search-params';

export class WP {
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    getURL(url: string): Promise<Response> {
        return fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}});
    }

    categories(per_page = 100): Promise<Category[]> {
        return this.getURL(`${this.url}/categories?per_page=${per_page}`)
            .then(res => {
                console.log(res);
                return res;
            })
            .then(res => res.json())
            .then((json: any) => json.map((c: any) => new Category(c.id, c.name, c.count)));
    }

    async posts(params: PostSearchParams): Promise<PostMetadata[]> {
        let url = `${this.url}/posts`;
        console.log(params);

        if (params) {
            let urlParams = new URLSearchParams();

            if (params.categoryId) {
                urlParams.append('categories', params.categoryId);
            }

            if (params.page) {
                urlParams.append('page', params.page);
            }

            const queryString = urlParams.toString();
            url += `?${queryString}`;
        }

        console.log(url);

        let data = await this.getURL(url);
        let json = await data.json();
        return json.map((p: any) => new PostMetadata(p.id, p.title.rendered, p.featured_media, p.featured_image_src.replace("http:", "https:"), new Date(p.date), p.link, p.featured_video, p.excerpt.rendered));
    }

    post(id: number): Promise<PostMetadata> {
        let url = `${this.url}/posts/${id}`;

        return this.getURL(url)
            .then(res => res.json())
            .then(p => new PostMetadata(p.id, p.title.rendered, p.featured_media, p.featured_image_src.replace("http:", "https:"), new Date(p.date), p.link, p.featured_video, p.excerpt.rendered, p.content.rendered));
    }
}