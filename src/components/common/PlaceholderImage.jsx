import { useState, useEffect } from 'react';

const PlaceholderImage = ({ width = 800, height = 600, text = 'Placeholder Image', bgColor = '#4361ee', textColor = '#ffffff' }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Add text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.floor(width / 20)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    // Convert to data URL
    setImageSrc(canvas.toDataURL('image/png'));
  }, [width, height, text, bgColor, textColor]);

  return <img src={imageSrc} alt={text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
};

export default PlaceholderImage;
