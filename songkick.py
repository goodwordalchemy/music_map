import os
import requests

from flask import Flask, jsonify, render_template

SONGKICK_API_BASE_URL = 'http://api.songkick.com/api/3.0/'


app = Flask(__name__)
app.config.from_object('settings.Config')


class SongkickCalendarsAPI(object):

    def _get(self, url_endpoint, params=None):
        full_url = os.path.join(SONGKICK_API_BASE_URL, url_endpoint)

        payload = {'apikey': app.config['SONGKICK_API_KEY']}

        if params is not None:
            payload.update(params)

        result = requests.get(full_url,  params=payload)

        return result

    def get_user_calendar_entries(self, username, params=None):
        if params is None:
            params = {'reason': 'tracked_artist'}

        endpoint_format = 'users/{username}/calendar.json'
        endpoint = endpoint_format.format(username=username)

        result = self._get(endpoint, params=params)

        return result


def get_user_events_list(username):
    client = SongkickCalendarsAPI()

    response = client.get_user_calendar_entries(username)

    response_json = response.json()

    events_list = response_json['resultsPage']['results']['calendarEntry']
    events_list = [e['event'] for e in events_list]

    print('printing eventslist')
    print(events_list)

    return events_list


@app.route('/')
def index():
    return render_template('index.html', google_maps_api_key=app.config['GOOGLE_MAPS_API_KEY'])

@app.route('/api/get_user_events_list')
def _api_get_user_events_list():
    return jsonify(get_user_events_list(app.config['SONGKICK_USERNAME']))
