import React from "react";


function ImageComponent() {


  return (
    <div>
      <img
        src={`${process.env.PUBLIC_URL}/assets/me.jpeg`} // Replace with your image source
        alt="me"
        className="image"
      />
    </div>
  );
}

export default ImageComponent;