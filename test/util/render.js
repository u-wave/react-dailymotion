/**
 * Taken from react-youtube's tests at
 * https://github.com/troybetz/react-youtube
 */

import React from 'react';
import ReactDOM from 'react-dom';
import document from 'global/document';
import createDailymotion from './createDailymotion';

global.window = { document };
global.document = document;

const render = (props) => {
  const { Dailymotion, sdkMock, playerMock } = createDailymotion();

  let component;
  // Emulate changes to component.props using a container component's state
  class Container extends React.Component {
    constructor(dmProps) {
      super(dmProps);

      this.state = dmProps;
    }

    render() {
      return (
        <Dailymotion
          ref={(dailymotion) => { component = dailymotion; }}
          {...this.state}
        />
      );
    }
  }

  const div = document.createElement('div');
  const container = new Promise((resolve) => {
    ReactDOM.render(<Container {...props} ref={resolve} />, div);
  });

  function rerender(newProps) {
    return container.then(wrapper => (
      new Promise((resolve) => {
        wrapper.setState(newProps, () => {
          Promise.resolve().then(resolve);
        });
      })
    ));
  }

  function unmount() {
    ReactDOM.unmountComponentAtNode(div);
  }

  return component.player.then(() => ({
    sdkMock,
    playerMock,
    component,
    rerender,
    unmount,
  }));
};

export default render;
