import type { Endpoint, Options } from '../../types';
declare class Loader {
    private baseLink;
    private options;
    constructor(baseLink: string, options: Options);
    protected getResp({ endpoint, options }: {
        endpoint: Endpoint;
        options?: Options;
    }, callback?: () => void): void;
    protected errorHandler(res: Response): Response;
    private makeUrl;
    private load;
}
export default Loader;
//# sourceMappingURL=loader.d.ts.map