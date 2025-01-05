import json
from collections import Counter
from pathlib import Path
from typing import Callable, Dict, Union
import networkx as nx


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