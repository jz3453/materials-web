const countItemsInSecondToLastLayer = (item, level, leafLevel) => {
    if (level === leafLevel - 1) {
        return item.children ? 1 : 0;
    }
    if (!item.children || item.children.length === 0) {
        return 0;
    }
    return item.children.reduce((acc, child) => {
        return acc + countItemsInSecondToLastLayer(child, level + 1, leafLevel);
    }, 0);
};

export const countLineParams = (
    node,
    level,
    hasSiblingsBelow,
    marginBottom,
    nodeHeight,
) => {
    const baseHeight = marginBottom + nodeHeight;
    const itemsWithLeafChildren = countItemsInSecondToLastLayer(node, level, 5);

    const top = nodeHeight / 2;
    let height = 0;
    if (hasSiblingsBelow && !itemsWithLeafChildren) {
        height = baseHeight + 1;
    } else {
        height = baseHeight * itemsWithLeafChildren + 1;
    }
    return { top, height };
};