import React from "react";


function ImageComponent() {
  const imageStyle = {
    height: '100vh',
    width: '100%',
    objectFit: 'cover' // Ensures the image covers the specified dimensions without distortion
  };

  return (
    <div>
      <img
        src={`${process.env.PUBLIC_URL}/assets/portfolio-pic.png`} // Replace with your image source
        alt="me"
        style={imageStyle}
      />
    </div>
  );
}

export default ImageComponent;