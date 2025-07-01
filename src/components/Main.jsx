import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from '../routes'

const Main = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        {Object.values(routes).map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </Suspense>
  );
}

export default Main;