import React from 'react';
import styled from '@emotion/styled';
import madre from '@/src/app/style/fonts/madre/madre';

const ParallaxContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const ParallaxBackground = styled.div<{ src: string }>`
  position: relative;
  height: 100%; /* Height of the parallax section */
  background-image: ${({ src }) => `url('${src}')`};
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  & p {
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
    width: 50%;
    padding: 20px;
    font-size: 25px;
    font-weight: bold;
    @media (max-width: 768px) {
      width: 100%;
      font-size: 16px;
    }
  }
  /*  */
`;

interface Props {
  text: string;
  image: string;
}
const SectionParalax = ({ text, image }: Props) => {
  return (
    <ParallaxContainer>
      <ParallaxBackground src={image}>
        <Content>
          <p className={madre.className}>{`"${text}"`}</p>
        </Content>
      </ParallaxBackground>
    </ParallaxContainer>
  );
};

export default SectionParalax;
