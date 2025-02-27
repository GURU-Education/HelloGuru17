import React, { useState } from "react";
import StreamVideo from "./stream-video";

export default function HomePage() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
        console.log("Image data:", imageData);
        const newImages = [...images];
        newImages[index] = imageData;
        setImages(newImages);
        await uploadImage(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (newImages) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;
    console.log("Email:", email);
    if (!email) {
      console.error("User email not found in local storage");
      return;
    }

    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, photo_urls: newImages }),
    });

    if (!response.ok) {
      console.error("Failed to upload image");
    } else {
      const result = await response.json();
      console.log("Image uploaded successfully", result);
    }
  };

  return (
    <div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleImageUpload(event, 0)}
        />
        {images[0] && (
          <img
            src={images[0]}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleImageUpload(event, 1)}
        />
        {images[1] && (
          <img
            src={images[1]}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleImageUpload(event, 2)}
        />
        {images[2] && (
          <img
            src={images[2]}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}
      </div>
      <StreamVideo />
    </div>
  );
}
