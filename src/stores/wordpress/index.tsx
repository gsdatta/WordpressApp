import {Category, PostMetadata, PostSearchParams} from './models';
import URLSearchParams from 'url-search-params';
import URL from 'url-parse';
import {WP_SERVER} from "../../config";

export class WP {
    private readonly url: string;

    constructor() {
        this.url = WP_SERVER;
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

    async search(query: string, page: number = 1): Promise<PostMetadata[]> {
        return this._getPosts({search: query, page: page});
    }

    async posts(params: PostSearchParams): Promise<PostMetadata[]> {
       return this._getPosts(params);
    }

    post(id: number): Promise<PostMetadata> {
        let url = `${this.url}/posts/${id}`;

        return this.getURL(url)
            .then(res => res.json())
            .then(this._mapJsonToPost);
    }

    async getPostFromURL(postUrl: string): Promise<PostMetadata | undefined> {
        let u = new URL(postUrl).pathname;
        let pathPieces = (u[u.length - 1] == '/' ? u.substring(0, u.length - 1) : u).split('/');
        let slug = pathPieces[pathPieces.length - 1];

        let urlParams = new PostSearchParams();
        urlParams.slug = slug;

        try {
            let posts = await this._getPosts(urlParams);
            if (posts.length == 1) {
                return posts[0];
            } else {
                return undefined;
            }
        } catch (error) {
            return undefined;
        }
    }

    async _getPosts(params: PostSearchParams): Promise<PostMetadata[]> {
        let url = `${this.url}/posts`;
        if (params) {
            let urlParams = new URLSearchParams();

            if (params.categoryId) {
                urlParams.append('categories', params.categoryId);
            }

            if (params.page) {
                urlParams.append('page', params.page);
            }

            if (params.search) {
                urlParams.append('search', params.search);
            }

            if (params.slug) {
                urlParams.append('slug', params.slug);
            }

            const queryString = urlParams.toString();
            url += `?${queryString}`;
        }

        console.log(url);

        let data = await this.getURL(url);
        let json = await data.json();
        return json.map(this._mapJsonToPost);
    }

    _mapJsonToPost(p: any): PostMetadata {
        return new PostMetadata(p.id, p.title.rendered, p.featured_media, p.featured_image_src.replace("http:", "https:"), new Date(p.date), p.link, p.featured_video, p.excerpt.rendered, p.content.rendered);
    }
}