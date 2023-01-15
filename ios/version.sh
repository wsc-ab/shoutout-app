# extract version information from package.json
PACKAGE_JSON_PATH="${PROJECT_DIR}/../package.json"

PACKAGE_VERSION=$(cat ${PACKAGE_JSON_PATH} | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

# set Internal Field Separator to .
IFS='.'
# split version string and read it into VERSIONS array
read -ra VERSIONS <<< "$PACKAGE_VERSION"

MAJOR="${VERSIONS[0]}"
MINOR="${VERSIONS[1]}"
PATCH="${VERSIONS[2]}"

# Set MARKETING_VERSION

MARKETING_VERSION="${MAJOR}.${MINOR}"

if [ ${PATCH} != "0" ]
then
    MARKETING_VERSION="${MARKETING_VERSION}.${PATCH}"
fi

echo "Set MARKETING_VERSION to $MARKETING_VERSION"

echo "MARKETING_VERSION=$MARKETING_VERSION" > "${PROJECT_DIR}/Config.xcconfig" 