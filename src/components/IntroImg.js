import React from "react";

function ImageComponent() {
  const imageStyle = {
    height: '100%',
    width: '100%',
    objectFit: 'cover' // Ensures the image covers the specified dimensions without distortion
  };

  return (
    <div>
      <img
        src="/assets/me.jpg" // Replace with your image source
        alt="Sample"
        style={imageStyle}
      />
    </div>
  );
}

export default ImageComponent;