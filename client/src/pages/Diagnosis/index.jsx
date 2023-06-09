import styles from "../../styles/Diagnosis/diagnosis.module.scss";
import { images } from "../../data/image-list";
import { patient } from "../../data/patient-example";
import ImageList from "./components/ImageList";
import InfoList from "./components/InfoList";
import EditingCanvas from "./components/EditingCanvas";
import ResultTabs from "./components/ResultTabs";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { toast } from '../../utils/toast'

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
  const canvasRef = useRef();

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setSelectedImage(image.src);
    };
    image.src = `data:image/png;base64,${image_}`;
    // const url = upload(image.src);
  }, [image_]);

  const upload = async (image) => {
    const res = await api.post("/test-results/upload", { data: image });
    return res.data.url;
  };

  const handleSubmit = async () => {
    if(location.state === null) {
      toast.error("Nothing to POST, try go back to import data");
      return;
    }
    if(selectedImage === null) {
      toast.error("No Image");
      return;
    }

    const canvas = canvasRef.current;
    const imageb64 = canvas.toDataURL("image/png");
    const imgURL = await upload(imageb64);

    console.log(location.state);

    const data = {
      "patient": location.state.id,
      "doctor": location.state.receive_doc,
      "department": location.state.receive_dep,
      "testResult": {
        "isPositive": true,
        "url": [
          imgURL
        ]
      }
    }
    try {
      const res = await api.post("/health-records", data)
      toast.success('Successfully');
    } catch (error) {
      toast.error('An error has occurred');
      console.log(error)
    }

  }

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
            <EditingCanvas image={selectedImage} canvasRef={canvasRef}/>
          </div>
          <div className="row-span-2">
            <ResultTabs />
            <div className="w-full flex justify-end text-3xl gap-8">
              <Link to="/">
                <button className={styles["cancel-button"]}>CANCEL</button>
              </Link>
              <button
                type="submit"
                className={styles["next-button"]}
                onClick={()=>handleSubmit()}
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
