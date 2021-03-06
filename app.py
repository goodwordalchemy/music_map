from datetime import datetime, timedelta
import json
import logging
import sys

from flask import Flask, render_template, request, Response

from songkick import get_user_events_list

DATE_PICKER_FORMAT = '%Y-%m-%d'


app = Flask(__name__)
app.config.from_object('settings.Config')
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)


@app.route('/')
def index():
    return render_template('index.html', google_maps_api_key=app.config['GOOGLE_MAPS_API_KEY'])


@app.route('/api/get_user_events_list', methods=['GET', 'POST'])
def _api_get_user_events_list():
    start_date = datetime.strptime(request.args['start_date'], DATE_PICKER_FORMAT)
    end_date = datetime.strptime(request.args['end_date'], DATE_PICKER_FORMAT)

    user_events_list = get_user_events_list(app.config['SONGKICK_USERNAME'])

    filtered_user_events_list = []
    for event in user_events_list:
        event_date = datetime.strptime(event['start']['date'], DATE_PICKER_FORMAT)
        if event_date >= start_date and event_date <= end_date:
            filtered_user_events_list.append(event)

    return Response(json.dumps(filtered_user_events_list), mimetype='application/json')


if __name__ == '__main__':
    app.run()
