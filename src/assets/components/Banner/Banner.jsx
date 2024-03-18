import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './banner.css'
import banner1 from '../../images/banners/banner1.jpeg'
import Slider from "react-slick"


const images = [
  {
    id: 1,
    img: banner1
  },
  {
    id: 2,
    img: banner1
  },
  {
    id: 3,
    img: banner1
  },
]

export default function Banner() {
  const NextButton = (props) => {
    const {icon, onClick} = props;
    return (
      <div className="slider-btn right" onClick={onClick}>
        {icon}
      </div>
    )
  }
  
  const PrevButton = (props) => {
    const {icon, onClick} = props;
    return (
      <div className="slider-btn left" onClick={onClick}>
        {icon}
      </div>
    )
  }

  
  let SliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    className: 'inner-slider',
    nextArrow: <NextButton icon={<IoIosArrowForward />} />,
    prevArrow: <PrevButton icon={<IoIosArrowBack />} />,
  }
  
  return (
    <div className='banner'>
      <Slider {...SliderSettings}>
        {images.map((item) => {
          return (
            <div key={item.id}>
              <img src={item.img} alt={`img banner ${item.id}`} className="banner-imgs"/>
            </div>
          )
        } )}
      </Slider>
    </div>
  )
}