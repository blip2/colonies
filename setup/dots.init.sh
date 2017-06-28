#!/bin/sh
### BEGIN INIT INFO
# Provides:          dots-server
# Required-Start:    $local_fs $network $named $time $syslog
# Required-Stop:     $local_fs $network $named $time $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Description:       Dots and Boxes Server
### END INIT INFO

SCRIPT="node dotsandboxes.js"
RUNIN=/home/dots/dots_and_boxes/server/
RUNAS=dots
NAME=dots-server
DESC="Dots and Boxes Server"

PIDFILE=/var/run/$NAME.pid
LOGFILE=/dev/null
#LOGFILE=/var/log/$NAME.log

if [ -f /etc/default/rcS ]; then
        . /etc/default/rcS
fi
. /lib/lsb/init-functions

start() {
  log_daemon_msg "Starting $DESC" "$NAME"
  if [ -f $PIDFILE ] && kill -0 $(cat $PIDFILE); then
    log_success_msg
    log_warning_msg "Server was already running"
    return 1
  fi
  cd $RUNIN
  local CMD="$SCRIPT &> \"$LOGFILE\" & echo \$!"
  su -c "$CMD" $RUNAS > "$PIDFILE"
  log_success_msg
}

stop() {
  log_daemon_msg "Stopping $DESC" "$NAME"
  if [ ! -f "$PIDFILE" ] || ! kill -0 $(cat "$PIDFILE"); then
    log_success_msg
    log_warning_msg "Server was not running"
    return 1
  fi
  kill -15 $(cat "$PIDFILE") && rm -f "$PIDFILE"
  log_success_msg
}

status() {
    status_of_proc -p $PIDFILE "dots-server" "$NAME"
}


case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  status)
    status
    ;;
  uninstall)
    uninstall
    ;;
  restart)
    stop
    start
    ;;
  *)
    echo "Usage: $0 {start|stop|status|restart}"
esac
