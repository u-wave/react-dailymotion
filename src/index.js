import * as React from 'react';
import loadScript from 'load-script';

let apiPromise = false;

function loadApi(apiKey) {
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      loadScript('https://api.dmcdn.net/all.js', (err) => {
        if (err) {
          reject(err);
        } else {
          window.DM.init({ apiKey });
          resolve(window.DM);
        }
      });
    });
  }
  return apiPromise;
}

export default class Dailymotion extends React.Component {
  static propTypes = {
    video: React.PropTypes.string,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    autoplay: React.PropTypes.bool,
    controls: React.PropTypes.bool,
    showEndScreen: React.PropTypes.bool,
    id: React.PropTypes.string,
    mute: React.PropTypes.bool,
    origin: React.PropTypes.string,
    quality: React.PropTypes.oneOf(['240', '380', '480', '720', '1080', '1440', '2160']),
    sharing: React.PropTypes.bool,
    start: React.PropTypes.number,
    subtitles: React.PropTypes.string,
    syndication: React.PropTypes.string,
    uiHighlightColor: React.PropTypes.string,
    uiShowLogo: React.PropTypes.bool,
    uiShowStartScreenInfo: React.PropTypes.bool,
    theme: React.PropTypes.oneOf(['light', 'dark']),
  };

  static defaultProps = {
    apiKey: null,
    theme: 'dark',
  };

  static setApiKey(apiKey) {
    Dailymotion.defaultProps.apiKey = apiKey;
  }

  componentDidMount() {
    this.createPlayer();
  }

  getInitialOptions() {
    return {
      video: this.props.video,
      width: this.props.width,
      height: this.props.height,
      params: {
        autoplay: this.props.autoplay,
        controls: this.props.controls,
        'endscreen-enable': this.props.showEndScreen,
        id: this.props.id,
        mute: this.props.mute,
        origin: this.props.origin,
        quality: this.props.quality,
        'sharing-enable': this.props.sharing,
        start: this.props.start,
        'subtitles-default': this.props.subtitles,
        syndication: this.props.syndication,
        'ui-highlight': this.props.uiHighlightColor,
        'ui-logo': this.props.uiShowLogo,
        'ui-start-screen-info': this.props.uiShowStartScreenInfo,
        'ui-theme': this.props.theme,
      },
      events: {
      },
    };
  }

  createPlayer() {
    this.player = loadApi().then(DM =>
      DM.player(this.container, this.getInitialOptions())
    );
  }

  refContainer = container => {
    this.container = container;
  };

  render() {
    return React.createElement('div', {
      ref: this.refContainer,
    });
  }
}
