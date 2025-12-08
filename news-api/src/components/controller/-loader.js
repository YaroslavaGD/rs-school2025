class Loader {
    constructor(baseLink, options) {
        this.baseLink = baseLink;
        this.options = options;
    }
    // console.log('----getResp----');
    // console.log('-endpoint-');
    // console.log(endpoint); //string
    // console.log(typeof endpoint);
    // console.log('-callback-');
    // console.log(callback); //function
    // console.log(typeof callback);
    // console.log('-options-');
    // console.log(options); //{} | {sources: string}
    // console.log(typeof options);
    getResp(
        { endpoint, options = {} },
        callback = () => {
            console.error('No callback for GET response');
        }
    ) {
        this.load('GET', endpoint, callback, options);
    }

    errorHandler(res) {
        // console.log('----error Handler----');
        // console.log('-res-');
        // console.log(res);
        // console.log(typeof res);
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    makeUrl(options, endpoint) {
        // console.log('----makeUrl----');
        // console.log('-options-');
        // console.log(options);
        // console.log(typeof options);
        // console.log('-this.options-');
        // console.log(this.options);
        // console.log(typeof this.options);
        // console.log('-endpoint-');
        // console.log(endpoint);
        // console.log(typeof endpoint);
        const urlOptions = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        // console.log('-url-')
        // console.log(url);
        return url.slice(0, -1);
    }

    load(method, endpoint, callback, options = {}) {
        // console.log('----load----')
        // console.log('-endpoint-')
        // console.log(endpoint)
        // console.log(typeof endpoint)
        // console.log('-callback-')
        // console.log(callback)
        // console.log(typeof callback)
        // console.log('-options-')
        // console.log(options)
        // console.log(typeof options)
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res) => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;
