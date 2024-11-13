import json
from typing import Dict, List

def load_product_data(file_path: str) -> List[Dict]:
    with open(file_path, 'r') as file:
        return json.load(file)

def calculate_product_score(product: Dict, user_data: Dict) -> float:
    score = 0
    
    # Basic matching
    if user_data['skinType'] == product['skinTypeCompatibility']:
        score += 2
    
    # Age-based scoring
    age = int(user_data['age'])
    if age < 25 and 'acne' in product['targetConcerns']:
        score += 1
    elif 25 <= age < 40 and 'hydration' in product['targetConcerns']:
        score += 1
    elif age >= 40 and 'anti-aging' in product['targetConcerns']:
        score += 1
    
    # Skin concerns matching
    for concern in user_data['skinConcerns']:
        if concern in product['targetConcerns']:
            score += 1
    
    # Current routine consideration
    if product['category'].lower() not in user_data['currentRoutine']:
        score += 0.5  # Slight boost for products not already in routine
    
    # Allergies check
    allergies = [allergy.strip().lower() for allergy in user_data['allergies'].split(',')]
    if any(allergy in product['ingredients'].lower() for allergy in allergies):
        return 0  # Exclude products with allergens
    
    # Budget consideration
    if user_data['budget'] == 'budget' and product['priceCategory'] == 'budget':
        score += 1
    elif user_data['budget'] == 'mid-range' and product['priceCategory'] in ['budget', 'mid-range']:
        score += 1
    elif user_data['budget'] == 'luxury' and product['priceCategory'] == 'luxury':
        score += 1
    
    # Preferred brands
    if product['brand'] in user_data['preferredBrands']:
        score += 1
    
    # Adjust score based on product rating
    score *= (1 + (product['averageRating'] - 3) / 5)
    
    return score

def get_recommendations(user_data: Dict, products: List[Dict], num_recommendations: int = 5) -> List[Dict]:
    scored_products = [
        (product, calculate_product_score(product, user_data))
        for product in products
    ]
    
    # Sort products by score in descending order
    scored_products.sort(key=lambda x: x[1], reverse=True)
    
    # Return top N recommendations
    return [product for product, _ in scored_products[:num_recommendations]]

def main(user_data: Dict) -> List[Dict]:
    products = load_product_data('skincare_products.json')
    recommendations = get_recommendations(user_data, products)
    return recommendations

# Example usage
if __name__ == "__main__":
    sample_user_data = {
        "gender": "female",
        "age": "30",
        "skinType": "combination",
        "skinConcerns": ["acne", "dryness"],
        "currentRoutine": ["cleanser", "moisturizer"],
        "allergies": "nuts, fragrance",
        "budget": "mid-range",
        "preferredBrands": ["CeraVe", "The Ordinary"]
    }
    
    results = main(sample_user_data)
    print(json.dumps(results, indent=2))