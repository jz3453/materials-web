import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import axios from 'axios';
import "./styles.scss";
import { Icon } from '@mui/material';

const apiSamplingUrl = "http://127.0.0.1:5000/materials/sampling"

function DataSampleDisplay() {

    const [sampling, setSampling] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function fetchNewSampling() {
        axios.get(apiSamplingUrl)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Network response was not ok");
                }
                return response.data;
            })
            .then((data) => {
                let sampling = data.sampling;
                setSampling(sampling);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchNewSampling();
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="data-sample-display">
            <div className="image-grid-subcontainer">
                <div className="row-labels">
                    <div className="row-label">Texture</div>
                    <div className="row-label">Depth</div>
                    <div className="row-label">Context</div>
                </div>
                <div className="image-grid">
                    {sampling?.map((sample, index) => (
                        <div className="image-grid__column">
                            <div className="image-grid__image-label">{sample.label}</div>
                            <img
                                className="image-grid__image"
                                key={index}
                                src={`http://127.0.0.1:5000/image/${sample.image}`} 
                            />
                            <img
                                className="image-grid__image"
                                key={index}
                                src={`http://127.0.0.1:5000/image/${sample.image.replace("texture_img", "texture_depth")}`} 
                            />
                            <img
                                className="image-grid__image"
                                key={index}
                                src={`http://127.0.0.1:5000/image/${sample.image.replace("texture_img", "context_img")}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="button-bar">
                <div className="image-grid-caption">The Matador material image dataset is dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                <IconButton>
                    <AutorenewIcon onClick={() => fetchNewSampling()}/>
                </IconButton>
            </div>
        </div>
    );
}

export default DataSampleDisplay;