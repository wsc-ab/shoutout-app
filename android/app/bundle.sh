#!/usr/bin/env

# ENOSPC: System limit for number of file watchers reached Error
# https://reactnative.dev/docs/troubleshooting#case-1-error-codeenospcerrnoenospc
echo "set file watcher number to 582222"
echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

echo "running bundle script"

[[ "$BRANCH_NAME" == release* ]] && ./gradlew :app:bundleProductionRelease ||
./gradlew :app:bundleDevelopmentRelease ||

"exit 1"
