import React, { lazy } from 'react';

// Lazy-loaded components
const Home = lazy(() => import('./components/home/Home'));

// Routes configuration
const routes = {
    home: { path: '/', element: <Home />, title: 'Home' },
};

export default routes;