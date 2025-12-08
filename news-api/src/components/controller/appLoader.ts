import Loader from './loader';

class AppLoader extends Loader {
  constructor() {
    const apiUrl = process.env.API_URL;
    const apiKey = process.env.API_KEY;

    if (!apiUrl) throw new Error('Missing env.API_URL');
    if (!apiKey) throw new Error('Missing env.API_KEY');
    super(apiUrl, { apiKey });
  }
}

export default AppLoader;
