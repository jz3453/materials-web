import React, { useState } from "react";
import PropTypes from "prop-types";
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
import ChartDataLabels from "chartjs-plugin-datalabels";import { countLineParams } from "./utils";
import classNames from "classnames";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels);

const chartOptions = {
    layout: {
        padding: {
            top: 20,
            bottom: 10,
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        datalabels: {
            display: true,
            color: "black",
            anchor: "end",
            align: "top",
            font: {
                size: 10,
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            ticks: {
                font: {
                    size: 10,
                }, 
            }
        },
        y: {
            title: {
                display: true,
                text: "Count",
                font: {
                    size: 10,
                },
            },
            ticks: {
                font: {
                    size: 10,
                }, 
            },
            beginAtZero: true,
        },
    },
};

function Parent({ node, isGray, setHoveredNode, handleClassSelected }) {
    return (
        <div className={classNames("parent-name", {
            "gray": isGray,
            })}
            onMouseEnter={() => !isGray && setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleClassSelected(node.name)}
        >
            {node.name}
        </div>
    );
};

function LeafNode({ node, isGray, setHoveredNode, handleClassSelected }) {
    return (
        <div className={classNames("leaf-node", {
            "gray": isGray,
            })}
            onMouseEnter={() => !isGray && setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleClassSelected(node.name)}
        >
            {node.name}
        </div>
    );
};

function TreeNode({
    children,
    selectedDomain,
    handleClassSelected,
    level = 0,
    hasParent = false,
    marginBottomDefault = 2,
    itemHeightDefault = 30,
}) {
    const [hoveredNode, setHoveredNode] = useState(null);

    const { length } = children;
    const isRoot = level === 0;
    return children.map((node, index) => {
        const { id } = node;
        const childrenCount = node.children ? node.children.length : 0;
        const hasSiblingsBelow = index < length - 1;
        const { top, height } = countLineParams(
            node,
            level,
            hasSiblingsBelow,
            marginBottomDefault,
            itemHeightDefault
        );

        let marginBottom = marginBottomDefault;
        if (index === length - 1) {
            marginBottom = 0;
        }

        const countForDomain = node.counts ? node.counts[selectedDomain] : 0;
        const isGray = selectedDomain && (!countForDomain || countForDomain === 0);

        const chartData = {
            labels: Object.keys(node.counts || {}),
            datasets: [
                {
                    data: Object.values(node.counts || {}),
                    backgroundColor: "rgba(232, 137, 150, 0.6)",
                },
            ],
        };

        return (
        <div 
            className="node"
            key={id}
            style={{ marginBottom }}
        >
            <div className="node__parent">
                {!isRoot && hasSiblingsBelow && (
                    <div className="node__parent__line" style={{ top, height }} />
                )}
                <div
                    className={classNames("node__parent__element", {
                        "has-children": childrenCount,
                        "has-parent": hasParent,
                    })}
                    style={{ height: itemHeightDefault }}
                >
                    <Parent node={node} isGray={isGray} setHoveredNode={setHoveredNode} handleClassSelected={handleClassSelected} />
                    {
                        !isGray && hoveredNode === node.id && (
                            <div className="tooltip">
                                <div>{node.name}</div>
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        )
                    }
                </div>
            </div>
            {
                level < 4 && (
                    <div className="node__children">
                    {
                        childrenCount > 0 && (
                            <TreeNode
                                children={node.children}
                                selectedDomain={selectedDomain}
                                handleClassSelected={handleClassSelected}
                                level={level + 1}
                                hasParent
                            />
                        )
                    }
                    </div>
                )
            }
            {
                level == 4 && (
                    <div className="node__leafs">
                        {
                            node.children.map((child, index) => {
                                const isGray = selectedDomain && child.counts[selectedDomain] === 0;

                                const chartData = {
                                    labels: Object.keys(child.counts || {}),
                                    datasets: [
                                        {
                                            data: Object.values(child.counts || {}),
                                            backgroundColor: "rgba(232, 137, 150, 0.6)",
                                        },
                                    ],
                                };

                                return (
                                    <div className="node__leafs__leafcontainer">
                                        <LeafNode node={child} isGray={isGray} setHoveredNode={setHoveredNode} handleClassSelected={handleClassSelected} />
                                        {!isGray && hoveredNode === child.id && (
                                            <div className="tooltip">
                                                <div>{child.name}</div>
                                                <Bar data={chartData} options={chartOptions} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        }
                    </div>
                )
            }
        </div>
        );
    })
}

export default TreeNode;