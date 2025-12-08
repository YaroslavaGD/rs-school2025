import type { Callback, Options } from '../../types';

class Loader {
  constructor(
    private baseLink: string,
    private options: Options
  ) {
    this.baseLink = baseLink;
    this.options = options;
  }

  protected getResp(
    { endpoint, options = {} }: { endpoint: string; options?: Options },
    callback = () => {
      console.error('No callback for GET response');
    }
  ) {
    this.load('GET', endpoint, callback, options);
  }

  protected errorHandler(res: Response): Response {
    if (!res.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
    }

    return res;
  }

  private makeUrl(options: Options, endpoint: string): string {
    const urlOptions = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}?`;

    const arrKeys: string[] = Object.keys(urlOptions);

    arrKeys.forEach((key) => {
      url += `${key}=${urlOptions[key as keyof typeof urlOptions]}&`;
    });

    return url.slice(0, -1);
  }

  private load<T>(method: string, endpoint: string, callback: Callback, options: Options) {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data: T) => callback(data))
      .catch((err: Error) => console.error(err));
  }
}

export default Loader;
