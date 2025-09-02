#!/bin/bash

export LOCAL_IP=`hostname -i`
export NODEJS_IP=`dig +short node-observer`
export CRON_IP=`dig +short cron-service`

# envsubst < ./kernel/config.local.template > kernel/config.local.php
envsubst '$${HOST_NAME}' < ./conf/observer.template > /etc/apache2/sites-available/observer.conf

case $SRV_RUN in
  WWW )
    a2ensite observer
    apache2ctl -D FOREGROUND
    ;;
  JOB )
    # Run job directly in foreground instead of background processes
    # JOB_START defines the job type (e.g., mon_device)
    # JOB_KEY defines the specific key to listen to (e.g., packet.receive, command.create, etc.)
    php ./jobs/job-starter.php $JOB_START $JOB_KEY
    ;;
esac
