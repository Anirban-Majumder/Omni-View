import DramaCool from "@consumet/extensions/dist/providers/movies/dramacool";
import { IVideo,IMovieInfo,ISource } from '@consumet/extensions';


const consumet = new DramaCool();

/**
 * 
 * @param mediaId 
 * @returns {Promise<IMovieInfo>} 
 */
export const getMediaInfo = async (
  mediaId: string
): Promise<IMovieInfo> => {
  console.log(`%c Media: ${mediaId}, looking for info...`, `color: #6b8cff`);
  return await consumet.fetchMediaInfo(mediaId);
}

/**
 * 
 *
 * @param {*} mediaId
 * @param {*} episodeId
 * @returns 
 */
export const getEpisodeUrl = async (
  mediaId: string,
  episodeId: string,
): Promise<IVideo | null> => {
  const data = await consumet.fetchEpisodeSources( episodeId);
  return getDefaultQualityVideo(data.sources);
};

export const getDefaultQualityVideo = (videos: IVideo[]): IVideo =>
  videos.find((video) => video.quality === 'default') ??
  getBestQualityVideo(videos);

export const getBestQualityVideo = (videos: IVideo[]): IVideo => {
  const qualityOrder = ['1080p', '720p', '480p', '360p', 'default', 'backup'];

  videos.sort((a, b) => {
    const indexA = qualityOrder.indexOf(a.quality || 'default');
    const indexB = qualityOrder.indexOf(b.quality || 'default');

    if (indexA < indexB) return -1;
    if (indexA > indexB) return 1;
    return 0;
  });

  return videos[0];
};