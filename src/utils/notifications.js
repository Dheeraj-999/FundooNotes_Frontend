/** Small helpers for browser notifications and an audible reminder chime. */

export function notificationsSupported() {
  return typeof window !== 'undefined' && typeof window.Notification !== 'undefined';
}

export function getNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  return window.Notification.permission;
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  if (getNotificationPermission() === 'granted') return 'granted';
  try {
    return await window.Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function showBrowserNotification({ title, body, tag = 'fundoo-reminder' }) {
  if (getNotificationPermission() !== 'granted') return false;
  try {
    const notification = new window.Notification(title, { body, tag });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    return true;
  } catch {
    return false;
  }
}

/** Two short beeps using the Web Audio API — no audio file needed. */
export function playAlertSound() {
  const AudioContextClass =
    typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AudioContextClass) return false;

  try {
    const context = new AudioContextClass();
    const beep = (startAt, frequency) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.25, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.2);
    };
    beep(context.currentTime, 880);
    beep(context.currentTime + 0.25, 660);
    setTimeout(() => context.close(), 700);
    return true;
  } catch {
    return false;
  }
}
