import React from 'react';
import Link from 'next/link';

const MainPage = () => (
  <div className="main-page">
    <h1>Welcome to the Mars Rover Photos App</h1>
    <Link href="/roverphotos">
      <div className="rover-button-main">Explore Rover Photos</div>
    </Link>
  </div>
);

export default MainPage;