import React, { useState, useEffect, useRef } from 'react';
import { speakText, stopSpeaking } from '../lib/tts';
import { Mic, MicOff, Check, Delete } from 'lucide-react';

function formatIndonesianDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Tanggal tidak valid";
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function parseIndonesianDateSpeech(speech) {
  const monthsMap = {
    januari: 0, jan: 0,
    februari: 1, feb: 1,
    maret: 2, mar: 2,
    april: 3, apr: 3,
    mei: 4,
    juni: 5, jun: 5,
    juli: 6, jul: 6,
    agustus: 7, agt: 7, ags: 7,
    september: 8, sep: 8,
    oktober: 9, okt: 9,
    november: 10, nov: 10,
    desember: 11, des: 11
  };

  const cleanSpeech = speech.toLowerCase();
  
  const dateMatch = cleanSpeech.match(/(\d+)/);
  let dateVal = new Date().getDate();
  if (dateMatch) {
    dateVal = parseInt(dateMatch[1]);
  }

  let monthVal = new Date().getMonth();
  for (const [key, value] of Object.entries(monthsMap)) {
    if (cleanSpeech.includes(key)) {
      monthVal = value;
      break;
    }
  }

  const yearMatch = cleanSpeech.match(/(20\d{2})/);
  let yearVal = new Date().getFullYear();
  if (yearMatch) {
    yearVal = parseInt(yearMatch[1]);
  }

  const dateObj = new Date(yearVal, monthVal, dateVal);
  if (!isNaN(dateObj.getTime())) {
    const offset = dateObj.getTimezoneOffset();
    const localDate = new Date(dateObj.getTime() - (offset * 60000));
    return localDate.toISOString().split('T')[0];
  }
  return null;
}

export default function TunanetraAccessibility({ 
  tunanetraMode, 
  setTunanetraMode, 
  expenses = [],
  onBackToHome 
}) {
  const [focusedInput, setFocusedInput] = useState(null);
  const [inputType, setInputType] = useState('text');
  const [currentHoveredKey, setCurrentHoveredKey] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef(null);
  const keyboardRef = useRef(null);

  // 1. Shortcut: Triple Click/Tap Global untuk toggle Mode Tunanetra
  useEffect(() => {
    let clickCount = 0;
    let lastClickTime = 0;

    const handleGlobalClick = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastClickTime < 400) {
        clickCount++;
      } else {
        clickCount = 1;
      }
      lastClickTime = currentTime;

      if (clickCount === 3) {
        clickCount = 0; // Reset
        setTunanetraMode(prev => {
          const nextVal = !prev;
          localStorage.setItem('ab_tunanetra_mode', nextVal ? 'true' : 'false');
          if (nextVal) {
            speakText("Fitur tunanetra diaktifkan. Ketuk dua kali untuk memilih.", true);
          } else {
            speakText("Fitur tunanetra dinonaktifkan.", true);
          }
          return nextVal;
        });
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [setTunanetraMode]);

  // 2. Navigasi dengan Sentuhan (Double Tap to Click)
  useEffect(() => {
    if (!tunanetraMode) return;

    let lastClickedEl = null;
    let lastClickTime = 0;

    const handleInterceptClick = (e) => {
      // Jangan intersep jika klik terjadi di dalam keyboard virtual aksesibilitas
      if (keyboardRef.current && keyboardRef.current.contains(e.target)) {
        return;
      }

      // Cari elemen interaktif terdekat
      const interactiveEl = e.target.closest('button, input, select, textarea, a, [role="button"], [tabIndex="0"]');
      if (!interactiveEl) return;

      const currentTime = Date.now();
      
      // Jika elemen berbeda atau jarak waktu > 800ms, ini klik pertama (fokus + suara)
      if (interactiveEl !== lastClickedEl || currentTime - lastClickTime > 800) {
        e.preventDefault();
        e.stopPropagation();

        lastClickedEl = interactiveEl;
        lastClickTime = currentTime;

        // Fokuskan elemen
        interactiveEl.focus();

        // Cari teks deskripsi elemen
        let elLabel = '';
        const tagName = interactiveEl.tagName.toLowerCase();
        
        if (tagName === 'input') {
          const typeLabel = interactiveEl.type === 'number' ? 'angka' : interactiveEl.type === 'date' ? 'tanggal' : 'teks';
          elLabel = `Kolom input ${typeLabel}. ${interactiveEl.getAttribute('aria-label') || interactiveEl.placeholder || 'Kosong'}`;
        } else if (tagName === 'button') {
          elLabel = `Tombol. ${interactiveEl.getAttribute('aria-label') || interactiveEl.innerText || 'Tanpa keterangan'}`;
        } else if (tagName === 'a') {
          elLabel = `Tautan. ${interactiveEl.getAttribute('aria-label') || interactiveEl.innerText || 'Tanpa keterangan'}`;
        } else {
          elLabel = interactiveEl.getAttribute('aria-label') || interactiveEl.innerText || 'Elemen interaktif';
        }

        speakText(elLabel, true);
      } else {
        // Klik kedua cepat (Double Tap) -> Biarkan jalan
        lastClickedEl = null;
        lastClickTime = 0;
      }
    };

    // Gunakan useCapture = true untuk menangkap event sebelum sampai ke handler komponen
    window.addEventListener('click', handleInterceptClick, true);
    return () => window.removeEventListener('click', handleInterceptClick, true);
  }, [tunanetraMode]);

  // 3. Deteksi Fokus Input untuk Keyboard Aksesibilitas
  useEffect(() => {
    if (!tunanetraMode) {
      setFocusedInput(null);
      return;
    }

    const handleFocus = (e) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        setFocusedInput(target);
        setInputType(target.type || 'text');
        // Nonaktifkan keyboard native di mobile
        target.setAttribute('inputmode', 'none');
      }
    };

    const handleBlur = (e) => {
      // Kita beri sedikit delay agar klik pada keyboard virtual tidak langsung menghilangkan fokus sebelum ketik
      setTimeout(() => {
        if (document.activeElement && 
            (document.activeElement.tagName === 'INPUT' || 
             document.activeElement.tagName === 'TEXTAREA' ||
             (keyboardRef.current && keyboardRef.current.contains(document.activeElement)))) {
          return;
        }
        setFocusedInput(null);
      }, 200);
    };

    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);
    
    return () => {
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
    };
  }, [tunanetraMode]);

  // Mutation observer untuk menonaktifkan keyboard bawaan (native) secara proaktif pada semua input
  useEffect(() => {
    if (!tunanetraMode) {
      // Kembalikan inputmode dan readOnly asli jika dinonaktifkan
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        const originalInputMode = input.getAttribute('data-original-inputmode');
        if (originalInputMode !== null) {
          if (originalInputMode) {
            input.setAttribute('inputmode', originalInputMode);
          } else {
            input.removeAttribute('inputmode');
          }
          input.removeAttribute('data-original-inputmode');
        }

        const originalReadOnly = input.getAttribute('data-original-readonly');
        if (originalReadOnly !== null) {
          if (originalReadOnly === 'true') {
            input.setAttribute('readonly', 'true');
          } else {
            input.removeAttribute('readonly');
          }
          input.removeAttribute('data-original-readonly');
        }
      });
      return;
    }

    const disableNativeKeyboard = () => {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        // Simpan inputmode asli
        if (!input.hasAttribute('data-original-inputmode')) {
          input.setAttribute('data-original-inputmode', input.getAttribute('inputmode') || '');
        }
        input.setAttribute('inputmode', 'none');

        // Simpan readonly asli dan paksa readonly = true
        if (!input.hasAttribute('data-original-readonly')) {
          input.setAttribute('data-original-readonly', input.hasAttribute('readonly') ? 'true' : 'false');
        }
        input.setAttribute('readonly', 'true');
      });
    };

    disableNativeKeyboard();

    const observer = new MutationObserver(() => {
      disableNativeKeyboard();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [tunanetraMode, focusedInput]);

  // 4. Gestur Sapuan Layar (Swipe Gesture)
  useEffect(() => {
    if (!tunanetraMode) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      // Ambang batas gestur horizontal (minimal 120px)
      // Dan pastikan gerakan vertikal relatif kecil (Math.abs(diffY) < 70) agar tidak mendeteksi scroll biasa
      if (Math.abs(diffX) > 120 && Math.abs(diffY) < 70) {
        if (diffX < 0) {
          // Swipe Kiri -> Kembali ke Home
          triggerGoHome();
        } else {
          // Swipe Kanan -> Riwayat Pengeluaran terbaru
          readRecentExpenses();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [tunanetraMode, expenses, onBackToHome]);

  const triggerGoHome = () => {
    speakText("Kembali ke menu utama", true);
    if (onBackToHome) {
      onBackToHome();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const readRecentExpenses = () => {
    // Scroll ke bagian bawah di mana riwayat biasanya berada
    const historySection = document.querySelector('[aria-label*="Kalender"]') || document.querySelector('.glass-panel:nth-of-type(4)');
    if (historySection) {
      historySection.scrollIntoView({ behavior: 'smooth' });
    }

    const recent = expenses.slice(-3).reverse();
    if (recent.length === 0) {
      speakText("Menampilkan daftar transaksi terbaru. Tidak ada pengeluaran yang tercatat saat ini.", true);
    } else {
      let ttsMsg = "Menampilkan daftar pengeluaran terbaru. ";
      recent.forEach((exp, idx) => {
        const d = exp.description ? exp.description : "Tanpa keterangan";
        const amt = Number(exp.amount).toLocaleString('id-ID');
        ttsMsg += `${idx + 1}: ${d} sebesar Rp ${amt}. `;
      });
      speakText(ttsMsg, true);
    }
  };

  // 5. Pengetikan Aksesibilitas: Geser-Dengar, Lepas-Ketik
  const handleKeyboardTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (target && target.classList.contains('kbd-key')) {
      const keyVal = target.getAttribute('data-key');
      const keyText = target.getAttribute('data-speak-text') || keyVal;
      
      if (keyVal && keyVal !== currentHoveredKey) {
        setCurrentHoveredKey(keyVal);
        speakText(keyText, true);
      }
    } else {
      setCurrentHoveredKey(null);
    }
  };

  const handleKeyboardTouchEnd = () => {
    if (currentHoveredKey) {
      typeCharacter(currentHoveredKey);
      setCurrentHoveredKey(null);
    }
  };

  // Untuk pengetikan Desktop Mouse
  const handleKeyMouseEnter = (keyVal, speakTxt) => {
    // Hanya bersuara saat mouse hover jika tunanetraMode aktif
    speakText(speakTxt || keyVal, true);
  };

  const handleKeyClick = (keyVal) => {
    typeCharacter(keyVal);
  };

  const typeCharacter = (char) => {
    if (!focusedInput) return;

    const currentValue = focusedInput.value || '';
    let start = focusedInput.selectionStart;
    let end = focusedInput.selectionEnd;

    // Fallback jika browser tidak mendukung seleksi untuk type="number" atau jika input tipe number
    if (focusedInput.type === 'number' || start === null || typeof start !== 'number') {
      start = currentValue.length;
      end = currentValue.length;
    }

    let newValue = currentValue;
    let speakFeedback = '';

    if (char === 'KEMARIN') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      newValue = yesterday.toISOString().split('T')[0];
      speakFeedback = `Set tanggal ke kemarin. Tanggal disetel ke ${formatIndonesianDate(newValue)}`;
    } else if (char === 'HARI_INI') {
      const today = new Date();
      newValue = today.toISOString().split('T')[0];
      speakFeedback = `Set tanggal ke hari ini. Tanggal disetel ke ${formatIndonesianDate(newValue)}`;
    } else if (char === 'TAMBAH_HARI') {
      const dateObj = new Date(currentValue);
      const targetDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
      targetDate.setDate(targetDate.getDate() + 1);
      newValue = targetDate.toISOString().split('T')[0];
      speakFeedback = `Tambah satu hari. Tanggal disetel ke ${formatIndonesianDate(newValue)}`;
    } else if (char === 'KURANGI_HARI') {
      const dateObj = new Date(currentValue);
      const targetDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
      targetDate.setDate(targetDate.getDate() - 1);
      newValue = targetDate.toISOString().split('T')[0];
      speakFeedback = `Kurangi satu hari. Tanggal disetel ke ${formatIndonesianDate(newValue)}`;
    } else if (char === 'BACKSPACE') {
      if (start > 0 || end > start) {
        const deleteCount = end > start ? end - start : 1;
        const deletePos = end > start ? start : start - 1;
        newValue = currentValue.substring(0, deletePos) + currentValue.substring(end);
        speakFeedback = "Hapus";
      } else {
        speakFeedback = "Kosong";
      }
    } else if (char === 'SPACE') {
      newValue = currentValue.substring(0, start) + ' ' + currentValue.substring(end);
      speakFeedback = "Spasi";
    } else if (char === 'ENTER') {
      focusedInput.blur();
      setFocusedInput(null);
      speakFeedback = "Selesai memasukkan teks";
    } else {
      newValue = currentValue.substring(0, start) + char + currentValue.substring(end);
      speakFeedback = char;
    }

    // Set nilai & trigger event React secara aman (React 16+ compatibility)
    const prototype = focusedInput.tagName === 'TEXTAREA' 
      ? window.HTMLTextAreaElement.prototype 
      : window.HTMLInputElement.prototype;
      
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (setter) {
      setter.call(focusedInput, newValue);
    } else {
      focusedInput.value = newValue;
    }

    const event = new Event('input', { bubbles: true });
    focusedInput.dispatchEvent(event);
    
    // Set selection cursor kembali ke tempat yang benar
    setTimeout(() => {
      if (focusedInput) {
        const offset = char === 'BACKSPACE' ? -1 : char === 'SPACE' ? 1 : char === 'ENTER' ? 0 : char.length;
        try {
          focusedInput.setSelectionRange(start + offset, start + offset);
        } catch (e) {
          // Abaikan jika tidak didukung oleh tipe input (seperti type="number")
        }
      }
    }, 0);

    speakText(speakFeedback, true);
  };

  // 6. Dikte Suara (Voice Typing)
  const toggleVoiceTyping = () => {
    if (!focusedInput) {
      speakText("Silakan pilih kolom input terlebih dahulu.", true);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakText("Dikte suara tidak didukung oleh browser Anda. Gunakan Google Chrome.", true);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      speakText("Dikte aktif. Silakan berbicara sekarang.", true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      let finalVal = transcript;
      
      // Jika input bertipe number, bersihkan teks non-angka
      if (inputType === 'number') {
        // Konversi kata angka bahasa Indonesia sederhana
        let parsed = transcript.toLowerCase();
        parsed = parsed.replace(/juta/g, '000000');
        parsed = parsed.replace(/ribu/g, '000');
        parsed = parsed.replace(/ratus/g, '00');
        parsed = parsed.replace(/[^0-9]/g, '');
        
        if (parsed) {
          finalVal = parsed;
        } else {
          speakText("Tidak mendeteksi angka. Coba ucapkan angka saja.", true);
          return;
        }
      } else if (inputType === 'date') {
        const parsedDate = parseIndonesianDateSpeech(transcript);
        if (parsedDate) {
          finalVal = parsedDate;
          speakText(`Dikte tanggal sukses. Menyetel tanggal ke ${formatIndonesianDate(parsedDate)}`, true);
        } else {
          speakText(`Tidak dapat mengenali tanggal dari ucapan "${transcript}". Ucapkan misalnya: satu juli dua ribu dua puluh enam.`, true);
          return;
        }
      }

      // Input teks ke input saat ini
      let newValue;
      if (inputType === 'date') {
        newValue = finalVal;
      } else {
        const start = focusedInput.selectionStart || 0;
        const end = focusedInput.selectionEnd || 0;
        const currentValue = focusedInput.value || '';
        newValue = currentValue.substring(0, start) + finalVal + currentValue.substring(end);
      }
      
      const prototype = focusedInput.tagName === 'TEXTAREA' 
        ? window.HTMLTextAreaElement.prototype 
        : window.HTMLInputElement.prototype;
        
      const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
      if (setter) {
        setter.call(focusedInput, newValue);
      } else {
        focusedInput.value = newValue;
      }
      const ev = new Event('input', { bubbles: true });
      focusedInput.dispatchEvent(ev);

      if (inputType !== 'date') {
        speakText(`Memasukkan kata: ${finalVal}`, true);
      }
    };

    recognition.onerror = (e) => {
      console.error(e);
      speakText("Kesalahan mendeteksi suara atau dibatalkan.", true);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!tunanetraMode || !focusedInput) return (
    <style dangerouslySetInnerHTML={{ __html: `
      .kbd-container { display: none; }
    `}} />
  );

  // Render Virtual Accessibility Keyboard
  const isNumeric = inputType === 'number';
  const isDate = inputType === 'date';
  
  const numKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['BACKSPACE', '0', 'ENTER']
  ];

  const alphaKeys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['BACKSPACE', 'SPACE', 'ENTER']
  ];

  const dateKeys = [
    ['KEMARIN', 'HARI_INI'],
    ['KURANGI_HARI', 'TAMBAH_HARI'],
    ['ENTER']
  ];

  const currentLayout = isDate ? dateKeys : (isNumeric ? numKeys : alphaKeys);

  const getKeyLabel = (key) => {
    if (key === 'BACKSPACE') return <Delete size={20} />;
    if (key === 'ENTER') return <Check size={20} />;
    if (key === 'SPACE') return 'SPASI';
    if (key === 'KEMARIN') return 'KEMARIN';
    if (key === 'HARI_INI') return 'HARI INI';
    if (key === 'KURANGI_HARI') return '-1 HARI';
    if (key === 'TAMBAH_HARI') return '+1 HARI';
    return key;
  };

  const getKeySpeakText = (key) => {
    if (key === 'BACKSPACE') return 'Hapus';
    if (key === 'ENTER') return 'Selesai';
    if (key === 'SPACE') return 'Spasi';
    if (key === 'KEMARIN') return 'Kemarin';
    if (key === 'HARI_INI') return 'Hari ini';
    if (key === 'KURANGI_HARI') return 'Kurangi satu hari';
    if (key === 'TAMBAH_HARI') return 'Tambah satu hari';
    return key;
  };

  return (
    <div 
      ref={keyboardRef}
      className="kbd-container"
      onTouchMove={handleKeyboardTouchMove}
      onTouchEnd={handleKeyboardTouchEnd}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderTop: '2px solid var(--surface-border)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
        padding: '16px 8px 30px 8px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        borderTopLeftRadius: 'var(--radius-lg)',
        borderTopRightRadius: 'var(--radius-lg)',
        animation: 'slide-up 0.3s ease-out'
      }}
    >
      {/* CSS Animasi dan helper */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .kbd-key {
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;
        }
      `}} />

      {/* Info Bar Keyboard & Tombol Voice Typing */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 8px 8px', borderBottom: '1px solid var(--surface-border)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
          Keyboard Aksesibilitas • {isNumeric ? 'Angka' : 'Teks'}
        </span>
        
        {/* Tombol Dikte Suara */}
        <button
          onClick={toggleVoiceTyping}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            background: isListening ? 'var(--danger)' : 'var(--panel-item-bg)',
            border: '1px solid var(--surface-border)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
          aria-label="Tombol Dikte Suara. Ketuk dua kali untuk merekam suara."
        >
          {isListening ? (
            <>
              <MicOff size={14} color="white" /> Mendengarkan...
            </>
          ) : (
            <>
              <Mic size={14} color="var(--success)" /> Dikte Suara
            </>
          )}
        </button>
      </div>

      {/* Render Baris Keys */}
      {currentLayout.map((row, rowIdx) => (
        <div 
          key={rowIdx} 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '6px',
            width: '100%'
          }}
        >
          {row.map((key) => {
            const isSpecial = key === 'BACKSPACE' || key === 'ENTER' || key === 'SPACE';
            const speakTextVal = getKeySpeakText(key);
            const isHovered = currentHoveredKey === key;

            return (
              <div
                key={key}
                data-key={key}
                data-speak-text={speakTextVal}
                onMouseEnter={() => handleKeyMouseEnter(key, speakTextVal)}
                onMouseDown={(e) => e.preventDefault()}
                onTouchStart={(e) => {
                  e.preventDefault();
                }}
                onClick={() => handleKeyClick(key)}
                className="kbd-key"
                style={{
                  flex: key === 'SPACE' ? 3 : isSpecial ? 1.5 : 1,
                  height: '52px',
                  background: isHovered 
                    ? 'var(--primary)' 
                    : isSpecial 
                      ? 'var(--panel-track-bg)' 
                      : 'var(--panel-item-bg)',
                  color: isHovered ? 'white' : 'var(--text-primary)',
                  border: isHovered 
                    ? '1px solid var(--primary)' 
                    : '1px solid var(--surface-border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: isSpecial ? '0.85rem' : '1.1rem',
                  cursor: 'pointer',
                  transform: isHovered ? 'scale(1.05)' : 'none',
                  transition: 'all 0.1s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {getKeyLabel(key)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
