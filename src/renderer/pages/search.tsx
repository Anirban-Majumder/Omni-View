import React, { useState } from "react";
import { getSearchResult } from '../../modules/utils';
import MovieModal from '../components/modal/MovieModal';

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serchedMedia, setSearchedMedia] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaData, setmediaData] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hasModalBeenShowed, setHasModalBeenShowed] = useState<boolean>(false);

  // Handle search input changes
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const performSearch = async () => {
    setSearchedMedia(undefined);
    setIsLoading(true);

    setSearchedMedia(await getSearchResult(searchQuery, "movie"));
    setIsLoading(false);

  };

  // Handle search form submission
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch();
  };

  return (
    <>
      {mediaData && hasModalBeenShowed && (
        <MovieModal
          mediaData={mediaData}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      <div>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search..."
          />
          <button type="submit">Search</button>
        </form>
        <div className="entries-container border-red-600">
          {!serchedMedia ? (
            <div className="activity-indicator">
              .......
            </div>
          ) : (
            serchedMedia.results?.map((value: any, index: any) => (
              <div key={index}
                onClick={() => {
                  setmediaData(value);
                  setShowModal(true);
                  if (!hasModalBeenShowed) setHasModalBeenShowed(true);
                }}>
                <div>{value.title}</div>
                <img src={value.image} alt={value.title} />
              </div>
            ))
          )}
        </div>
      </div>
    </>);

}

export default Search;