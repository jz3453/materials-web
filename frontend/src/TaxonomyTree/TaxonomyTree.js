import PropTypes from "prop-types";
import TreeNode from "./TreeNode";
import TreeModel from "tree-model";
import "./styles.scss";

function TaxonomyTree({ taxonomyTree, selectedDomain, handleClassSelected, setHoveredNode }) {
    const tree = new TreeModel();
    const root = tree.parse(taxonomyTree);

    return (
        <div className="taxonomy-tree">
            <div className="column-names">
                <div className="column__first"></div>
                <div className="column">Phase</div>
                <div className="column">State</div>
                <div className="column">Composition</div>
                <div className="column">Form</div>
                <div className="column__last">Material</div>
            </div>
            <TreeNode 
                children={root.model.children}
                selectedDomain={selectedDomain}
                handleClassSelected={handleClassSelected}
                setHoveredNode={setHoveredNode}
            />
            <div class="vertical-phase-line"></div>
            <div class="horizontal-phase-line liquid"></div>
            <div className="dotted-phase-node liquid">Liquid</div>
            <div class="horizontal-phase-line gas"></div>
            <div className="dotted-phase-node gas">Gas</div>
        </div>
    );
}

export default TaxonomyTree;