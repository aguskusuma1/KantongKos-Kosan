// URL API kita (karena api.php ditaruh di public, saat di-build akan berada di root yang sama dengan index.html)
// Jika di localhost Vite, kita arahkan ke URL production atau localhost PHP server.
// Untuk kemudahan, kita buat relatif ke domain saat ini.
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost/autobudget_api/api.php' : '/api.php';

export const api = {
  async fetch(action, options = {}) {
    const userId = localStorage.getItem('ab_user_id');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (userId) {
      headers['X-User-Id'] = userId;
    }

    let url = `${API_BASE_URL}?action=${action}`;
    
    if (options.params) {
      const qs = new URLSearchParams(options.params).toString();
      url += `&${qs}`;
    }

    try {
      const response = await window.fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (e) {
      throw e;
    }
  }
};
