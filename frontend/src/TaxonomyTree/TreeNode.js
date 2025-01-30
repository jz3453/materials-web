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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { countLineParams } from "./utils";
import classNames from "classnames";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels);

function Parent({ node, isGray, handleClassSelected }) {
    return (
        <div className={classNames("parent-name", {
            "gray": isGray,
            })}
            onClick={() => handleClassSelected(node.name)}
        >
            {node.name}
        </div>
    );
};

function LeafNode({ node, isGray, handleClassSelected, setHoveredNode }) {
    return (
        <div className={classNames("leaf-node", {
            "gray": isGray,
            })}
            onClick={() => handleClassSelected(node.name)}
            onMouseEnter={() => !isGray && setHoveredNode(node.name)}
            onMouseLeave={() => setHoveredNode(null)}

        >
            {node.name}
        </div>
    );
};

function TreeNode({
    children,
    selectedDomain,
    handleClassSelected,
    setHoveredNode,
    level = 0,
    hasParent = false,
    marginBottomDefault = 10,
    itemHeightDefault = 27,
}) {

    if (level === 1) {
        children = [children[0]];
    }

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
        const isDotted = level === 1 && node.name !== "Solid";

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
                        "is-root": isRoot,
                        "is-dotted": isDotted,
                    })}
                    style={{ height: itemHeightDefault }}
                >
                    <Parent node={node} isGray={isGray} handleClassSelected={handleClassSelected} />
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
                                setHoveredNode={setHoveredNode}
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
                        {/* <div className="node__leafs__line"></div> */}
                        {
                            node.children.map((child, index) => {
                                const isGray = selectedDomain && child.counts[selectedDomain] === 0;
                                return (
                                    <div className="node__leafs__leafcontainer">
                                        <LeafNode node={child} isGray={isGray} handleClassSelected={handleClassSelected} setHoveredNode={setHoveredNode}/>
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