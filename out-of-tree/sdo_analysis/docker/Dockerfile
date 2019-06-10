FROM python:3

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 PYTHONUNBUFFERED=1

ENV VIRTUAL_ENV=/sdo_analysis

RUN groupadd -r yang \
  && useradd --no-log-init -r -g yang -u 1016 -d $VIRTUAL_ENV yang

#Install Cron
RUN apt-get update
RUN apt-get -y install cron \
  && apt-get autoremove -y

COPY . $VIRTUAL_ENV

WORKDIR $VIRTUAL_ENV

ENV confd_version 6.7

RUN apt-get update
RUN apt-get install -y \
    wget \
    gnupg2

RUN echo "deb http://download.opensuse.org/repositories/home:/liberouter/xUbuntu_18.04/ /" > /etc/apt/sources.list.d/libyang.list
RUN wget -nv https://download.opensuse.org/repositories/home:liberouter/xUbuntu_18.04/Release.key -O Release.key
RUN apt-key add - < Release.key

RUN apt-get update

RUN apt-get install -y \
	libyang \
	python3.6 \
	python3-pip \
    openssh-client

RUN pip3 install --upgrade pip
RUN pip3 install pyang

RUN mkdir /opt/confd
RUN /sdo_analysis/confd-${confd_version}.linux.x86_64.installer.bin /opt/confd

RUN chmod 0777 bin/configure.sh

# Add crontab file in the cron directory
COPY crontab /etc/cron.d/ietf-cron

RUN chown yang:yang /etc/cron.d/ietf-cron
USER 1016:0

# Apply cron job
RUN crontab /etc/cron.d/ietf-cron

USER root:root

ENV PYTHONPATH=$VIRTUAL_ENV/bin/python
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV GIT_PYTHON_GIT_EXECUTABLE=/usr/bin/git

ENV YANG=/.
ENV YANGVAR="get_config.py --section Directory-Section --key var"
ENV BIN=$YANG/sdo_analysis/bin
ENV CONF=$YANG/sdo_analysis/conf
ENV BACKUPDIR="get_config.py --section Directory-Section --key backup"
ENV CONFD_DIR="get_config.py --section Tool-Section --key confd_dir"
ENV PYANG="get_config.py --section Tool-Section --key pyang_exec"

#
# Repositories
#
ENV NONIETFDIR="get_config.py --section Directory-Section --key non_ietf_directory"
ENV IETFDIR="get_config.py --section Directory-Section --key ietf_directory"
ENV MODULES="get_config.py --section Directory-Section --key modules_directory"

#
# Working directories
ENV LOGS="get_config.py --section Directory-Section --key logs"
ENV TMP="get_config.py --section Directory-Section --key temp"

#
# Where the HTML pages lie
#
ENV WEB_PRIVATE="get_config.py --section Web-Section --key private_directory"
ENV WEB_DOWNLOADABLES="get_config.py --section Web-Section --key downloadables_directory"
ENV WEB="get_config.py --section Web-Section --key public_directory"

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/ietf-cron

# Run the command on container startup
CMD cron -f && tail -f /var/yang/logs/cronjob-daily.log