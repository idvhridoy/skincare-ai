from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendation_engine import main as get_recommendations

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://your-vercel-app-url.vercel.app"}})

@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    user_data = request.json
    
    # Validate user data
    required_fields = ['gender', 'age', 'skinType', 'skinConcerns', 'currentRoutine', 'allergies', 'budget', 'preferredBrands']
    if not all(field in user_data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        recommendations = get_recommendations(user_data)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)