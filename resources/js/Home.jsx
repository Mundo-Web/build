import React from 'react';
import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';

import Sliders from './Components/Home/Sliders';
import Indicators from './Components/Home/Indicators';
import Weare from './Components/Home/Weare';
import Courses from './Components/Home/Courses';
import MoreCourses from './Components/Home/MoreCourses';
import Testimonies from './Components/Home/Testimonies';
import Articles from './Components/Home/Articles';
import AboutTrasciende from './Components/Home/AboutTrasciende';
import ArrayDetails2Object from './Utils/ArrayDetails2Object';
import LazySection from './Components/LazySection';

const Home = ({ sliders, indicators = [], aboutKaori, courses, testimonies, articles, details: detailsDB }) => {
  const details = ArrayDetails2Object(detailsDB)
  return (
    <>
      <Sliders sliders={sliders} />
      {
        indicators.length > 0 &&
        <Indicators indicators={indicators} />
      }
      {
        aboutKaori &&
        <Weare info={aboutKaori} />
      }
      {
        details['about.video'] &&
        <AboutTrasciende details={details} />
      }
      {
        courses.length > 0 &&
        <LazySection height="500px">
          <MoreCourses courses={courses} details={details} />
        </LazySection>
      }
      {
        testimonies.length > 0 &&
        <LazySection height="400px">
          <Testimonies testimonies={testimonies} details={details} />
        </LazySection>
      }
      {
        articles.length > 0 &&
        <LazySection height="400px">
          <Articles articles={articles} details={details} />
        </LazySection>
      }
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<Base {...properties}>
    <Home {...properties} />
  </Base>);
})