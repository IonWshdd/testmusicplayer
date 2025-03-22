import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './Home.js';
import Track from './Track.js';
import Bully from './bully.js';

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/track",
      element: <Track />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body;
