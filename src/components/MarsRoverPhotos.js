import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarsRoverPhotosPage = () => {
  const [rover, setRover] = useState('');
  const [photos, setPhotos] = useState([]);
  const apiKey = 'mn0cL646A86fzVD3vI3MdMpphxncHeUDjNCzgPja';

  useEffect(() => {
    if (rover) {
      axios
        .get(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&api_key=${apiKey}`,
        )
        .then((response) => {
          setPhotos(response.data.photos);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [rover]);

  const handleRoverChange = (selectedRover) => {
    setRover(selectedRover);
  };

  return (
    <div>
      <div>
        <button type="button" onClick={() => handleRoverChange('curiosity')}>Curiosity</button>
        <button type="button" onClick={() => handleRoverChange('opportunity')}>Opportunity</button>
        <button type="button" onClick={() => handleRoverChange('spirit')}>Spirit</button>
      </div>
      {photos.length > 0 ? (
        <div>
          {photos.map((photo) => (
            <div key={photo.id}>
              <h2>{photo.camera.full_name}</h2>
              <img
                src={photo.img_src}
                alt={`Mars ${photo.id}`}
                style={{ maxWidth: '100%' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MarsRoverPhotosPage;
