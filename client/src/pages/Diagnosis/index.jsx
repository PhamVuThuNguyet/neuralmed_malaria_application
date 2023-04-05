import styles from "../../styles/Diagnosis/diagnosis.module.scss";
import { images } from "../../data/image-list";
import { patient } from "../../data/patient-example";
import ImageList from "./components/ImageList";
import InfoList from "./components/InfoList";
import EditingCanvas from "./components/EditingCanvas";
import ResultTabs from "./components/ResultTabs";
import api from "../../api";


// Btn icon
import { ReactComponent as GridIcon } from "../../assets/Grid.svg";
import { ReactComponent as ListIcon } from "../../assets/List.svg";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLocation } from "react-router-dom";

export default function Diagnosis(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentView, setCurrentView] = useState("images");
  const location = useLocation();
  const image_ = location.state?.image;

  const apiConfig = {
    //TODO: token from login
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDI0NDI2ODU1OWE2OWVhZTdlMDgzN2UiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE2ODA3MDQwNjgsImV4cCI6MTY4MDc5MDQ2OH0.8e-t6pM6cbjRVz6o117oD_TeHFQWnwu6U7DC7trk7Hs`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setSelectedImage(image.src);
    };
    image.src = `data:image/png;base64,${image_}`;
    // const url = upload(image.src);
  }, [image_]);

  const upload = async (image) => {
    const res = await api.post("/test-results/upload", {data: image}, apiConfig);
    return res.data.url;
  };


  const handleImageClick = (image) => {
    console.log(image);
    setSelectedImage(image);
  };

  function SwitchView(view) {
    setCurrentView(view);
  }
  return (
    <div
      className={[styles["diagnosis-cont"], "grid", "grid-cols-6"].join(" ")}
    >
      <div className="col-span-1">
        <div className="flex gap-x-4">
          <button
            onClick={() => {
              SwitchView("images");
            }}
          >
            <i>
              <GridIcon />
            </i>
          </button>
          <button
            onClick={() => {
              SwitchView("info");
            }}
          >
            <i>
              <ListIcon />
            </i>
          </button>
        </div>
        <div>
          {currentView === "images" ? (
            <ImageList images={images} onClick={handleImageClick} />
          ) : (
            <InfoList info={patient} />
          )}
        </div>
      </div>  
      <div className="col-span-5 p-3">
        <div className="grid grid-rows-5">
          <div className="row-span-3">
            <EditingCanvas image={selectedImage} />
          </div>
          <div className="row-span-2">
            <ResultTabs />
          </div>
        </div>
      </div>
    </div>
  );
}
