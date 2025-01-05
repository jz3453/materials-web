from flask import Flask, jsonify, send_file
from flask_cors import CORS
from collections import Counter
import json
import networkx as nx
from utils import get_taxonomy, aggregate_graph_attributes

app = Flask(__name__)
CORS(app)

with open("assets/taxonomy-tree.json", "r") as file:
    TAXONOMY_TREE = json.load(file)

G = get_taxonomy(TAXONOMY_TREE)
H = aggregate_graph_attributes(
    G,
    node_agg_func=lambda *dicts: dict(
        sum([Counter(d) for d in dicts if isinstance(d, dict)], start=Counter())
    ),
)

TAXONOMY_TREE = nx.tree_data(H, root="tree", ident="name")

@app.route("/api/tree", methods=["GET"])
def get_tree():
    return jsonify(TAXONOMY_TREE)

if __name__ == "__main__":
    app.run(debug=True)