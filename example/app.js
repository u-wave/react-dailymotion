/* global document */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dailymotion from '../';

const videos = [
  { id: 'x26ezrb', name: 'Hackathon BeMyApp/Dailymotion' },
  { id: 'x26ezj5', name: 'Greetings' },
  { id: 'x26m1j4', name: 'Wildlife' },
];

const qualities = ['auto', '240', '380', '480', '720', '1080', '1440', '2160'];

class App extends React.Component {
  state = {
    video: 0,
    quality: 'auto',
    volume: 1,
  };

  selectVideo(index) {
    this.setState({ video: index });
  }

  handleVolume = (event) => {
    this.setState({
      volume: parseFloat(event.target.value),
    });
  };

  handleQuality = (event) => {
    this.setState({
      quality: qualities[event.target.selectedIndex],
    });
  };

  render() {
    const video = videos[this.state.video];
    return (
      <div className="row">
        <div className="col s3">
          <h3>Video</h3>
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
          <h3>Volume</h3>
          <input
            type="range"
            value={this.state.volume}
            min={0}
            max={1}
            step={0.01}
            onChange={this.handleVolume}
          />
          <h3>Quality</h3>
          <select className="browser-default" onChange={this.handleQuality}>
            {qualities.map(quality => (
              <option value={quality}>{quality}</option>
            ))}
          </select>
        </div>
        <div className="col s9 center-align">
          <Dailymotion
            video={video.id}
            width={640}
            height={480}
            autoplay
            theme="dark"
            sharing={false}
            uiShowStartScreenInfo={false}
            controls={false}
            quality={this.state.quality}
            volume={this.state.volume}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('example'));
