import { Swiper, SwiperSlide } from "swiper/react";
import { RowBetween, RowFixed } from "components/Row";
import { Trans } from "i18n";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styled, { useTheme } from "styled-components";

import { Autoplay } from "swiper/modules";

const BannerContainer = styled(RowBetween)<{ index: number }>`
  width: 100%;
  height: 45px;
  padding-left: 18px;
  padding-right: 24px;
  border-radius: 8px;
  margin-bottom: 40px;
  cursor: pointer;
  background: ${({ index }) => `url(/images/zklink-banner-${index}.png)`};
  > p {
    background: linear-gradient(90deg, #fff 0%, #84ef77 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Satoshi;
    font-size: 16px;
    font-weight: 700;
  }
`;

const Banners = [
  {
    title: "Join zkLink Nova Aggregation Parade to Earn",
    link: "https://app.zklink.io",
  },
  {
    title: "Manage your liquidity on Steer Finance",
    link: "https://app.steer.finance/",
  },
];
export default function Banner() {
  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={false}
      modules={[Autoplay]}
      className="relative mb-4 z-[10]"
    >
      {Banners.map((item, index) => (
        <SwiperSlide>
          <BannerContainer
            onClick={() => window.open(item.link, "_blank")}
            index={index + 1}
          >
            <p>
              <Trans>{item.title}</Trans>
            </p>
            <img src="/images/icon-banner-link.svg" alt="" />
          </BannerContainer>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
