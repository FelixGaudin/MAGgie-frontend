from flask import Flask, jsonify, render_template, request
import secrets
import time

app = Flask(__name__)

# Exemple de stockage temporaire des messages
chat_history = []

@app.route('/generate_token', methods=['GET'])
def generate_token():
    token = secrets.token_urlsafe(32)
    return jsonify({'token': token})

@app.route("/chat", methods=["POST"])
def chat():
    """This is a mock of the backend api"""
    
    time.sleep(5) # simulate the process time

    data = request.json
    model = data.get("model")
    user_id = data.get("userId")
    message = data.get("message")
    from_web = data.get("fromWeb")

    chat_history.append(
        {"model": model, "userId": user_id, "message": message, "fromWeb": from_web}
    )

    # Exemple de réponse de l'API
    response = {"status": "success", "message": "Message received"}
    return jsonify(response)


@app.route("/")
def index():
    # Renvoie le frontend HTML
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
