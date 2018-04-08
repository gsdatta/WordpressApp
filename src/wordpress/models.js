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

export class Post {
    id = null;
    name = null;
    media_url = null;

    constructor(id, name, media_url) {
        this.id = id;
        this.name = name;
        this.media_url = media_url;
    }
}