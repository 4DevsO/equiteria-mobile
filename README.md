# e-quiteria mobile

## Building Release

### Generating an upload key
You can generate a private signing key using `keytool`.

```sh
$ keytool -genkeypair -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

This command prompts you for passwords for the keystore and key and for the Distinguished Name fields for your key. It then generates the keystore as a file called my-upload-key.keystore.

The keystore contains a single key, valid for 10000 days. The alias is a name that you will use later when signing your app, so remember to take note of the alias.

### Generating Google Play Services SHA-1 signing certificate for Firebase

```
keytool -exportcert -list -v -alias my-key-alias -keystore my-upload-key.keystore
```

The keytool utility prompts you to enter a password for the keystore. The keytool then prints the fingerprint to the terminal. For example:

```
Certificate fingerprint: SHA1: DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09
```

Copy the SHA-1 and add it to your Firebase project (Project Settings).

### Setting up Gradle variables

- Place the my-upload-key.keystore file under the android/app directory in your project folder.
- Edit the file android/gradle.properties, and add the following (replace ***** with the correct keystore password, alias and key password),

```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

These are going to be global Gradle variables, which we can later use in our Gradle config to sign our app.

### Adding signing config to your app's Gradle config

The last configuration step that needs to be done is to setup release builds to be signed using upload key. Edit the file android/app/build.gradle in your project folder, and add the signing config,

```
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```

### Generating the release APK

```sh
$ cd android
$ ./gradlew assembleRelease # Creates the release APK
$ ./gradlew bundleRelease # Creates the ABB bundle
```

Gradle's bundleRelease will bundle all the JavaScript needed to run your app into the AAB (Android App Bundle).

The generated AAB can be found under android/app/build/outputs/bundle/release/app.aab, and is ready to be uploaded to Google Play.

Note: In order for Google Play to accept AAB format the App Signing by Google Play needs to be configured for your application on the Google Play Console.
