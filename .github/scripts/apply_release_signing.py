"""Apply release signing to the Expo-prebuild-generated Android project.

Reads the keystore and signing credentials from environment variables and
patches android/app/build.gradle to use them instead of the debug keystore.

Env vars:
  KEYSTORE_B64  - base64-encoded release keystore (optional)
  STORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD - signing credentials (required if KEYSTORE_B64 set)
"""
import base64
import os
import pathlib
import sys

b64 = os.environ.get('KEYSTORE_B64', '')
if not b64:
    print('No ANDROID_KEYSTORE_BASE64 secret - APK will be signed with the debug keystore (sideload-only).')
    sys.exit(0)

keystore_path = pathlib.Path('android/app/release.keystore')
keystore_path.write_bytes(base64.b64decode(b64))

store_password = os.environ.get('STORE_PASSWORD', '')
key_alias = os.environ.get('KEY_ALIAS', '')
key_password = os.environ.get('KEY_PASSWORD', '')
if not (store_password and key_alias and key_password):
    print('ERROR: ANDROID_KEYSTORE_BASE64 set but missing STORE_PASSWORD, KEY_ALIAS, or KEY_PASSWORD')
    sys.exit(1)

gradle_path = pathlib.Path('android/app/build.gradle')
content = gradle_path.read_text()
if 'debug.keystore' not in content:
    print('WARN: debug keystore block not found, skipping signing patch')
    sys.exit(0)

content = content.replace("storeFile file('debug.keystore')", "storeFile file('release.keystore')")
content = content.replace("storePassword 'android'", f"storePassword '{store_password}'")
content = content.replace("keyAlias 'androiddebugkey'", f"keyAlias '{key_alias}'")
content = content.replace("keyPassword 'android'", f"keyPassword '{key_password}'")
gradle_path.write_text(content)
print('Applied release signing config')