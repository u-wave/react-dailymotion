import React from 'react';
import PropTypes from 'prop-types';
import eventNames from './eventNames';
import loadSdk from './loadSdk';

class Dailymotion extends React.Component {
  constructor(props) {
    super(props);

    this.refContainer = (container) => {
      this.container = container;
    };
  }

  componentDidMount() {
    this.createPlayer();
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const changes = Object.keys(this.props).filter((name) => this.props[name] !== prevProps[name]);

    this.updateProps(changes);
  }

  /**
   * @private
   */
  getPlayerParameters() {
    /* eslint-disable react/destructuring-assignment */
    return {
      autoplay: this.props.autoplay,
      controls: this.props.controls,
      'endscreen-enable': this.props.showEndScreen,
      id: this.props.id,
      mute: this.props.mute,
      origin: this.props.origin,
      quality: this.props.quality,
      'queue-autoplay-neext': this.props.autoplayQueue,
      'queue-enable': this.props.showQueue,
      'sharing-enable': this.props.sharing,
      start: this.props.start,
      'subtitles-default': this.props.subtitles,
      syndication: this.props.syndication,
      'ui-highlight': this.props.uiHighlightColor,
      'ui-logo': this.props.uiShowLogo,
      'ui-start-screen-info': this.props.uiShowStartScreenInfo,
      'ui-theme': this.props.uiTheme,
    };
    /* eslint-enable react/destructuring-assignment */
  }

  /**
   * @private
   */
  getInitialOptions() {
    /* eslint-disable react/destructuring-assignment */
    return {
      video: this.props.video,
      width: this.props.width,
      height: this.props.height,
      params: this.getPlayerParameters(),
      events: {},
    };
    /* eslint-enable react/destructuring-assignment */
  }

  /**
   * @private
   */
  updateProps(propNames) {
    this.player.then((player) => {
      propNames.forEach((name) => {
        // eslint-disable-next-line react/destructuring-assignment
        const value = this.props[name];
        switch (name) {
          case 'mute':
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
          case 'paused':
            if (value && !player.paused) {
              player.pause();
            } else if (!value && player.paused) {
              player.play();
            }
            break;
          case 'id':
          case 'className':
          case 'width':
          case 'height':
            // The Dailymotion Player object is also the player iframe.
            player[name] = value; // eslint-disable-line no-param-reassign
            break;
          case 'video':
            if (value) {
              player.load(value, this.getPlayerParameters());
            } else {
              // This is just about the closest thing to an `unload()` the
              // Dailymotion SDK has, as far as I can tell…
              player.pause();
            }
            break;
          default:
            // Nothing
        }
      });
    });
  }

  /**
   * @private
   */
  createPlayer() {
    const { volume } = this.props;

    this.player = loadSdk().then((DM) => {
      const player = DM.player(this.container, this.getInitialOptions());

      Object.keys(eventNames).forEach((dmName) => {
        const reactName = eventNames[dmName];
        player.addEventListener(dmName, (event) => {
          // eslint-disable-next-line react/destructuring-assignment
          const handler = this.props[reactName];
          if (handler) {
            handler(event);
          }
        });
      });

      return new Promise((resolve) => {
        player.addEventListener('apiready', () => {
          resolve(player);
        });
      });
    });

    if (typeof volume === 'number') {
      this.updateProps(['volume']);
    }
  }

  render() {
    const { id, className } = this.props;

    return (
      <div
        id={id}
        className={className}
        ref={this.refContainer}
      />
    );
  }
}

Dailymotion.propTypes = {
  /**
   * A string representing a video ID – of the form xID (e.g. xwr14q) for
   * public-accessible videos or kID (e.g. kABCD1234) for private-accessible
   * videos.
   */
  video: PropTypes.string,
  /**
   * DOM ID for the player element.
   */
  id: PropTypes.string,
  /**
   * CSS className for the player element.
   */
  className: PropTypes.string,
  /**
   * Width of the player element.
   */
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  /**
   * Height of the player element.
   */
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),

  /**
   * Pause the video.
   */
  paused: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

  // Player parameters

  /**
   * Starts the playback of the video automatically after the player loads.
   */
  autoplay: PropTypes.bool,
  /**
   * Whether to display the player controls or not. This parameter only
   * removes the control bar, but keeps the startscreen and the endscreen
   * (useful on mobile devices where the video tag needs a direct user
   * interaction to start the playback).
   */
  controls: PropTypes.bool,
  /**
   * Whether to enable the end screen or not.
   */
  showEndScreen: PropTypes.bool,
  /**
   * Whether to mute the video or not.
   */
  mute: PropTypes.bool,
  /**
   * The domain of the page hosting the Dailymotion player. You might want to
   * specify origin for extra security.
   */
  origin: PropTypes.string,
  /**
   * Specifies the _suggested_ playback quality for the video.
   */
  quality: PropTypes.oneOf(['auto', '240', '380', '480', '720', '1080', '1440', '2160']),
  /**
   * Whether to show the Up Next queue.
   */
  showQueue: PropTypes.bool,
  /**
   * Whether to play automatically the next item in the queue.
   */
  autoplayQueue: PropTypes.bool,
  /**
   * Whether to display the sharing button or not.
   */
  sharing: PropTypes.bool,
  /**
   * Specifies the time (in seconds) from which the video should start
   * playing.
   */
  start: PropTypes.number,
  /**
   * Specifies the selected subtitles language.
   */
  subtitles: PropTypes.string,
  /**
   * Passes your syndication key to the player.
   */
  syndication: PropTypes.string,
  /**
   * Change the default highlight colour used in the controls (hex value).
   * See [the player customisation section](https://developer.dailymotion.com/player#player-customisation)
   * in the Dailymotion docs for
   * more on how this option is actually used.
   */
  uiHighlightColor: PropTypes.string,
  /**
   * Whether to display the Dailymotion logo or not.
   */
  uiShowLogo: PropTypes.bool,
  /**
   * Whether to show video information (title and owner) on the start screen.
   */
  uiShowStartScreenInfo: PropTypes.bool,
  /**
   * Choose the default base colour theme. See [the player customisation
   * section](https://developer.dailymotion.com/player#player-customisation)
   * in the Dailymotion docs for more on how this option is actually used.
   */
  uiTheme: PropTypes.oneOf(['light', 'dark']),

  // Player properties (not parameters, can only be set using methods)

  /**
   * Sets the player's volume to the specified level, a number between 0 and
   * 1.
   */
  volume: PropTypes.number,

  // Events
  /* eslint-disable react/no-unused-prop-types */

  /**
   * Sent when the player reaches the end of an Ad media resource.
   */
  onAdEnd: PropTypes.func,
  /**
   * Sent when an Ad playback pauses.
   */
  onAdPause: PropTypes.func,
  /**
   * Sent when an Ad playback starts.
   */
  onAdPlay: PropTypes.func,
  /**
   * Sent when the player starts to play an Ad media resource.
   */
  onAdStart: PropTypes.func,
  /**
   * Sent on each Ad's time update.
   */
  onAdTimeUpdate: PropTypes.func,
  /**
   * Sent when the player is ready to accept API commands.
   */
  onApiReady: PropTypes.func,
  /**
   * Sent when the duration of the video become available or change during
   * playback.
   */
  onDurationChange: PropTypes.func,
  /**
   * Sent when playback has stopped at the end of the media resources set
   * (ads + content).
   */
  onEnd: PropTypes.func,
  /**
   * Sent when the player triggers an error.
   */
  onError: PropTypes.func,
  /**
   * Sent when the player enters or exits fullscreen.
   */
  onFullscreenChange: PropTypes.func,
  /**
   * Sent when video's metadata are available.
   */
  onLoadedMetadata: PropTypes.func,
  /**
   * Sent when playback pauses after the pause method returns.
   */
  onPause: PropTypes.func,
  /**
   * Sent when playback starts after the `play` method returns.
   */
  onPlay: PropTypes.func,
  /**
   * Sent when the content media resource playback has started.
   */
  onPlaying: PropTypes.func,
  /**
   * Sent when the browser is fetching the media data.
   */
  onProgress: PropTypes.func,
  /**
   * Sent when qualities are available – see `qualities` for accepted values.
   */
  onQualitiesAvailable: PropTypes.func,
  /**
   * Sent when the current quality changes.
   */
  onQualityChange: PropTypes.func,
  /**
   * Sent when the player has completed a seeking operation.
   */
  onSeeked: PropTypes.func,
  /**
   * Sent when the player is starting to seek to another position in the video.
   */
  onSeeking: PropTypes.func,
  /**
   * Sent when the current subtitle changes.
   */
  onSubtitleChange: PropTypes.func,
  /**
   * Sent when subtitles are available.
   */
  onSubtitlesAvailable: PropTypes.func,
  /**
   * Sent the first time the player attempts to start the playback, either
   * because of a user interaction, an autoplay parameter, or an API call
   * (e.g play(), load(), etc.).
   */
  onStart: PropTypes.func,
  /**
   * Sent when the playback position changes as part of normal playback or
   * because of some other condition.
   */
  onTimeUpdate: PropTypes.func,
  /**
   * Sent when the player starts to play the content media resource.
   */
  onVideoStart: PropTypes.func,
  /**
   * Sent when the player reaches the end of the content media resource.
   */
  onVideoEnd: PropTypes.func,
  /**
   * Sent when the player volume or mute state has changed.
   */
  onVolumeChange: PropTypes.func,
  /**
   * Sent when the player has to stop video playback for further buffering of
   * content.
   */
  onWaiting: PropTypes.func,

  /* eslint-enable react/no-unused-prop-types */
};

Dailymotion.defaultProps = {
  uiTheme: 'dark',
  quality: 'auto',
  showQueue: false,
  autoplayQueue: false,
};

export default Dailymotion;
