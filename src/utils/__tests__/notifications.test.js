import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getNotificationPermission,
  notificationsSupported,
  playAlertSound,
  requestNotificationPermission,
  showBrowserNotification,
} from '../notifications';

class MockNotification {
  static permission = 'default';
  static requestPermission = vi.fn().mockResolvedValue('granted');

  constructor(title, options) {
    this.title = title;
    this.options = options;
    this.close = vi.fn();
    MockNotification.lastInstance = this;
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('browser notification helpers', () => {
  it('reports when the Notification API is unavailable', () => {
    vi.stubGlobal('Notification', undefined);
    expect(notificationsSupported()).toBe(false);
    expect(getNotificationPermission()).toBe('unsupported');
  });

  it('requests permission and returns the browser response', async () => {
    vi.stubGlobal('Notification', MockNotification);
    MockNotification.permission = 'default';

    await expect(requestNotificationPermission()).resolves.toBe('granted');
    expect(MockNotification.requestPermission).toHaveBeenCalledOnce();
  });

  it('only shows a notification when permission was granted', () => {
    vi.stubGlobal('Notification', MockNotification);
    MockNotification.permission = 'granted';

    expect(showBrowserNotification({ title: 'Reminder', body: 'Launch plan', tag: 'r-1' })).toBe(true);
    expect(MockNotification.lastInstance.title).toBe('Reminder');
    expect(MockNotification.lastInstance.options).toEqual({ body: 'Launch plan', tag: 'r-1' });

    MockNotification.permission = 'denied';
    expect(showBrowserNotification({ title: 'Nope' })).toBe(false);
  });

  it('does nothing for the sound when Web Audio is unavailable', () => {
    vi.stubGlobal('AudioContext', undefined);
    vi.stubGlobal('webkitAudioContext', undefined);
    expect(playAlertSound()).toBe(false);
  });
});
