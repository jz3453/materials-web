import React, { useEffect, useState } from "react";
import axios from 'axios';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import "./styles.scss";
import classNames from "classnames";

const DEFAULT_AUGMENTATION_KEY = "0.0,0.0,0.35,0.0,0.0,0.0,0.0";

const xRotationMarks = Array.from({ length: (30 - (-30)) / 15 + 1 }, (_, index) => {
    const value = -30.0 + index * 15.0; 
    return {
        value: value,
    };
});

const yRotationMarks = Array.from({ length: (30 - (-30)) / 15 + 1 }, (_, index) => {
    const value = -30.0 + index * 15.0; 
    return {
        value: value,
    };
});

const zTranslationMarks = [
    {
        value: 0.35,
    },
    {
        value: 0.5988683301098714,
    },
    {
        value: 1.0246950765959597,
    },
    {
        value: 1.7533069411223692,
    },
    {
        value: 3.0,
    },
  ];
  
function valuetext(value) {
    return `${value}`;
}

function getAugmentedImagePath(imagePath, augmentationKey, augmentationSet) {
    let augmentationValue = augmentationSet.get(augmentationKey);
    let renderedImageId = augmentationValue.toString().padStart(6, '0');
    let augmentedImagePath = imagePath.split("-");
    augmentedImagePath[1] = renderedImageId + ".tiff";
    augmentedImagePath = augmentedImagePath.join("-");
    return augmentedImagePath;
}

function SideBar({ selectedClass, augmentationSet }) {

    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [augmentationImage, setAugmentationImage] = useState(null);
    const [augmentationKey, setAugmentationKey] = useState(DEFAULT_AUGMENTATION_KEY);

    useEffect(() => {
        setAugmentationKey(DEFAULT_AUGMENTATION_KEY);
        setXRotation(0.0);
        setYRotation(0.0);
        setZTranslation(0.35);
        axios.get(`http://127.0.0.1:5000/materials/${selectedClass}`) // Fetch the list of images for the selected material
            .then((response) => {
                let images = response.data.images;
                setImages(images);
                if (images.length > 0) {
                    setSelectedImage(images[0]);
                    let augmentedImagePath = getAugmentedImagePath(images[0].image, DEFAULT_AUGMENTATION_KEY, augmentationSet);
                    setAugmentationImage(augmentedImagePath);
                }
                else {
                    setSelectedImage(null);
                    setAugmentationImage(null);
                }
            })
            .catch((error) => {
                console.error("Error fetching image paths:", error);
            });
    }, [selectedClass]);

    useEffect(() => {
        setXRotation(0.0);
        setYRotation(0.0);
        setZTranslation(0.35);
        if (selectedImage) {
            setAugmentationKey(DEFAULT_AUGMENTATION_KEY);
            let augmentedImagePath = getAugmentedImagePath(selectedImage.image, DEFAULT_AUGMENTATION_KEY, augmentationSet);
            setAugmentationImage(augmentedImagePath);
        }
    }, [selectedImage])

    useEffect(() => {
        if (selectedImage) {
            let augmentedImagePath = getAugmentedImagePath(selectedImage.image, augmentationKey, augmentationSet);
            setAugmentationImage(augmentedImagePath);
            let augmentation = augmentationKey.split(",");
            setXRotation(augmentation[3]);
            setYRotation(augmentation[4]);
            setZTranslation(augmentation[2]);
        }
    }, [augmentationKey]);

    const [xRotation, setXRotation] = useState(0.0);
    const [yRotation, setYRotation] = useState(0.0);
    const [zTranslation, setZTranslation] = useState(0.35);

    const handleXRotationChange = (event) => {
        const value = parseFloat(event.target.value);
        const formattedValue = value.toFixed(1); 
        setXRotation(parseFloat(formattedValue));
        let newAugmentationKey = augmentationKey.split(",");
        newAugmentationKey[3] = formattedValue.toString();
        setAugmentationKey(newAugmentationKey.join(","));
    };

    const handleYRotationChange = (event) => {
        const value = parseFloat(event.target.value);
        const formattedValue = value.toFixed(1); 
        setYRotation(parseFloat(formattedValue));
        let newAugmentationKey = augmentationKey.split(",");
        newAugmentationKey[4] = formattedValue.toString();
        setAugmentationKey(newAugmentationKey.join(","));
    };

    const handleZTranslationChange = (event) => {
        const value = parseFloat(event.target.value);
        const formattedValue = value.toString().includes(".") && value.toString().split(".")[1].length > 1
            ? value.toString() // Keep as-is if it has more than 1 decimal place
            : value.toFixed(1); // Otherwise, format to 1 decimal (e.g., 3 -> 3.0) 
        setZTranslation(parseFloat(formattedValue));
        let newAugmentationKey = augmentationKey.split(",");
        newAugmentationKey[2] = formattedValue.toString();
        setAugmentationKey(newAugmentationKey.join(","));
    };

    return (
        <div className="sidebar">
            <div className="sidebar__title">"{selectedClass}" Images</div>
            {images.length > 0 && (
                <>
                    <div className="sidebar__render">
                        <div className="sidebar__render__images">
                            <div className="image_container">
                                <img
                                    className="sidebar__render__images__image"
                                    src={`http://127.0.0.1:5000/image/${selectedImage.image}`}
                                />
                                <div className="image__label">Original</div>
                            </div>
                            <div className="image_container">
                                <img
                                    className="sidebar__render__images__image"
                                    src={`http://127.0.0.1:5000/image/${augmentationImage}`}
                                />
                                <div className="image__label">Rendered</div>
                            </div>
                        </div>
                        <div className="sidebar__render__sliders">
                            <div className="sidebar__render__sliders__slider">
                                <div className="slider__label">Roll</div>
                                <Slider
                                    aria-label="Restricted values"
                                    value={xRotation}
                                    step={null}
                                    valueLabelDisplay="auto"
                                    marks={xRotationMarks}
                                    min={-30.0}
                                    max={30.0}
                                    onChange={handleXRotationChange}
                                />
                                <div className="slider__unit">[deg]</div>
                            </div>
                            <div className="sidebar__render__sliders__slider">
                                <div className="slider__label">Pitch</div>
                                <Slider
                                    aria-label="Restricted values"
                                    value={yRotation}
                                    step={null}
                                    valueLabelDisplay="auto"
                                    marks={yRotationMarks}
                                    min={-30.0}
                                    max={30.0}
                                    onChange={handleYRotationChange}
                                />
                                <div className="slider__unit">[deg]</div>
                            </div>
                            <div className="sidebar__render__sliders__slider">
                                <div className="slider__label">Depth</div>
                                <Slider
                                    aria-label="Restricted values"
                                    value={zTranslation}
                                    step={null}
                                    valueLabelDisplay="auto"
                                    marks={zTranslationMarks}
                                    min={0.35}
                                    max={3.0}
                                    onChange={handleZTranslationChange}
                                />
                                <div className="slider__unit">[cm]</div>
                            </div>
                        </div>
                    </div>
                    <div className="sidebar-grid-container">
                        <div className="sidebar__grid">
                            {images.map((image, index) => (
                                <Tooltip
                                    title={image.label}
                                    slotProps={{
                                        popper: {
                                          modifiers: [
                                            {
                                              name: 'offset',
                                              options: {
                                                offset: [0, -14],
                                              },
                                            },
                                          ],
                                        },
                                    }}
                                >
                                    <img
                                        className={classNames("sidebar__grid__image", {
                                            "highlighted": image.image === selectedImage.image,
                                        })}
                                        key={index}
                                        src={`http://127.0.0.1:5000/image/${image.image}`} // Call the backend `serve_image` endpoint
                                        alt={`Material ${selectedClass} Image ${index + 1}`}
                                        onClick={() => {
                                            setSelectedImage(image)
                                        }}
                                    />
                                </Tooltip>
                            ))}
                        </div>
                        <div className="grid-space-bottom"></div>
                    </div>
                </>
            )}
        </div>
    );
}

export default SideBar;