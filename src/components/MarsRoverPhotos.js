import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const MarsRoverPhotosPage = () => {
  const [rover, setRover] = useState('');
  const [curiosityPhotos, setCuriosityPhotos] = useState([]);
  const [opportunityPhotos, setOpportunityPhotos] = useState([]);
  const [spiritPhotos, setSpiritPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const photosPerPage = 25;
  const apiKey = 'mn0cL646A86fzVD3vI3MdMpphxncHeUDjNCzgPja';
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [availableCameras, setAvailableCameras] = useState([
    'FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'PANCA', 'MINITES', 'NAVCAM'
  ]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (rover === 'curiosity') {
      setIsLoading(true);
      fetchPhotosForRover('curiosity', setCuriosityPhotos);
    } else if (rover === 'opportunity') {
      setIsLoading(true);
      fetchPhotosForRover('opportunity', setOpportunityPhotos);
    } else if (rover === 'spirit') {
      setIsLoading(true);
      fetchPhotosForRover('spirit', setSpiritPhotos);
    }
    setAvailableCameras([
      'FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'PANCA', 'MINITES', 'NAVCAM'
    ]);
  }, [rover]);

  const fetchPhotosForRover = async (roverName, setPhotosCallback) => {
    try {
      const response = await axios.get(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/latest_photos?api_key=${apiKey}`
      );
      const latestPhotos = response.data.latest_photos;
      setPhotosCallback(latestPhotos);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setIsLoading(false);
    }
  };

  const handleRoverChange = (selectedRover) => {
    console.log('Changing rover to:', selectedRover);

    setRover(selectedRover);
    setSelectedCamera('');
    setCurrentPage(0);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const filteredPhotos = selectedCamera
    ? (rover === 'curiosity'
        ? curiosityPhotos
        : rover === 'opportunity'
        ? opportunityPhotos
        : spiritPhotos
      ).filter((photo) => photo.camera.name === selectedCamera)
    : rover === 'curiosity'
    ? curiosityPhotos
    : rover === 'opportunity'
    ? opportunityPhotos
    : spiritPhotos;

  filteredPhotos.sort((a, b) => new Date(b.earth_date) - new Date(a.earth_date));

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
              {availableCameras.map((cameraName) => (
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
                  <div
                    className="photo-card"
                    key={photo.id}
                    onClick={() => handlePhotoClick(photo)}
                  >
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
      {selectedPhoto && (
        <div className="photo-modal">
          <div className="photo-modal-content">
            <span className="photo-modal-close" onClick={handleClosePhoto}>
              &times;
            </span>
            <img
              src={selectedPhoto.img_src}
              alt={`Mars ${selectedPhoto.id}`}
              className="enlarged-photo"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MarsRoverPhotosPage;
