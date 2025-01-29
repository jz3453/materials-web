import json
from collections import Counter
from pathlib import Path
from typing import Callable, Dict, List, Union
import networkx as nx
import numpy as np
import pandas as pd


def get_taxonomy(
        source: Union[str, Path, Dict]
) -> nx.DiGraph:
    """
    Load the taxonomy tree file.

    Args:
        source (Union[str, Path, Dict]): File path or dictionary containing the tree data.

    Raises:
        TypeError: If the input is not a dictionary or file path.

    Returns:
        nx.DiGraph: The instantiated directed graph.
    """
    if isinstance(source, dict):
        tree_data = source
    elif isinstance(source, (str, Path)):
        with open(source, "r") as f:
            tree_data = json.load(f)
    else:
        raise TypeError("source must be a string, Path-like object, or dictionary.")

    return nx.tree_graph(tree_data, ident="name")


def aggregate_graph_attributes(
    graph: nx.DiGraph,
    start_node: str = "tree",
    node_agg_func: Callable = sum,
    edge_agg_func: Callable = sum,
) -> nx.DiGraph:
    """
    Aggregates attributes bottom-up in a subgraph starting from a specific node.

    Parameters:
        graph (nx.DiGraph): A directed graph representing the tree structure.
        start_node (any): The starting node of the subgraph.
        node_agg_func (function): Aggregation function for node attributes (default: sum).
        edge_agg_func (function): Aggregation function for edge attributes (default: sum).

    Returns:
        nx.DiGraph: Aggregated attributes at each node in the subgraph.
    """
    # Extract the subgraph starting at the specified node
    descendants = nx.descendants(graph, start_node) | {start_node}
    subgraph = graph.subgraph(descendants).copy()

    # Perform a reverse topological sort to process nodes bottom-up
    nodes_in_reverse_topo = list(nx.topological_sort(subgraph))[::-1]

    for node in nodes_in_reverse_topo:
        for child in subgraph.successors(node):
            for attr, value in subgraph.nodes[child].items():
                if attr in subgraph.nodes[node]:
                    subgraph.nodes[node][attr] = node_agg_func(
                        subgraph.nodes[node][attr], value
                    )
                else:
                    subgraph.nodes[node][attr] = value

            for attr, value in subgraph.get_edge_data(node, child, default={}).items():
                if attr in subgraph.nodes[node]:
                    subgraph.nodes[node][attr] = edge_agg_func(
                        subgraph.nodes[node][attr], value
                    )
                else:
                    subgraph.nodes[node][attr] = value

    return subgraph

DEFAULT_AUGMENTATIONS_X_ROTATIONS = np.linspace(
    (_start := -30), (_stop := 30), int((_stop - _start) / 15) + 1
)  # 15deg increments
DEFAULT_AUGMENTATIONS_Y_ROTATIONS = np.linspace(
    (_start := -30), (_stop := 30), int((_stop - _start) / 15) + 1
)  # 15deg increments
DEFAULT_AUGMENTATIONS_Z_ROTATIONS = np.array([0])  # no z rotation, for now
DEFAULT_AUGMENTATIONS_X_TRANSLATIONS = np.zeros(1)  # no x translation
DEFAULT_AUGMENTATIONS_Y_TRANSLATIONS = np.zeros(1)  # no y translation
DEFAULT_AUGMENTATIONS_Z_TRANSLATIONS = np.geomspace(0.35, 3.0, 5)
DEFAULT_AUGMENTATIONS_SIGMA_BLUR = np.array([0])


def generate_augmentation_set(
    x_rotations: np.ndarray = DEFAULT_AUGMENTATIONS_X_ROTATIONS,
    y_rotations: np.ndarray = DEFAULT_AUGMENTATIONS_Y_ROTATIONS,
    z_rotations: np.ndarray = DEFAULT_AUGMENTATIONS_Z_ROTATIONS,
    x_translations: np.ndarray = DEFAULT_AUGMENTATIONS_X_TRANSLATIONS,
    y_translations: np.ndarray = DEFAULT_AUGMENTATIONS_Y_TRANSLATIONS,
    z_translations: np.ndarray = DEFAULT_AUGMENTATIONS_Z_TRANSLATIONS,
    sigma_blurs: np.ndarray = DEFAULT_AUGMENTATIONS_SIGMA_BLUR,
) -> List[np.ndarray]:
    augmentations = [
        x_translations,
        y_translations,
        z_translations,
        x_rotations,
        y_rotations,
        z_rotations,
        sigma_blurs
    ]
    combinations = np.stack(np.meshgrid(*augmentations), axis=-1).reshape(
        -1, len(augmentations)
    )
    combinations = np.vstack(([None] * len(augmentations), combinations))

    df = pd.DataFrame(
        combinations,
        columns=[
            "xtrans[m]",
            "ytrans[m]",
            "ztrans[m]",
            "xrot [deg]",
            "yrot [deg]",
            "zrot [deg]",
            "blur [sigma]"
        ],
    )

    result_dict = {
        tuple(row): index  
        for index, row in df.iterrows()
    }

    if (None, None, None, None, None, None, None) in result_dict:
        result_dict[(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)] = result_dict.pop((None, None, None, None, None, None, None))

    return result_dict