import PropTypes from "prop-types";
import TreeNode from "./TreeNode";
import TreeModel from "tree-model";
import "./styles.scss";

function TaxonomyTree({ taxonomyTree, selectedDomain }) {
    const tree = new TreeModel();
    const root = tree.parse(taxonomyTree);

    console.log(taxonomyTree);
    return (
        <div className="taxonomy-tree">
        <TreeNode 
            children={root.model.children}
            selectedDomain={selectedDomain}
        />
        </div>
    );
}

export default TaxonomyTree;