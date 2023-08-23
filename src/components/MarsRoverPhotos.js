import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarsRoverPhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const apiKey = 'mn0cL646A86fzVD3vI3MdMpphxncHeUDjNCzgPja';

  useEffect(() => {
    axios
      .get(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${apiKey}`
      )
      .then((response) => {
        setPhotos(response.data.photos);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Mars Rover Photos</h1>
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
