/* eslint-disable no-var */
import './styles/VideoPlayer.css';
import 'react-activity/dist/Dots.css';

import { IVideo } from '@consumet/extensions';
//import Store from 'electron-store';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';
import BottomControls from './BottomControls';
import MidControls from './MidControls';
import TopControls from './TopControls';

//const STORE = new Store();
const style = getComputedStyle(document.body);
const videoPlayerRoot = document.getElementById('video-player-root');
var timer: any;
var pauseInfoTimer: any;

interface VideoPlayerProps {
  video: IVideo | null;
  titlE: string
  show: boolean;
  loading: boolean;
  onChangeLoading: (value: boolean) => void;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  titlE,
  show,
  loading,
  onChangeLoading,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hlsData, setHlsData] = useState<Hls>();

  const [videoData, setVideoData] = useState<IVideo | null>(null);
  const [title, setTitle] = useState<string>('');
  const [progressUpdated, setProgressUpdated] = useState<boolean>(false);

  // controls
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showPauseInfo, setShowPauseInfo] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [isSettingsShowed, setIsSettingsShowed] = useState<boolean>(false);
  // timeline
  const [currentTime, setCurrentTime] = useState<number>();
  const [duration, setDuration] = useState<number>();
  const [buffered, setBuffered] = useState<TimeRanges>();

  // keydown handlers
  const handleVideoPlayerKeydown = async (
    event: KeyboardEvent | React.KeyboardEvent<HTMLVideoElement>,
  ) => {
    if (event.keyCode === 229 || !videoRef?.current) return;

    const video = videoRef.current;

    switch (event.code) {
      case 'Space': {
        event.preventDefault();
        togglePlaying();
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        video.currentTime -= 5;
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        video.volume = Math.min(video.volume + 0.1, 1);
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        video.currentTime += 5;
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        video.volume = Math.max(video.volume - 0.1, 0);
        break;
      }
      case 'F11': {
        event.preventDefault();
        toggleFullScreen();
        break;
      }
    }
    switch (event.key) {
      case 'f': {
        event.preventDefault();
        toggleFullScreen();
        break;
      }
      case 'm': {
        event.preventDefault();
        toggleMute();
        break;
      }
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLVideoElement>) => {
    if (videoRef.current) {
      handleVideoPlayerKeydown(event);
    }
  };

  useEffect(() => {
    const handleDocumentKeydown = (event: KeyboardEvent) => {
      if (videoRef.current) {
        handleVideoPlayerKeydown(event);
      }
    };

    document.addEventListener('keydown', handleDocumentKeydown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeydown);
    };
  }, [handleVideoPlayerKeydown]);

  useEffect(() => {
    const video = videoRef.current;

    const handleSeeked = () => {
      console.log('seeked');
      onChangeLoading(false);
      if (!video?.paused) setPlaying(true);
    };

    const handleWaiting = () => {
      console.log('waiting');
      onChangeLoading(true);
      setPlaying(false);
    };

    if (video) {
      video.addEventListener('seeked', handleSeeked);
      video.addEventListener('waiting', handleWaiting);

      return () => {
        video.removeEventListener('seeked', handleSeeked);
        video.removeEventListener('waiting', handleWaiting);
      };
    }
  }, []);

  useEffect(() => {
    onChangeLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (video !== null) {
      playHlsVideo(video.url);
      setVideoData(video);
      setTitle(titlE);

    }
  }, [video]);

  const playHlsVideo = (url: string) => {
    try {
      console.log(url)
      if (Hls.isSupported() && videoRef.current) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (videoRef.current) {
            hls.currentLevel = hls.levels.length - 1;
            playVideoAndSetTime();
            setHlsData(hls);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const playVideo = () => {
    if (videoRef.current) {
      try {
        setPlaying(true);
        videoRef.current.play();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      try {
        setPlaying(false);
        videoRef.current.pause();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const togglePlayingWithoutPropagation = (event: any) => {
    if (event.target !== event.currentTarget) return;
    playing ? pauseVideo() : playVideo();
  };

  const togglePlaying = () => {
    try {
      playing ? pauseVideo() : playVideo();
    } catch (error) {
      console.log(error);
    }
  };

  const playVideoAndSetTime = () => {
    try {
      if (videoRef.current) {
        setTimeout(() => {
          playVideo();
          setCurrentTime(videoRef.current?.currentTime);
          setDuration(videoRef.current?.duration);
          onChangeLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current?.paused) {
      setPlaying(true);
      onChangeLoading(false);
    }

    const cTime = videoRef.current?.currentTime;
    const dTime = videoRef.current?.duration;

    try {
      if (cTime && dTime) {
        setShowPauseInfo(false);
        setCurrentTime(cTime);
        setDuration(dTime);
        setBuffered(videoRef.current?.buffered);

        // automatically update progress
        // console.log((cTime * 100) / dTime);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVideoPause = () => {
    clearTimeout(pauseInfoTimer);
    setShowPauseInfo(false);
    pauseInfoTimer = setTimeout(() => {
      !isSettingsShowed && setShowPauseInfo(true);
    }, 7500);
  };

  const handleMouseMove = () => {
    clearTimeout(pauseInfoTimer);
    setShowPauseInfo(false);

    pauseInfoTimer = setTimeout(() => {
      try {
        if (videoRef.current && videoRef.current.paused) {
          setShowPauseInfo(true);
        }
      } catch (error) {
        console.log(error);
      }
    }, 7500);

    clearTimeout(timer);
    setShowControls(true);
    setShowCursor(true);

    setShowPauseInfo(false);

    timer = setTimeout(() => {
      setShowControls(false);
      setShowCursor(false);
    }, 2000);
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      setFullscreen(false);
      document.exitFullscreen();
    }

    onClose();
  };

  const toggleFullScreenWithoutPropagation = (event: any) => {
    if (event.target !== event.currentTarget) return;
    toggleFullScreen();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      setFullscreen(false);
      document.exitFullscreen();
    } else {
      if (document.documentElement.requestFullscreen) {
        setFullscreen(true);
        document.documentElement.requestFullscreen();
      }
    }
  };




  return ReactDOM.createPortal(
    show && (
      <>
        <div
          className={`container ${showControls ? 'show-controls' : ''} ${showPauseInfo ? 'show-pause-info' : ''}`}
          onMouseMove={handleMouseMove}
          ref={containerRef}
          // onKeyDown={handleKeydown}
        >
          <div className="pause-info">
            <div className="content">
              <h1 className="you-are-watching">You are watching</h1>
              <h1 id="pause-info-title">
                {title}
              </h1>
              <h1 id="pause-info-episode-title">{title}</h1>
            </div>
          </div>
          <div
            className={`shadow-controls ${showCursor ? 'show-cursor' : ''}`}
            onClick={togglePlayingWithoutPropagation}
            onDoubleClick={toggleFullScreenWithoutPropagation}
          >
            <TopControls
              videoRef={videoRef}
              hls={hlsData}
              title={title}
              fullscreen={fullscreen}
              onFullScreentoggle={toggleFullScreen}
              onExit={handleExit}
              onClick={togglePlayingWithoutPropagation}
              onDblClick={toggleFullScreenWithoutPropagation}
            />
            <MidControls
              videoRef={videoRef}
              playing={playing}
              playVideo={playVideo}
              pauseVideo={pauseVideo}
              loading={loading}
              onClick={togglePlayingWithoutPropagation}
              onDblClick={toggleFullScreenWithoutPropagation}
            />
            <BottomControls
              videoRef={videoRef}
              containerRef={containerRef}
              currentTime={currentTime}
              duration={duration}
              buffered={buffered}
              onClick={togglePlayingWithoutPropagation}
              onDblClick={toggleFullScreenWithoutPropagation}
            />
          </div>
          <video
            id="video"
            ref={videoRef}
            onKeyDown={handleKeydown}
            onTimeUpdate={handleTimeUpdate}
            onPause={handleVideoPause}
            crossOrigin="anonymous"
          ></video>
        </div>
        <Toaster />
      </>
    ),
    videoPlayerRoot!,
  );
};

export default VideoPlayer;
