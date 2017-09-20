import os
import requests

import settings

SONGKICK_API_BASE_URL = 'http://api.songkick.com/api/3.0/'


def _get_songkick_api_key():
    return settings.Config.SONGKICK_API_KEY


class SongkickCalendarsAPI(object):

    def __init__(self):
        self.api_key = _get_songkick_api_key()

    def _get(self, url_endpoint, params=None):
        full_url = os.path.join(SONGKICK_API_BASE_URL, url_endpoint)

        payload = {'apikey': self.api_key}

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

    return events_list
