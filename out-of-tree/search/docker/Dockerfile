FROM python:3

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 PYTHONUNBUFFERED=1

EXPOSE 8005

env VIRTUAL_ENV=/search

RUN groupadd -r yang \
  && useradd --no-log-init -r -g yang -u 1001 -d $VIRTUAL_ENV yang \
  && pip install virtualenv \
  && virtualenv --system-site-packages $VIRTUAL_ENV \
  && mkdir /etc/yangcatalog
COPY . $VIRTUAL_ENV

ENV PYTHONPATH=$VIRTUAL_ENV/bin/python
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV UWSGI_PROCS=2

WORKDIR $VIRTUAL_ENV

RUN pip install -r requirements.txt \
  && pip install elasticsearch

# Support arbitrary UIDs as per OpenShift guidelines
USER 1001:0

ENV DJANGO_SETTINGS_MODULE=yang.settings

CMD exec uwsgi -s :8005 --protocol uwsgi -p $UWSGI_PROCS \
  -w yang.wsgi:application --need-app

EXPOSE 8005
