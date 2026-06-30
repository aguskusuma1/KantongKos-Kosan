// Utilitas Text-to-Speech (TTS) untuk Aksesibilitas
let currentUtterance = null;

/**
 * Menyuarakan teks yang diberikan menggunakan Web Speech API.
 * @param {string} text - Teks yang akan disuarakan.
 * @param {boolean} force - Jika true, batalkan suara yang sedang berjalan sebelumnya.
 */
export function speakText(text, force = true) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis tidak didukung oleh browser ini.');
    return;
  }

  if (force) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Set Bahasa Indonesia
  utterance.lang = 'id-ID';

  // Dapatkan semua suara yang tersedia
  let voices = window.speechSynthesis.getVoices();
  
  // Cari suara Bahasa Indonesia
  let idVoice = voices.find(voice => voice.lang.startsWith('id') || voice.lang === 'id-ID');
  
  if (idVoice) {
    utterance.voice = idVoice;
  }

  // Pengaturan nada dan kecepatan
  utterance.pitch = 1.0;
  utterance.rate = 0.95; // Sedikit diperlambat agar lebih jelas didengar

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Menghentikan semua proses suara yang sedang berjalan.
 */
export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Event listener untuk memuat suara secara asinkron (dibutuhkan beberapa browser seperti Chrome)
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Memancing browser memuat daftar suara
    window.speechSynthesis.getVoices();
  };
}
