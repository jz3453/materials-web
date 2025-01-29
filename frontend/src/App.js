import { useState, useEffect } from "react";
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { DOMAINS } from "./constants";
import DataSampleDisplay from "./DataSampleDisplay/DataSampleDisplay";
import TaxonomyTree from "./TaxonomyTree/TaxonomyTree";
import SideBar from "./SideBar/SideBar";
import './App.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels);

// const apiUrl = process.env.REACT_APP_API_URL + "/api/tree";
const apiTreeUrl = "http://127.0.0.1:5000/api/tree"
const apiFieldCountUrl = "http://127.0.0.1:5000/api/field_counts"
const apiAugmentationSetUrl = "http://127.0.0.1:5000/api/augmentation_set"

function sortFieldCounts(fieldCounts) {
  const sortedFieldCounts = {};

  Object.entries(fieldCounts).forEach(([domain, materials]) => {
    const sortedMaterials = Object.entries(materials)
      .sort((a, b) => b[1] - a[1])

    sortedFieldCounts[domain] = Object.fromEntries(sortedMaterials);
  });

  return sortedFieldCounts;
}

function App() {
  const [taxonomyTree, setTaxonomyTree] = useState(null);
  const [fieldCounts, setFieldCounts] = useState(null);
  const [augmentationSet, setAugmentationSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedClass, setSelectedClass] = useState("Matter")

  const [hoveredNode, setHoveredNode] = useState(null);

  const handleDropdownChange = (event) => {
    setSelectedDomain(event.target.value);
  }

  const handleClassSelected = (c) => {
    setSelectedClass(c)
    console.log("new class selected")
  }

  useEffect(() => {
    axios.get(apiTreeUrl)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((data) => {
        setTaxonomyTree(data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    axios.get(apiFieldCountUrl)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((data) => {
        let sortedCounts = sortFieldCounts(data); 
        setFieldCounts(sortedCounts);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

      axios.get(apiAugmentationSetUrl)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error("Network response was not ok");
          }
          return response.data;
        })
        .then((data) => {
          const parsedSet = new Map(
            Object.entries(data)
          );
          setAugmentationSet(parsedSet);
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
        <a href="#overview-section" className="topbar-item">Overview</a>
        <a href="#taxonomy-section" className="topbar-item">Taxonomy</a>
        <a href="#downloads-section" className="topbar-item">Downloads</a>
      </div>
      <div className="page-content">
        <div id="matador-intro" className="title">A Visual Taxonomy of Materials</div>
        <section className="image-grid-container">
          <DataSampleDisplay />
          {/* <div className="image-grid-caption">The Matador material image dataset is dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div> */}
        </section>
        <section id="overview-section" className="section">
          <div className="section-title">Overview</div>
          <p className="regular-text">Integer orci dolor, dignissim id bibendum eget, molestie at justo. Quisque rutrum scelerisque odio, in dictum nulla ullamcorper sed. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras venenatis lorem vitae arcu egestas dictum. In auctor molestie sapien, vitae vulputate ipsum lacinia in. Suspendisse potenti. Aenean ut diam sodales, ultrices velit ac, varius nibh. In et sapien ultrices, ultricies velit ac, fermentum leo. Nulla facilisi. Aenean ac odio dolor. Nullam urna massa, varius eu dapibus vel, laoreet accumsan quam.</p>
          <p className="regular-text">Donec pharetra justo id porttitor aliquet. Nunc iaculis nulla at ligula efficitur commodo. Mauris dignissim, purus vitae scelerisque facilisis, nisl elit malesuada felis, ut malesuada justo risus vitae odio. Mauris malesuada, elit quis iaculis imperdiet, metus nisi feugiat orci, sit amet pretium lacus elit ultricies neque. Donec viverra blandit placerat. Ut porttitor iaculis leo, a ultricies turpis dictum aliquam. Vivamus auctor aliquet dolor, a aliquet arcu tempor ullamcorper. Sed ut fringilla ex. Vestibulum interdum dictum felis, a feugiat diam gravida sit amet. Integer imperdiet pretium urna, a convallis arcu. Cras et libero et tortor lobortis malesuada vitae ac eros. Vivamus massa leo, fringilla et nisi id, blandit interdum justo. Ut non tortor vel erat sagittis rhoncus. Donec consequat ut sem at pharetra. Nulla pharetra, diam nec rhoncus dictum, justo neque bibendum nunc, a euismod eros dui a risus. Proin tempor ligula at nunc bibendum, imperdiet cursus erat varius.</p>
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
                setHoveredNode={setHoveredNode}
              />
            </div>
            <div className="sidebar-container">
              <SideBar selectedClass={selectedClass} augmentationSet={augmentationSet} />
            </div>
          </div>
          {fieldCounts && fieldCounts[selectedDomain] && (
            <div className="chart-container">
              <BarChart domainCounts={fieldCounts[selectedDomain]} selectedClass={selectedClass} hoveredNode={hoveredNode} />
            </div>
          )}
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
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

function BarChart({ domainCounts, selectedClass, hoveredNode }) {
  const labels = Object.keys(domainCounts);
  const dataValues = Object.values(domainCounts);

  let highlightedNode = null;
  if (selectedClass) {
    highlightedNode = selectedClass
  }
  if (hoveredNode) {
    highlightedNode = hoveredNode
  }
  const backgroundColors = labels.map((label) =>
    label === highlightedNode ? "rgba(255, 99, 132, 0.8)" : "rgba(58, 68, 160, 0.8)"
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Counts",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: { 
        display: false 
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "black",
          maxRotation: 90, 
          minRotation: 90, 
        },
        title: {
          display: true,
          text: "Materials",
          color: "black",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "black",
        },
        title: {
          display: true,
          text: "Counts",
          color: "black",
        },
      },
    },
  };

  return <Bar data={data} options={options}/>;
}

export default App;
