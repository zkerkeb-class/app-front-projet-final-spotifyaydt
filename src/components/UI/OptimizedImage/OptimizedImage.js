import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './OptimizedImage.module.scss';

const DEFAULT_QUALITY = parseInt(process.env.REACT_APP_IMAGE_QUALITY) || 75;
const DEFAULT_SIZES = (
  process.env.REACT_APP_DEFAULT_IMAGE_SIZES || '320,640,768,1024,1366,1600,1920'
)
  .split(',')
  .map(Number);

const OptimizedImage = ({
  src,
  alt,
  className,
  sizes = '100vw',
  loading = 'lazy',
  quality = DEFAULT_QUALITY,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create a tiny placeholder
    const createPlaceholder = async () => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          setImageSrc(base64data);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error creating placeholder:', error);
        setImageSrc(src);
      }
    };

    createPlaceholder();
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Generate srcSet for different sizes
  const generateSrcSet = () => {
    return DEFAULT_SIZES.map(
      (width) => `${src}?w=${width}&q=${quality} ${width}w`
    ).join(', ');
  };

  return (
    <div className={`${styles.imageContainer} ${className || ''}`}>
      {isLoading && (
        <div className={styles.placeholder} aria-hidden="true">
          <div className={styles.shimmer}></div>
        </div>
      )}
      <picture>
        <source type="image/avif" srcSet={generateSrcSet()} sizes={sizes} />
        <source type="image/webp" srcSet={generateSrcSet()} sizes={sizes} />
        <img
          src={imageSrc || src}
          alt={alt}
          loading={loading}
          onLoad={handleImageLoad}
          className={`${styles.image} ${isLoading ? styles.loading : ''}`}
          {...props}
        />
      </picture>
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  sizes: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  quality: PropTypes.number,
};

export default OptimizedImage;
