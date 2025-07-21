import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/carousel.css";
import generalImg from "../assets/images/download.jpg";

export default function Carousel({ genderData, ageData, overallCoverage }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  console.log(genderData)
  console.log(ageData)
  console.log(overallCoverage)
  console.log(generalImg)
  return (
    <div style={{ maxWidth: 1200, maxHeight: 600, margin: '0 auto' }}>
        <Slider {...settings}>
            <div className="carousel-slide">
                <h3>Users Vaccinated: {overallCoverage}%</h3>
            </div>
            <div className="carousel-slide">  
                <h3>{genderData.Male}% Vaccinated Males/ {genderData.Female}% Vaccinated Females</h3>
            </div>
            <div className="carousel-slide">
                <h3>Ages 0-17 Vaccinated: {ageData["0-17"]}%</h3>
            </div>
            <div className="carousel-slide">
                <h3>Ages 18-35 Vaccinated: {ageData["18-35"]}%</h3>
            </div>
            <div className="carousel-slide">
                <h3>Ages 36-60 Vaccinated: {ageData["36-60"]}%</h3>
            </div>
            <div className="carousel-slide">
                <h3>Ages 60+ Vaccinated: {ageData["60+"]}%</h3>
            </div>
        </Slider>
    </div>

  );
}
