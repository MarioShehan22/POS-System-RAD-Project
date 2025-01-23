import EmblaCarousel from '../component/EmblaCarousel/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'
import '../component/EmblaCarousel/embla.css'
import { useCallback, useEffect, useState } from 'react'
import  "../component/EmblaCarousel/embla.css";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from "axios";


const MostSellingProduct = () => {
    const [emblaRef,emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [Autoplay({ delay: 4000 })]);
    const [products,setProduct] = useState([]);
    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])
  
    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    useEffect(() =>{
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:3000/api/v1/orders/top-selling");
            setProduct(response.data);
            console.log(response.data);
            // Handle the response data here
          } catch (error) {
            // Handle errors here
          }
        };
      
        fetchData(); 
      },[]);
  return (
    <div className="embla overflow-hidden w-100" ref={emblaRef}>
        <div className="embla__container">
        {products.map((item, index) => (
          <div className="embla__slide border d-flex flex-column" key={index}>
            <div className='flex-1 d-flex flex-column justify-content-center align-items-center border'>
              {/* Customize content based on your data structure */}
              <h6>{item.productId}</h6> {/* Assuming 'name' property exists in data */}
              <h4>{item.productName}</h4> {/* Assuming 'description' property exists */}
              <p>{item.quantitySold}</p> {/* Assuming 'description' property exists */}
              {/* <span>{item.price}</span> Assuming 'price' property exists */}
            </div>
          </div>
        ))}
        </div>
        <div className='d-flex'>
          <button className="embla__prev embla__button border" onClick={scrollPrev}><FaChevronLeft/></button>
          <button className="embla__next embla__button border" onClick={scrollNext}><FaChevronRight/></button>
        </div>
      </div>
  )
}

export default MostSellingProduct;