import { createSpy } from 'expect';
import proxyquire from 'proxyquire';

export default function createDailymotion() {
  const playerMock = {
    addEventListener: createSpy().andCall((eventName, fn) => {
      if (eventName === 'apiready') fn();
    }),
    setMuted: createSpy(),
    setSubtitle: createSpy(),
    setVolume: createSpy(),
    setQuality: createSpy(),
    load: createSpy(),
    setWidth: createSpy(),
    setHeight: createSpy(),
    set width(width) {
      playerMock.setWidth(width);
    },
    set height(height) {
      playerMock.setHeight(height);
    },
  };

  const sdkMock = {
    player: createSpy().andReturn(playerMock),
  };

  const Dailymotion = proxyquire('../../', {
    './loadSdk': {
      default: () => Promise.resolve(sdkMock),
    },
  }).default;

  return { Dailymotion, sdkMock, playerMock }
}
