import * as React from 'react';
import loadScript from 'load-script';

import eventNames from './eventNames';

let apiPromise = false;

function loadApi() {
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      loadScript('https://api.dmcdn.net/all.js', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(window.DM);
        }
      });
    });
  }
  return apiPromise;
}

const sizePropType = React.PropTypes.oneOfType([
  React.PropTypes.number,
  React.PropTypes.string
]);

export default class Dailymotion extends React.Component {
  static propTypes = {
    video: React.PropTypes.string,
    width: sizePropType,
    height: sizePropType,

    // Player parameters
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

    // Player properties (not parameters, can only be set using methods)
    volume: React.PropTypes.number,

    // Events
    onAdEnd: React.PropTypes.func,
    onAdPause: React.PropTypes.func,
    onAdPlay: React.PropTypes.func,
    onAdStart: React.PropTypes.func,
    onAdTimeUpdate: React.PropTypes.func,
    onApiReady: React.PropTypes.func,
    onDurationChange: React.PropTypes.func,
    onEnd: React.PropTypes.func,
    onError: React.PropTypes.func,
    onFullscreenChange: React.PropTypes.func,
    onLoadedMetadata: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    onPlaying: React.PropTypes.func,
    onProgress: React.PropTypes.func,
    onQualitiesAvailable: React.PropTypes.func,
    onQualityChange: React.PropTypes.func,
    onSeeked: React.PropTypes.func,
    onSeeking: React.PropTypes.func,
    onSubtitleChange: React.PropTypes.func,
    onSubtitlesAvailable: React.PropTypes.func,
    onStart: React.PropTypes.func,
    onTimeUpdate: React.PropTypes.func,
    onVideoStart: React.PropTypes.func,
    onVideoEnd: React.PropTypes.func,
    onVolumeChange: React.PropTypes.func,
    onWaiting: React.PropTypes.func,
  };

  static defaultProps = {
    theme: 'dark',
  };

  componentDidMount() {
    this.createPlayer();
  }

  componentDidUpdate(prevProps) {
    const changes = Object.keys(this.props).filter(
      name => this.props[name] !== prevProps[name]
    );

    this.updateProps(changes);
  }

  getPlayerParameters() {
    return {
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
    };
  }

  getInitialOptions() {
    return {
      video: this.props.video,
      width: this.props.width,
      height: this.props.height,
      params: this.getPlayerParameters(),
      events: {},
    };
  }

  updateProps(propNames) {
    this.player.then(player => {
      propNames.forEach(name => {
        const value = this.props[name];
        switch (name) {
          case 'muted':
            player.setMuted(value);
            break;
          case 'quality':
            player.setQuality(value);
            break;
          case 'subtitles':
            player.setSubtitle(value);
            break;
          case 'volume':
            player.setVolume(value);
            break;
          case 'video':
            player.load(value, this.getPlayerParameters());
            break;
          default:
            // Nothing
        }
      });
    });
  }

  createPlayer() {
    this.player = loadApi().then(DM =>
      new Promise(resolve => {
        const player = DM.player(this.container, this.getInitialOptions());
        player.addEventListener('apiready', () => {
          resolve(player);
        });

        Object.keys(eventNames).forEach(dmName => {
          const reactName = eventNames[dmName];
          player.addEventListener(dmName, event => {
            if (this.props[reactName]) {
              this.props[reactName](event);
            }
          });
        });
      })
    );

    if (typeof this.props.volume === 'number') {
      this.updateProps(['volume']);
    }
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
