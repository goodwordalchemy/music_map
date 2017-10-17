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
            params = {}

        params.setdefault('reason', 'tracked_artist')

        endpoint_format = 'users/{username}/calendar.json'
        endpoint = endpoint_format.format(username=username)

        result = self._get(endpoint, params=params)

        return result

    def _get_user_calendar_response_page(self, username, page_number):
        response = self.get_user_calendar_entries(username, params={'page': page_number})
        response_json =  response.json()
        results_page = response_json['resultsPage']

        return results_page


def get_user_events_list(username):
    client = SongkickCalendarsAPI()

    # Get First Page of Calendar Entries.
    results_page = client._get_user_calendar_response_page(username, 1)

    events_list = results_page['results']['calendarEntry']

    total_entries, per_page = results_page['totalEntries'], results_page['perPage']
    total_pages = (total_entries - len(events_list)) / per_page
    total_pages = int(total_pages)

    for i in range(2, total_pages + 1):
        results_page = client._get_user_calendar_response_page(username, i)
        events_list.extend(results_page['results']['calendarEntry'])

    events_list = [e['event'] for e in events_list]

    return events_list
