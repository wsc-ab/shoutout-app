#!/bin/sh

# Install CocoaPods and npm using Homebrew.
echo "Install CocoaPods"
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods
pod --version

echo "Install npm"
brew install npm

# Install dependencies
echo "Running npm install"
npm install --legacy-peer-deps

echo "Running pod install"
cd ios
pod install
