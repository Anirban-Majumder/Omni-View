import 'react-activity/dist/Dots.css';

import {
  faAngleLeft,
  faCompress,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//import { ListAnimeData } from '../../../types/anilistAPITypes';
import VideoSettings from './VideoSettings';
import Hls from 'hls.js';
import { EpisodeInfo } from '../../../types';
import { useState } from 'react';

interface TopControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  hls?: Hls;
  title: string;
  fullscreen: boolean;
  onFullScreentoggle: () => void;
  onExit: () => void;
  onClick?: (event: any) => void;
  onDblClick?: (event: any) => void;
}

const TopControls: React.FC<TopControlsProps> = ({
  videoRef,
  hls,
  title,
  fullscreen,
  onFullScreentoggle,
  onExit,
  onClick,
  onDblClick,
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const closeOthers = () => {
    setShowSettings(false);
    if (videoRef.current) videoRef.current.focus();
  };

  return (
    <div className="up-controls" onClick={onClick} onDoubleClick={onDblClick}>
      <div className="left">
        <div className="info exit-video" onClick={onExit}>
          <span className="back">
            <FontAwesomeIcon className="i" icon={faAngleLeft} />
            <span className="episode">
              {title}
            </span>
          </span>
        </div>
      </div>
      <div className="center"></div>
      <div className="right">
        <VideoSettings
          show={showSettings}
          onShow={(show) => {
            closeOthers();
            setShowSettings(show);
          }}
          videoRef={videoRef}
          hls={hls}
        />
        <button className="b-player fullscreen" onClick={onFullScreentoggle}>
          <FontAwesomeIcon
            className="i"
            icon={fullscreen ? faCompress : faExpand}
          />
        </button>
      </div>
    </div>
  );
};

export default TopControls;
