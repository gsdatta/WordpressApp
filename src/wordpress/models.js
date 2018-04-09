export class Category {
    id = null;
    name = null;
    count = 0;

    constructor(id, name, count) {
        this.id = id;
        this.name = name;
        this.count = count;
    }
}

export class PostMetadata {
    id = null;
    name = null;
    media_id = null;
    media_url = null;
    posted_date = null;
    post_content = null;

    constructor(id, name, media_id, media_url, posted_date, post_content = null) {
        this.id = id;
        this.name = name;
        this.media_id = media_id;
        this.media_url = media_url;
        this.posted_date = posted_date;
        this.post_content = post_content;
    }
}
