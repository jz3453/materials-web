import { useState, useEffect } from "react";
import axios from 'axios';
import { DOMAINS } from "./constants";
import DataSampleDisplay from "./DataSampleDisplay/DataSampleDisplay";
import TaxonomyTree from "./TaxonomyTree/TaxonomyTree";
import SideBar from "./SideBar/SideBar";
import './App.css';

// const apiUrl = process.env.REACT_APP_API_URL + "/api/tree";
const apiUrl = "http://127.0.0.1:5000/api/tree"

function App() {
  const [taxonomyTree, setTaxonomyTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedClass, setSelectedClass] = useState("Root")

  const handleDropdownChange = (event) => {
    setSelectedDomain(event.target.value);
  }

  const handleClassSelected = (c) => {
    setSelectedClass(c)
    console.log("new class selected")
  }

  useEffect(() => {
    axios.get(apiUrl)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((data) => {
        setTaxonomyTree(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <div className="topbar-section">
        <a href="#matador-intro" className="topbar-title">Matador</a>
        <a href="#taxonomy-section" className="topbar-item">Taxonomy</a>
        <a href="#overview-section" className="topbar-item">Overview</a>
        <a href="#downloads-section" className="topbar-item">Downloads</a>
      </div>
      <div className="page-content">
        <div id="matador-intro" className="title">A Visual Taxonomy of Materials</div>
        <section className="image-grid-container">
          <DataSampleDisplay />
          <div className="image-grid-caption">The Matador material image dataset is dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
        </section>
        <section id="taxonomy-section" className="section">
          <div className="section-title">Taxonomy</div>
          <div className="taxonomy-section">
            <div className="taxonomy-container">
              <Dropdown 
                label="Domain:"
                options={DOMAINS}
                onChange={handleDropdownChange}
                value={selectedDomain}
              />
              <TaxonomyTree
                taxonomyTree={taxonomyTree} 
                selectedDomain={selectedDomain}
                handleClassSelected={handleClassSelected}
              />
            </div>
            <div className="sidebar-container">
              <SideBar selectedClass={selectedClass} />
            </div>
          </div>
        </section>
        <section id="overview-section" className="section">
          <div className="section-title">Overview</div>
          <p className="regular-text">Integer orci dolor, dignissim id bibendum eget, molestie at justo. Quisque rutrum scelerisque odio, in dictum nulla ullamcorper sed. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras venenatis lorem vitae arcu egestas dictum. In auctor molestie sapien, vitae vulputate ipsum lacinia in. Suspendisse potenti. Aenean ut diam sodales, ultrices velit ac, varius nibh. In et sapien ultrices, ultricies velit ac, fermentum leo. Nulla facilisi. Aenean ac odio dolor. Nullam urna massa, varius eu dapibus vel, laoreet accumsan quam.</p>
          <p className="regular-text">Donec pharetra justo id porttitor aliquet. Nunc iaculis nulla at ligula efficitur commodo. Mauris dignissim, purus vitae scelerisque facilisis, nisl elit malesuada felis, ut malesuada justo risus vitae odio. Mauris malesuada, elit quis iaculis imperdiet, metus nisi feugiat orci, sit amet pretium lacus elit ultricies neque. Donec viverra blandit placerat. Ut porttitor iaculis leo, a ultricies turpis dictum aliquam. Vivamus auctor aliquet dolor, a aliquet arcu tempor ullamcorper. Sed ut fringilla ex. Vestibulum interdum dictum felis, a feugiat diam gravida sit amet. Integer imperdiet pretium urna, a convallis arcu. Cras et libero et tortor lobortis malesuada vitae ac eros. Vivamus massa leo, fringilla et nisi id, blandit interdum justo. Ut non tortor vel erat sagittis rhoncus. Donec consequat ut sem at pharetra. Nulla pharetra, diam nec rhoncus dictum, justo neque bibendum nunc, a euismod eros dui a risus. Proin tempor ligula at nunc bibendum, imperdiet cursus erat varius.</p>
        </section>
        <section id="downloads-section" className="section">
          <div className="section-title">Downloads</div>
        </section>
      </div>
      <div className="space"></div>
    </div>
  );
}


function Dropdown({ label, options, onChange, value }) {
  return (
    <div className="dropdown-container">
      <div className="dropdown-label">{label}</div>
      <select 
        className="dropdown"
        onChange={onChange} 
        value={value}
      >
        <option value="">all domains</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;
