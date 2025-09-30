import React from 'react';
import styled from 'styled-components';

interface ScrollControlsProps {
  canvasSize: { width: number; height: number };
  viewportSize: { width: number; height: number };
  scrollPosition: { x: number; y: number };
  onScrollChange: (position: { x: number; y: number }) => void;
}

const ScrollContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
`;

const ScrollButton = styled.button`
  width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #2196F3;
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: #333;
  }
`;

const ScrollInfo = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  text-align: center;
`;

const NavigationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 40px);
  gap: 4px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NavButton = styled.button<{ $center?: boolean }>`
  width: 40px;
  height: 40px;
  background: ${props => props.$center ? '#2196F3' : '#fff'};
  border: 1px solid ${props => props.$center ? '#2196F3' : '#ddd'};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$center ? '#1976D2' : '#f5f5f5'};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: ${props => props.$center ? '#fff' : '#333'};
  }
`;

export const ScrollControls: React.FC<ScrollControlsProps> = ({
  canvasSize,
  viewportSize,
  scrollPosition,
  onScrollChange
}) => {
  const scrollStep = 100;
  const maxScrollX = Math.max(0, canvasSize.width - viewportSize.width);
  const maxScrollY = Math.max(0, canvasSize.height - viewportSize.height);

  const handleScroll = (direction: string) => {
    let newX = scrollPosition.x;
    let newY = scrollPosition.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, scrollPosition.y - scrollStep);
        break;
      case 'down':
        newY = Math.min(maxScrollY, scrollPosition.y + scrollStep);
        break;
      case 'left':
        newX = Math.max(0, scrollPosition.x - scrollStep);
        break;
      case 'right':
        newX = Math.min(maxScrollX, scrollPosition.x + scrollStep);
        break;
      case 'center':
        newX = maxScrollX / 2;
        newY = maxScrollY / 2;
        break;
      case 'home':
        newX = 0;
        newY = 0;
        break;
    }

    onScrollChange({ x: newX, y: newY });
  };

  const scrollPercentageX = maxScrollX > 0 ? Math.round((scrollPosition.x / maxScrollX) * 100) : 0;
  const scrollPercentageY = maxScrollY > 0 ? Math.round((scrollPosition.y / maxScrollY) * 100) : 0;

  return (
    <ScrollContainer>
      <ScrollInfo>
        Posición: {scrollPosition.x}, {scrollPosition.y}
        <br />
        Vista: {scrollPercentageX}%, {scrollPercentageY}%
      </ScrollInfo>
      
      <NavigationGrid>
        <div /> {/* Empty top-left */}
        <NavButton onClick={() => handleScroll('up')}>
          <svg viewBox="0 0 24 24">
            <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
          </svg>
        </NavButton>
        <div /> {/* Empty top-right */}
        
        <NavButton onClick={() => handleScroll('left')}>
          <svg viewBox="0 0 24 24">
            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
          </svg>
        </NavButton>
        <NavButton $center onClick={() => handleScroll('center')}>
          <svg viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
        </NavButton>
        <NavButton onClick={() => handleScroll('right')}>
          <svg viewBox="0 0 24 24">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </svg>
        </NavButton>
        
        <div /> {/* Empty bottom-left */}
        <NavButton onClick={() => handleScroll('down')}>
          <svg viewBox="0 0 24 24">
            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
          </svg>
        </NavButton>
        <div /> {/* Empty bottom-right */}
      </NavigationGrid>

      <ScrollButton onClick={() => handleScroll('home')} title="Ir al inicio">
        <svg viewBox="0 0 24 24">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
        </svg>
      </ScrollButton>
    </ScrollContainer>
  );
};