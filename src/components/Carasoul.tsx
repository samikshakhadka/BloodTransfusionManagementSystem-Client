import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectFade,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade]}
      spaceBetween={50}
      slidesPerView={1}
      autoplay
    >
      <SwiperSlide
        className="flex items-start justify-start bg-fixed w-full h-screen p-10"
        style={{ backgroundImage: 'url("/inventory.png")' }}
      >
        <p className="w-full text-6xl font-extrabold text-left text-[#25CED1]">
          INVENTORY MANAGEMENT
        </p>
      </SwiperSlide>
      <SwiperSlide
        className="flex items-end justify-end bg-fixed w-full h-screen p-16"
        style={{ backgroundImage: 'url("/blooddonation.webp")' }}
      >
        <p className="w-full text-6xl font-extrabold text-[#e5463e] text-right">
          LIVE BLOOD DONATION PROCRESSING
        </p>
      </SwiperSlide>
      <SwiperSlide
        className="flex items-start justify-start bg-fixed w-full h-screen p-16 bg-no-repeat"
        style={{ backgroundImage: 'url("/Inisghts.png")' }}
      >
        <p className="w-full text-6xl font-extrabold text-[#006E9B] text-left">
          INSIGHTS GENERATION
        </p>
      </SwiperSlide>
      <SwiperSlide
        className="flex items-center justify-center bg-fixed w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url("/banner.png")' }}
      >
      </SwiperSlide>
    </Swiper>
  );
};
