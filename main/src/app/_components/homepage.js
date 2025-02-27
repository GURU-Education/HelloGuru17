import React, { useState } from "react";
import StreamVideo from "./stream-video";
import Spline from "@splinetool/react-spline";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
export default function HomePage() {
  const [images, setImages] = useState([null, null, null]);
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        const newImages = [...images];
        newImages[index] = imageData;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImages = async () => {
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
      body: JSON.stringify({ email, photo_urls: images }),
    });

    if (!response.ok) {
      console.error("Failed to upload image");
    } else {
      const result = await response.json();
      console.log("Image uploaded successfully", result);
      handleModalClose();
    }
  };

  return (
    <div className="homepage">
      <div className="stream-container">
        <StreamVideo />
      </div>

      <div className="verification-button-container">
        <Button variant="primary" onClick={handleModalShow}>
          Upload Verification Images
        </Button>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-black">
            Upload 3 Images for Verification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-black">
            Please upload 3 images of your face at various angles for
            verification.
          </p>

          <div className="upload-container">
            <div className="upload-item">
              <p>Front View</p>
              <div className="upload-preview">
                {images[0] && <img src={images[0]} alt="Front" />}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event, 0)}
                className="file-input"
              />
            </div>

            <div className="upload-item">
              <p>Left Angle</p>
              <div className="upload-preview">
                {images[1] && <img src={images[1]} alt="Left" />}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event, 1)}
                className="file-input"
              />
            </div>

            <div className="upload-item">
              <p>Right Angle</p>
              <div className="upload-preview">
                {images[2] && <img src={images[2]} alt="Right" />}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event, 2)}
                className="file-input"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={uploadImages}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="spline-container">
        <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
      </div>
    </div>
  );
}
