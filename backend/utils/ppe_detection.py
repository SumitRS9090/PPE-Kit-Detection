# Utility to decide missing PPE items per environment

ENV_PPE = {
    "construction": ["Helmet", "Vest", "Shoes"],
    "welding": ["Goggles", "Gloves", "Mask"],
    "office": ["Vest", "Mask"]
}

def analyze_ppe(environment, detected_items):
    required = ENV_PPE.get(environment, [])
    missing = [item for item in required if item not in detected_items]
    return missing
