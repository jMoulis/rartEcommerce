import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import madre from '@/src/app/style/fonts/madre/madre';

const ParallaxContainer = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;
`;

const ParallaxBackground = styled.div<{
  src: string;
  mouseX: number;
  mouseY: number;
}>`
  position: relative;
  height: 100%; /* Height of the parallax section */
  background-image: ${({ src }) => `url('${src}')`};
  background-attachment: fixed;
  background-position: ${({ mouseX, mouseY }) =>
    `calc(50% + ${mouseX}px) calc(50% + ${mouseY}px)`}; /* Adjust position based on mouse movement */

  background-repeat: no-repeat;
  background-size: cover;
  transition: background-position 0.2s ease; /* Smooth transition for mouse movement */
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
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - rect.width / 2; // Adjust for center alignment
        const mouseY = event.clientY - rect.top - rect.height / 2; // Adjust for center alignment
        const maxMovement = 50; // Limit maximum movement
        const adjustedX = Math.min(Math.max(mouseX, -maxMovement), maxMovement);
        const adjustedY = Math.min(Math.max(mouseY, -maxMovement), maxMovement);
        backgroundRef.current.style.backgroundPosition = `calc(50% + ${adjustedX}px) calc(50% + ${adjustedY}px)`;
      }
    };

    backgroundRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      backgroundRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <ParallaxContainer>
      <ParallaxBackground src={image} ref={backgroundRef} mouseX={0} mouseY={0}>
        <Content>
          <p className={madre.className}>{`"${text}"`}</p>
        </Content>
      </ParallaxBackground>
    </ParallaxContainer>
  );
};

export default SectionParalax;
