import { IVideo, IMovieInfo } from '@consumet/extensions';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import toast from 'react-hot-toast';
import { getMediaInfo, getEpisodeUrl } from '../../../modules/movies/flixhq';
import { ButtonCircle } from '../Buttons';
import VideoPlayer from '../player/VideoPlayer';

const modalsRoot = document.getElementById('modals-root');
const style = getComputedStyle(document.body);

interface MovieModalProps {
  mediaData: any;
  show: boolean;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({
  mediaData,
  show,
  onClose,
}) => {

  // episodes info
  const [episodesInfoHasFetched, setEpisodesInfoHasFetched] =
    useState<boolean>(false);
  const [episodesInfo, setEpisodesInfo] = useState<IMovieInfo>();

  // player
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [playerIVideo, setPlayerIVideo] = useState<IVideo | null>(null);

  // other
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log(`%c Movie: ${mediaData.id}, looking for info...`, `color: #6b8cff`);
    if (!episodesInfoHasFetched) fetchEpisodesInfo();
  }, []);

  useEffect(() => {
    if (!showPlayer) {
      setPlayerIVideo(null);
    }
  }, [showPlayer]);

  const fetchEpisodesInfo = async () => {

    await getMediaInfo(mediaData.id).then((data) => {
      setEpisodesInfo(data);
      setEpisodesInfoHasFetched(true);
    })
    .catch(() => {setEpisodesInfoHasFetched(true);});
  };

  const playEpisode = async () => {
    setShowPlayer(true);
    setLoading(true);

    getEpisodeUrl(mediaData.id, episodesInfo?.episodes[0]?.id).then((data) => {
      if (!data) {
        toast(`Source not found.`, {
          style: {
            color: style.getPropertyValue('--font-2'),
            backgroundColor: style.getPropertyValue('--color-3'),
          },
          icon: '❌',
        });
        setLoading(false);

        return;
      }
      setPlayerIVideo(data);
    });
  };

  const handleChangeLoading = (value: boolean) => {
    setLoading(value);
  };

  const handlePlayerClose = () => {
    try {
      setShowPlayer(false);
    } catch (error) {
      console.log(error);
    }
  };
  if (!show) return null;
  return ReactDOM.createPortal(
    <>
      {showPlayer && (
        <VideoPlayer
          video={playerIVideo}
          titlE={String(episodesInfo.title)}
          show={showPlayer}
          loading={loading}
          onChangeLoading={handleChangeLoading}
          onClose={handlePlayerClose}
        />
      )}
      <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h1 className="title">{mediaData.title}</h1>
        <p>Type: {mediaData.type}</p>
        <button onClick={playEpisode} className="bg-red-400 text-black p-10">
        play
        </button>
        <img src={mediaData.image} alt={mediaData.title} />
      </div>
    </div>
    </>,
    modalsRoot!,
  );
};

export default MovieModal;
