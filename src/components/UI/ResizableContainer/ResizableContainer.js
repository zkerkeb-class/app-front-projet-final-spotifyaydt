import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './ResizableContainer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';

const ResizableContainer = ({
  leftPanel,
  rightPanel,
  mainContent,
  minLeftWidth = 200,
  maxLeftWidth = 400,
  minRightWidth = 200,
  maxRightWidth = 400,
  defaultLeftWidth = 300,
  defaultRightWidth = 300,
  isMobileLibraryVisible = false,
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const { isRightSidebarVisible } = useAudioPlayer();
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [rightWidth, setRightWidth] = useState(defaultRightWidth);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const COLLAPSED_WIDTH = 100;

  const handleMouseDown = useCallback(
    (side) => (e) => {
      e.preventDefault();
      if (side === 'left') {
        setIsResizingLeft(true);
      } else {
        setIsResizingRight(true);
      }
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizingLeft && !isResizingRight) return;

      if (isResizingLeft) {
        const newWidth = e.clientX;
        if (newWidth < minLeftWidth && !isLeftCollapsed) {
          setIsLeftCollapsed(true);
          setLeftWidth(COLLAPSED_WIDTH);
        } else if (newWidth >= minLeftWidth && isLeftCollapsed) {
          setIsLeftCollapsed(false);
          setLeftWidth(minLeftWidth);
        } else if (
          newWidth >= minLeftWidth &&
          newWidth <= maxLeftWidth &&
          !isLeftCollapsed
        ) {
          setLeftWidth(newWidth);
        }
      }

      if (isResizingRight) {
        const containerWidth =
          document.querySelector('.app-container').clientWidth;
        const newWidth = containerWidth - e.clientX;
        if (newWidth >= minRightWidth && newWidth <= maxRightWidth) {
          setRightWidth(newWidth);
        }
      }
    },
    [
      isResizingLeft,
      isResizingRight,
      minLeftWidth,
      maxLeftWidth,
      minRightWidth,
      maxRightWidth,
      isLeftCollapsed,
    ]
  );

  // Update leftWidth when isLeftCollapsed changes
  React.useEffect(() => {
    if (isLeftCollapsed) {
      setLeftWidth(COLLAPSED_WIDTH);
    } else {
      setLeftWidth(defaultLeftWidth);
    }
  }, [isLeftCollapsed, defaultLeftWidth]);

  React.useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, handleMouseMove, handleMouseUp]);

  // Clone and inject isCollapsed prop into leftPanel
  const leftPanelWithCollapse = React.cloneElement(leftPanel, {
    isCollapsed: isLeftCollapsed,
    setIsCollapsed: setIsLeftCollapsed,
  });

  return (
    <div className={styles.resizable_layout}>
      <div
        className={`${styles.resizable_panel} ${styles.left} ${
          isMobileLibraryVisible ? styles.visible : ''
        }`}
        style={{ width: leftWidth }}
      >
        {leftPanelWithCollapse}
      </div>
      <div
        className={styles.resizable_divider}
        onMouseDown={handleMouseDown('left')}
      />
      <div
        className={`${styles.content_panel} ${isMobileLibraryVisible ? styles.hidden : ''}`}
      >
        {mainContent}
      </div>
      {isRightSidebarVisible && (
        <>
          <div
            className={styles.resizable_divider}
            onMouseDown={handleMouseDown('right')}
          />
          <div className={styles.resizable_panel} style={{ width: rightWidth }}>
            {rightPanel}
          </div>
        </>
      )}
    </div>
  );
};

ResizableContainer.propTypes = {
  leftPanel: PropTypes.node.isRequired,
  rightPanel: PropTypes.node.isRequired,
  mainContent: PropTypes.node.isRequired,
  minLeftWidth: PropTypes.number,
  maxLeftWidth: PropTypes.number,
  minRightWidth: PropTypes.number,
  maxRightWidth: PropTypes.number,
  defaultLeftWidth: PropTypes.number,
  defaultRightWidth: PropTypes.number,
  isMobileLibraryVisible: PropTypes.bool,
  className: PropTypes.string,
};

export default ResizableContainer;
