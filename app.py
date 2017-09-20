from flask import Flask, jsonify, render_template

from songkick import get_user_events_list

app = Flask(__name__)
app.config.from_object('settings.Config')

@app.route('/')
def index():
    return render_template('index.html', google_maps_api_key=app.config['GOOGLE_MAPS_API_KEY'])


@app.route('/api/get_user_events_list')
def _api_get_user_events_list():
    return jsonify(get_user_events_list(app.config['SONGKICK_USERNAME']))


if __name__ == '__main__':
    app.run(debug=True)
