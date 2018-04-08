export class WP {
    constructor(url) {
        this.url = url;
    }

    categories() {
        console.log(`${this.url}/categories`);
        return fetch(`${this.url}/categories`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                console.log(res);
                return res;
            })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                return json.map(c => new Category(json.id, json.name, json.count))
            });
    }
}