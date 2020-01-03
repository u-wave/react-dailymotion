import React from 'react';
import ReactDOM from 'react-dom';
import Dailymotion from '..';

const videos = [
  { id: 'x26ezrb', name: 'Hackathon BeMyApp/Dailymotion' },
  { id: 'x26ezj5', name: 'Greetings' },
  { id: 'x26m1j4', name: 'Wildlife' },
];

const qualities = ['auto', '240', '380', '480', '720', '1080', '1440', '2160'];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoIndex: 0,
      quality: 'auto',
      volume: 1,
      paused: false,
    };

    this.handlePause = this.handlePause.bind(this);
    this.handlePlayerPause = this.handlePlayerPause.bind(this);
    this.handlePlayerPlay = this.handlePlayerPlay.bind(this);
    this.handleVolume = this.handleVolume.bind(this);
    this.handleQuality = this.handleQuality.bind(this);
  }

  selectVideo(index) {
    this.setState({ videoIndex: index });
  }

  handlePause(event) {
    this.setState({
      paused: event.target.checked,
    });
  }

  handlePlayerPause() {
    this.setState({ paused: true });
  }

  handlePlayerPlay() {
    this.setState({ paused: false });
  }

  handleVolume(event) {
    this.setState({
      volume: parseFloat(event.target.value),
    });
  }

  handleQuality(event) {
    this.setState({
      quality: qualities[event.target.selectedIndex],
    });
  }

  render() {
    const {
      videoIndex, paused, volume, quality,
    } = this.state;

    const video = videos[videoIndex];
    return (
      <div className="row">
        <div className="col s4">
          <h5>
            Video
          </h5>
          <div className="collection">
            {videos.map((choice, index) => (
              <a
                href={`#!/video/${index}`}
                className={`collection-item ${video === choice ? 'active' : ''}`}
                onClick={() => this.selectVideo(index)}
              >
                {choice.name}
              </a>
            ))}
          </div>
          <h5>
            Paused
          </h5>
          <p>
            <label htmlFor="paused">
              <input
                type="checkbox"
                id="paused"
                checked={paused}
                onChange={this.handlePause}
              />
              <span>Paused</span>
            </label>
          </p>
          <h5>
            Volume
          </h5>
          <input
            type="range"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={this.handleVolume}
          />
          <h5>
            Quality
          </h5>
          <select className="browser-default" onChange={this.handleQuality}>
            {qualities.map((option) => (
              <option value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col s8 center-align">
          <Dailymotion
            video={video.id}
            width={640}
            height={480}
            autoplay
            theme="dark"
            sharing={false}
            uiShowStartScreenInfo={false}
            controls={false}
            quality={quality}
            volume={volume}
            paused={paused}
            onPause={this.handlePlayerPause}
            onPlay={this.handlePlayerPlay}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('example'));
