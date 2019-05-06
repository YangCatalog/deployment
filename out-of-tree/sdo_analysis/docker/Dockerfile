FROM ubuntu:latest

# Add crontab file in the cron directory
ADD crontab /etc/cron.d/ietf-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/ietf-cron

#Install Cron
RUN apt-get update
RUN apt-get -y install cron

# Run the command on container startup
CMD cron