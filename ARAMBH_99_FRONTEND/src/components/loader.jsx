import React, { useState, useEffect } from "react";

function Loader() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const checkImagesLoaded = () => {
  //     const images = Array.from(document.images); // Get all images on the page
  //     const areImagesLoaded = images.every((img) => img.complete);

  //     if (areImagesLoaded) {
  //       setTimeout(() => {
  //         setIsLoading(false);
  //         document.body.style.overflow = "auto";
  //       }, 300); // Optional delay for smoother transition
  //     }
  //   };

  //   const handleStateChange = () => {
  //     const state = document.readyState;
  //     if (state === "interactive") {
  //       setIsLoading(true);
  //       document.body.style.overflow = "hidden";
  //     } else if (state === "complete") {
  //       checkImagesLoaded(); // Check image loading after DOM is ready
  //     }
  //   };

  //   // Initial check for document readiness
  //   document.addEventListener("readystatechange", handleStateChange);

  //   // Add event listeners for images
  //   const images = Array.from(document.images);
  //   images.forEach((img) => img.addEventListener("load", checkImagesLoaded));
  //   images.forEach((img) => img.addEventListener("error", checkImagesLoaded));

    //// Cleanup event listeners
  //   return () => {
  //     document.removeEventListener("readystatechange", handleStateChange);
  //     images.forEach((img) =>
  //       img.removeEventListener("load", checkImagesLoaded)
  //     );
  //     images.forEach((img) =>
  //       img.removeEventListener("error", checkImagesLoaded)
  //     );
  //   };
  // }, []);

  return (
      <div className="flex justify-center items-center h-screen bg-white fixed w-screen z-50 top-0 left-0">
        <div className="relative w-24 h-24 animate-spin rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 ">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-200 rounded-full border-2 border-white"></div>
        </div>
      </div>
  );
}

export default Loader;
