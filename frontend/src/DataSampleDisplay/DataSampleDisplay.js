import React from 'react';
import { TIFFViewer } from 'react-tiff';
import 'react-tiff/dist/index.css';
// import tiffFile from './000000008-000005.tiff';
import "./styles.scss";

const importAll = (requireContext) => requireContext.keys().map(requireContext);
const tiffFiles = importAll(require.context('./data/', false, /\.tiff$/));

function DataSampleDisplay() {
    return (
        <div className="image-grid">
            {tiffFiles.map((file, index) => (
                <div key={index} className="image-grid__image">
                    <TIFFViewer tiff={file} style={{ width: "120px", padding: "0"}}/>
                </div>
            ))}
        </div>
    );
}

export default DataSampleDisplay;