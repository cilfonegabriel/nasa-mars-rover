import React from 'react';
import Link from 'next/link';

const MainPage = () => (
  <div className="main-page">
    <h1>Welcome to the Mars Rover Photos App</h1>
    <p>Explore the wonders of Mars with NASA&apos;s rover photos!</p>
    <Link href="/roverphotos">
      <div className="rover-button">Explore Rover Photos</div>
    </Link>
  </div>
);

export default MainPage;
