export const api = {
  async fetch(action, options = {}) {
    const userId = localStorage.getItem('ab_user_id');
    const apiUrl = import.meta.env.VITE_API_URL || 'api.php';
    
    // Construct URL with action and query params
    let url = `${apiUrl}?action=${action}`;
    if (options.params) {
      const queryParams = new URLSearchParams(options.params).toString();
      url += `&${queryParams}`;
    }

    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // If we have a userId, pass it to auth header
      if (userId && action !== 'login' && action !== 'register') {
        headers['X-User-Id'] = userId;
      }

      const res = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Terjadi kesalahan pada server');
      }

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (e) {
      throw e;
    }
  }
};
