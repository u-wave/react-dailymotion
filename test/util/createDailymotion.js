import { createSpy } from 'expect';
import proxyquire from 'proxyquire';

export default function createDailymotion() {
  let isPaused = true;

  const playerMock = {
    addEventListener: createSpy().andCall((eventName, fn) => {
      if (eventName === 'apiready') fn();
    }),
    setMuted: createSpy(),
    setSubtitle: createSpy(),
    setVolume: createSpy(),
    setQuality: createSpy(),
    load: createSpy(),
    play: createSpy().andCall(() => {
      isPaused = false;
    }),
    pause: createSpy().andCall(() => {
      isPaused = true;
    }),
    setWidth: createSpy(),
    setHeight: createSpy(),
    get paused() {
      return isPaused;
    },
    set width(width) {
      playerMock.setWidth(width);
    },
    set height(height) {
      playerMock.setHeight(height);
    },
  };

  const sdkMock = {
    player: createSpy().andCall((container, options) => {
      isPaused = !options.params.autoplay;

      return playerMock;
    }),
  };

  const Dailymotion = proxyquire('../../src/index.js', {
    './loadSdk': {
      default: () => Promise.resolve(sdkMock),
    },
  }).default;

  return { Dailymotion, sdkMock, playerMock };
}
