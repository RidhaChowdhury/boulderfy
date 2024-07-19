#!/bin/bash

# Set your variables
KEYSTORE_PATH="keys.jks"
KEY_ALIAS="[KEY-ALIAS-HERE]"
KEYSTORE_PASSWORD="[KEYSTORE-PASSWORD-HERE]"
KEY_PASSWORD="[KEY-PASSWORD-HERE]"
BUNDLE_PATH="app.aab"
OUTPUT_PATH="output.apks"

# Run bundletool with the required flags and --universal
java -jar bundletool.jar build-apks --bundle="$BUNDLE_PATH" --output="$OUTPUT_PATH" --ks="$KEYSTORE_PATH" --ks-key-alias="$KEY_ALIAS" --ks-pass=pass:"$KEYSTORE_PASSWORD" --key-pass=pass:"$KEY_PASSWORD" --mode=universal

# Check if the output file exists and unzip the APKs
if [ -f "$OUTPUT_PATH" ]; then
  unzip "$OUTPUT_PATH" -d output-apks
else
  echo "APKs were not generated."
  exit 1
fi

# Verify extraction and install
if [ -d "output-apks" ]; then
  echo "Universal APK generated and extracted to output-apks."
  
  # Find the universal APK file and attempt to install it
  UNIVERSAL_APK=$(find output-apks -name "*.apk" | head -n 1)
  if [[ -f "$UNIVERSAL_APK" ]]; then
    echo "Installing $UNIVERSAL_APK to connected Android device..."
    adb install "$UNIVERSAL_APK"
  else
    echo "No APK file found in extracted files."
    exit 1
  fi
else
  echo "Failed to extract APKs."
  exit 1
fi
