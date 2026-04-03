import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isSoundEnabled, setSoundEnabled } from '../sounds';

describe('Sound Preferences', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to enabled', () => {
    expect(isSoundEnabled()).toBe(true);
  });

  it('can be disabled', () => {
    setSoundEnabled(false);
    expect(isSoundEnabled()).toBe(false);
    expect(localStorage.getItem('soundEnabled')).toBe('false');
  });

  it('can be re-enabled', () => {
    setSoundEnabled(false);
    setSoundEnabled(true);
    expect(isSoundEnabled()).toBe(true);
  });
});
