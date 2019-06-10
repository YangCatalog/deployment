FROM python:3

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 PYTHONUNBUFFERED=1

EXPOSE 8005

env VIRTUAL_ENV=/search

#Install Cron
RUN apt-get update
RUN apt-get -y install cron \
  && apt-get autoremove -y

RUN groupadd -r yang \
  && useradd --no-log-init -r -g yang -u 1016 -d $VIRTUAL_ENV yang \
  && pip install virtualenv \
  && virtualenv --system-site-packages $VIRTUAL_ENV \
  && mkdir /etc/yangcatalog
COPY . $VIRTUAL_ENV

ENV PYTHONPATH=$VIRTUAL_ENV/bin/python
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV UWSGI_PROCS=2

WORKDIR $VIRTUAL_ENV

RUN pip install -r requirements.txt \
  && pip install elasticsearch==6.4.0

# Add crontab file in the cron directory
COPY crontab /etc/cron.d/elastic-cron

COPY scripts/pyang_plugin/json_tree.py search/lib/python3.7/site-packages/pyang/plugins/.
COPY scripts/pyang_plugin/name-revision.py search/lib/python3.7/site-packages/pyang/plugins/.
COPY scripts/pyang_plugin/yang_catalog_index_es.py search/lib/python3.7/site-packages/pyang/plugins/.

RUN chown yang:yang /etc/cron.d/elastic-cron

USER 1016:0

# Apply cron job
RUN crontab /etc/cron.d/elastic-cron

ENV DJANGO_SETTINGS_MODULE=yang.settings

CMD exec uwsgi -s :8005 --protocol uwsgi -p $UWSGI_PROCS \
  -w yang.wsgi:application --need-app

EXPOSE 8005
