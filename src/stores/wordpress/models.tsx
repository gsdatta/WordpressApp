export class Category {
    id: number;
    name: string;
    count: number = 0;

    constructor(id: number, name: string, count: number) {
        this.id = id;
        this.name = name;
        this.count = count;
    }
}

export class PostSearchParams {
    categoryId?: number;
    search?: string;
    page?: number = 1;
}

export class PostMetadata {
    id: number;
    name: string;
    media_id: number;
    media_url: string;
    posted_date: Date;
    url: string;
    video_url: string | null;
    post_content: string | null;
    excerpt: string | null;

    constructor(
        id: number,
        name: string,
        media_id: number,
        media_url: string,
        posted_date: Date,
        url: string,
        video_url: string | null = null,
        excerpt: string | null = null,
        post_content: string | null = null) {
        this.id = id;
        this.name = name;
        this.media_id = media_id;
        this.media_url = media_url;
        this.posted_date = posted_date;
        this.url = url;
        this.video_url = video_url;
        this.excerpt = excerpt;
        this.post_content = post_content;
    }
}
