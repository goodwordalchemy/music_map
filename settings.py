import os


class Config(object):
    GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')

    SONGKICK_USERNAME = os.environ.get('SONGKICK_USERNAME')
    SONGKICK_API_KEY = os.environ.get('SONGKICK_API_KEY')

    secret_key = os.environ.get('APP_SECRET_KEY')


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    pass
