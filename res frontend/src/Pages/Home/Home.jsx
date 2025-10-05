  // src/pages/Home/Home.jsx
  import React from 'react';
  import HomeNavbar from '../../components/Home_comp/HomeNavbar/HomeNavbar';
  import MenuItem from '../../components/MenuItem/MenuItem';
  import FirstSection from '../../components/Home_comp/first_section/first_section';
  import Second from '../../components/Home_comp/second/Section2';
  import SpecialtiesSection from '../../components/Home_comp/third/third';
  import ReviewSection from '../../components/Home_comp/fourth/fourth';
  import Footer from '../../components/Footer/Footer';
  import './Home.css';





  const Home = () => {


    return (
      <div className="home">
      
        <HomeNavbar />
        <FirstSection/>
        <Second/>
        <SpecialtiesSection/>
        <ReviewSection/>
        <Footer />
      </div>
    );
  };

  export default Home;