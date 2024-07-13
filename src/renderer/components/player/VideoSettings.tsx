import { faClock } from '@fortawesome/free-regular-svg-icons';
import {
  faGear,
  faHeadphones,
  faLanguage,
  faRotateRight,
  faSpinner,
  faVideo,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Hls from 'hls.js';
import { ChangeEvent, useEffect, useState } from 'react';
import 'react-activity/dist/Dots.css';
import { Dots } from 'react-activity';


interface SettingsProps {
  show: boolean;
  onShow: (show: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  hls?: Hls;
}

// component for the video player settings tab
const VideoSettings: React.FC<SettingsProps> = ({
  show,
  onShow,
  videoRef,
  hls,
}) => {
  const [hlsData, setHlsData] = useState<Hls>();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);


  useEffect(() => {
    const handleVideoVolumeChange = () => {
      if (videoRef.current) {
        setIsMuted(videoRef.current.muted);
        setVolume(videoRef.current.volume);
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('volumechange', handleVideoVolumeChange);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener(
          'volumechange',
          handleVideoVolumeChange,
        );
      }
    };
  }, []);

  const toggleShow = () => {
    onShow(!show);
  };

  useEffect(() => {
    setHlsData(hls);
  }, [hls]);

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (hlsData) {
      hlsData.currentLevel = parseInt(event.target.value);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      if (videoRef.current.muted) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume);
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Math.min(Math.max(parseFloat(event.target.value), 0), 1);
    console.log(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = parseFloat(event.target.value);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };





  return (
    <div className="settings-content">
      <button
        className={`b-player ${show ? 'active' : ''}`}
        onClick={toggleShow}
      >
        <FontAwesomeIcon className="i" icon={faGear} />
      </button>
      {show && (
        <div className="dropdown">
          <li className="quality">
            <span>
              <FontAwesomeIcon className="i" icon={faVideo} />
              Quality
            </span>
            <select
              className="main-select-0"
              onChange={handleQualityChange}
              value={hlsData?.currentLevel}
            >
              {hlsData &&
                hlsData?.levels?.map((level, index) => (
                  <option key={index} value={index}>
                    {`${level.height}p`}
                  </option>
                ))}
            </select>
          </li>
          <li className="volume">
            <span onClick={toggleMute}>
              {isMuted ? (
                <FontAwesomeIcon className="i" icon={faVolumeXmark} />
              ) : volume <= 0.3 ? (
                <FontAwesomeIcon className="i" icon={faVolumeLow} />
              ) : (
                <FontAwesomeIcon className="i" icon={faVolumeHigh} />
              )}
              Volume
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={1}
              value={volume}
              onChange={handleVolumeChange}
            />
          </li>
          <li className="playback">
            <span>
              <FontAwesomeIcon className="i" icon={faClock} />
              Speed
            </span>
            <select className="main-select-0" onChange={handleSpeedChange}>
              <option value="0.25">0.25</option>
              <option value="0.50">0.50</option>
              <option value="0.75">0.75</option>
              <option value="1" selected>
                Normal
              </option>
              <option value="1.25">1.25</option>
              <option value="1.50">1.50</option>
              <option value="1.75">1.75</option>
              <option value="2">2</option>
            </select>
          </li>
        </div>
      )}
    </div>
  );
};

export default VideoSettings;
