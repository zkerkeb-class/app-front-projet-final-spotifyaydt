import React, { useState, useCallback, useEffect } from 'react';
import style from './ResizableContainer.module.scss';

const ResizableLayout = ({ defaultWidth = 300, children }) => {
  const [width, setWidth] = useState(defaultWidth);

  const handleResize = useCallback((e) => {
    const newWidth = e.clientX;
    if (newWidth > 100 && newWidth < window.innerWidth - 100) {
      setWidth(newWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleResize]);

  const handleMouseDown = useCallback(() => {
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleResize, handleMouseUp]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleResize, handleMouseUp]);

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

export default React.memo(ResizableLayout);
