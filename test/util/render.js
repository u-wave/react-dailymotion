/**
 * Taken from react-youtube's tests at
 * https://github.com/troybetz/react-youtube
 */

import React from 'react';
import ReactDOM from 'react-dom';
import env from 'min-react-env';
import createDailymotion from './createDailymotion';

Object.assign(global, env);

const render = (initialProps) => {
  const { Dailymotion, sdkMock, playerMock } = createDailymotion();

  let component;
  // Emulate changes to component.props using a container component's state
  class Container extends React.Component {
    constructor(dmProps) {
      super(dmProps);

      this.state = { props: dmProps };
    }

    render() {
      const { props } = this.state;

      return (
        <Dailymotion
          ref={(dailymotion) => { component = dailymotion; }}
          {...props}
        />
      );
    }
  }

  const div = env.document.createElement('div');
  const container = new Promise((resolve) => {
    ReactDOM.render(<Container {...initialProps} ref={resolve} />, div);
  });

  function rerender(newProps) {
    return container.then((wrapper) => (
      new Promise((resolve) => {
        wrapper.setState({ props: newProps }, () => {
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
