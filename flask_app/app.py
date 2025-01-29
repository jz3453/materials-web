from flask import Flask, jsonify, send_file
from flask_cors import CORS
from collections import Counter
import json
import networkx as nx
import io
import os
from PIL import Image
import random
from utils import get_taxonomy, aggregate_graph_attributes, generate_augmentation_set

app = Flask(__name__)
CORS(app)

with open("assets/taxonomy-tree.json", "r") as file:
    TAXONOMY_TREE = json.load(file)

with open("assets/field_counts.json", "r") as file:
    FIELD_COUNTS = json.load(file)

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

@app.route("/api/field_counts", methods=["GET"])
def get_field_counts():
    return jsonify(FIELD_COUNTS)

@app.route("/api/augmentation_set", methods=["GET"])
def get_augmentation_set():
    augmentation_set = generate_augmentation_set()
    json_compatible_set = {",".join(map(str, key)): value for key, value in augmentation_set.items()}

    return jsonify(json_compatible_set)

def load_data():
    material_img_dict = {}
    folder_path = "data/label/"
    for file_name in os.listdir(folder_path):
        if file_name.endswith("000000.txt"):
            file_path = os.path.join(folder_path, file_name)
            with open(file_path, "r") as file:
                content = file.read().strip()
                img_file_name = "data/texture_img/" + file_name.replace(".txt", ".tiff")
                img_file_metadata = {
                    "label": content,
                    "image": img_file_name,
                }
                if content in material_img_dict:
                    material_img_dict[content].append(img_file_metadata)
                else:
                    material_img_dict[content] = [img_file_metadata]
        
    return material_img_dict

def aggregate_images(node, data):
    if node["name"] in data:
        return data[node["name"]]
    
    images = []
    for child in node.get("children", []):
        images.extend(aggregate_images(child, data)) 

    data[node["name"]] = images
    return images
            
data = load_data()
aggregate_images(TAXONOMY_TREE, data)

@app.route('/materials/<material>', methods=["GET"])
def get_images(material):
    if material not in data:
        return jsonify({'images': []})
    
    image_paths = data[material]
    return jsonify({'images': image_paths})

@app.route('/materials/sampling', methods=["GET"])
def get_sampling():
    if "Matter" not in data or not data["Matter"]:
        return jsonify({'error': 'No images found for Matter'}), 400

    all_images = data["Matter"]
    num_samples = 10
    sampling = random.sample(all_images, num_samples)
    print(sampling)
    return jsonify({'sampling': sampling})

@app.route('/image/<path:image_path>', methods=["GET"])
def serve_image(image_path):
    try:
        print(image_path)
        img = Image.open(image_path)
        print(img.mode)
        if img.mode == "I;16":
            img = img.point(lambda i: i * (1.0 / 256)).convert("L")
        
        if img.mode != "RGB":
            img = img.convert("RGB")
        
        img_io = io.BytesIO()
        img.save(img_io, "JPEG")
        img_io.seek(0)
        return send_file(img_io, mimetype="image/jpeg")
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    app.run(debug=True)