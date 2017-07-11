import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import render from './util/render';
import createDailymotion from './util/createDailymotion';

describe('Dailymotion', () => {
  it('should render a div with an ID and className', () => {
    const { Dailymotion } = createDailymotion();
    const renderer = new ShallowRenderer();
    renderer.render(<Dailymotion id="myId" className="myClassName" />);
    expect(renderer.getRenderOutput()).toMatch({
      type: 'div',
      props: {
        id: 'myId',
        className: 'myClassName',
      },
    });
  });

  it('should create a Dailymotion player when mounted', async () => {
    const { sdkMock } = await render({
      video: 'x2y5kyu',
    });
    expect(sdkMock.player).toHaveBeenCalled();
    expect(sdkMock.player.calls[0].arguments[1]).toMatch({ video: 'x2y5kyu' });
  });

  it('should load a different video when "video" prop changes', async () => {
    const { sdkMock, playerMock, rerender } = await render({
      video: 'x2y5kyu',
    });
    expect(sdkMock.player).toHaveBeenCalled();
    expect(sdkMock.player.calls[0].arguments[1]).toMatch({ video: 'x2y5kyu' });

    await rerender({ video: 'x3pn5cb' });

    expect(playerMock.load).toHaveBeenCalled();
    expect(playerMock.load.calls[0].arguments[0]).toEqual('x3pn5cb');
  });

  it('should unload when "video" prop changes to null', async () => {
    const { playerMock, rerender } = await render({
      video: 'x2y5kyu',
    });
    expect(playerMock.load).toNotHaveBeenCalled();
    expect(playerMock.pause).toNotHaveBeenCalled();

    await rerender({ video: null });

    expect(playerMock.pause).toHaveBeenCalled();

    await rerender({ video: 'x3pn5cb' });
  });

  it('should pause the video using the "paused" prop', async () => {
    const { playerMock, rerender } = await render({
      video: 'x2y5kyu',
      autoplay: true,
    });

    // Don't call `play` again when we were already playing
    await rerender({ paused: false });
    expect(playerMock.play).toNotHaveBeenCalled();

    await rerender({ paused: true });
    expect(playerMock.pause).toHaveBeenCalled();

    await rerender({ paused: false });
    expect(playerMock.play).toHaveBeenCalled();
  });

  it('should set the volume using the "volume" prop', async () => {
    const { playerMock, rerender } = await render({
      video: 'x2y5kyu',
      volume: 0.5,
    });
    expect(playerMock.setVolume).toHaveBeenCalledWith(0.5);

    await rerender({ volume: 1 });

    expect(playerMock.setVolume).toHaveBeenCalledWith(1);
  });

  it('should toggle the mute flag using the "mute" prop', async () => {
    const { sdkMock, playerMock, rerender } = await render({
      video: 'x2y5kyu',
      volume: 0.5,
      mute: true,
    });
    expect(sdkMock.player.calls[0].arguments[1]).toMatch({
      params: {
        mute: true,
      },
    });
    expect(playerMock.setVolume).toHaveBeenCalledWith(0.5);

    await rerender({ mute: false });
    expect(playerMock.setMuted).toHaveBeenCalledWith(false);
    await rerender({ mute: true });
    expect(playerMock.setMuted).toHaveBeenCalledWith(true);
  });

  it('should set the quality when the "quality" prop changes', async () => {
    const { sdkMock, playerMock, rerender } = await render({
      video: 'x2y5kyu',
      quality: 'auto',
    });
    expect(sdkMock.player.calls[0].arguments[1]).toMatch({
      params: {
        quality: 'auto',
      },
    });

    await rerender({ quality: '720' });
    expect(playerMock.setQuality).toHaveBeenCalledWith('720');
    await rerender({ quality: '1440' });
    expect(playerMock.setQuality).toHaveBeenCalledWith('1440');
  });

  it('should set the preferred subtitle language when the "subtitles" prop changes', async () => {
    const { sdkMock, playerMock, rerender } = await render({
      video: 'x2y5kyu',
      subtitles: 'fr',
    });
    expect(sdkMock.player.calls[0].arguments[1]).toMatch({
      params: {
        'subtitles-default': 'fr',
      },
    });

    await rerender({ subtitles: 'nl' });
    expect(playerMock.setSubtitle).toHaveBeenCalledWith('nl');
  });

  it('should set the iframe width/height using the width/height props', async () => {
    const { sdkMock, playerMock, rerender } = await render({
      video: 'x2y5kyu',
      width: 640,
      height: 320,
    });
    expect(sdkMock.player.calls[0].arguments[1]).toMatch({
      width: 640,
      height: 320,
    });

    await rerender({
      width: '100%',
      height: 800,
    });

    expect(playerMock.setWidth).toHaveBeenCalledWith('100%');
    expect(playerMock.setHeight).toHaveBeenCalledWith(800);
  });
});
