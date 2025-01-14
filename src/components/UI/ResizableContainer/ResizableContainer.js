import React, { useState } from 'react';
import style from './ResizableContainer.module.scss';

const ResizableLayout = ({ defaultWidth = 300, children }) => {
  const [width, setWidth] = useState(defaultWidth); // Local state for resizing

  const handleResize = (e) => {
    const newWidth = e.clientX;
    if (newWidth > 100 && newWidth < window.innerWidth - 100) {
      // Prevent too small or too large widths
      setWidth(newWidth);
    }
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={style.resizable_layout}>
      <div className={style.resizable_panel} style={{ width: `${width}px` }}>
        {children}
      </div>
      <div
        className={style.resizable_divider}
        onMouseDown={handleMouseDown}
      ></div>
      <div className={style.content_panel}>
        {/* The main content area remains for user-defined use */}
      </div>
    </div>
  );
};

export default ResizableLayout;
