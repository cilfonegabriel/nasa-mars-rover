import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const MarsRoverPhotosPage = () => {
  const [rover, setRover] = useState('');
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const photosPerPage = 25;
  const apiKey = 'mn0cL646A86fzVD3vI3MdMpphxncHeUDjNCzgPja';
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('');

  useEffect(() => {
    if (rover) {
      setIsLoading(true);
      axios
        .get(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?earth_date=2023-12-31&api_key=${apiKey}`,
        )
        .then((response) => {
          setPhotos(response.data.latest_photos);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        });
    }
  }, [rover]);

  const handleRoverChange = (selectedRover) => {
    setRover(selectedRover);
    setSelectedCamera('');
    setCurrentPage(0);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cameraOptions = Array.from(
    new Set(photos.map((photo) => photo.camera.name))
  );

  const filteredPhotos = selectedCamera
    ? photos.filter((photo) => photo.camera.name === selectedCamera)
    : photos;

  const indexOfLastPhoto = (currentPage + 1) * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos.slice(
    indexOfFirstPhoto,
    indexOfLastPhoto
  );

  const isRoverSelected = rover !== '';
  const isCameraSelected = selectedCamera !== '';

  return (
    <div className="mars-rover-photos-container">
      <div className="header">
        <h1>NASA Mars Rover Photos</h1>
      </div>
      <div className="rover-buttons">
        <button
          className="rover-button"
          onClick={() => handleRoverChange('curiosity')}
        >
          Curiosity
        </button>
        <button
          className="rover-button"
          onClick={() => handleRoverChange('opportunity')}
        >
          Opportunity
        </button>
        <button
          className="rover-button"
          onClick={() => handleRoverChange('spirit')}
        >
          Spirit
        </button>
      </div>
      {isRoverSelected && (
        <div>
          <div className="camera-dropdown">
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
            >
              <option value="">All Cameras</option>
              {cameraOptions.map((cameraName) => (
                <option key={cameraName} value={cameraName}>
                  {cameraName}
                </option>
              ))}
            </select>
          </div>
          <div className="rover-photos-container">
            <div className="photo-gallery">
              {isLoading ? (
                <p>Loading...</p>
              ) : currentPhotos.length > 0 ? (
                currentPhotos.map((photo) => (
                  <div className="photo-card" key={photo.id}>
                    <h2 className="camera-name">{photo.camera.full_name}</h2>
                    <img
                      src={photo.img_src}
                      alt={`Mars ${photo.id}`}
                      className="rover-photo"
                    />
                    <p className="photo-date">Date Taken: {photo.earth_date}</p>
                  </div>
                ))
              ) : (
                <p>No photos available.</p>
              )}
            </div>
            {isCameraSelected && (
              <div className="pagination-container">
                <ReactPaginate
                  previousLabel={'← Previous'}
                  nextLabel={'Next →'}
                  pageCount={Math.ceil(filteredPhotos.length / photosPerPage)}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarsRoverPhotosPage;
