# setup

```
firebase init
```

```
? Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices.
❯◉ Database: Deploy Firebase Realtime Database Rules
 ◯ Firestore: Deploy rules and create indexes for Firestore
 ◯ Functions: Configure and deploy Cloud Functions
❯◉ Hosting: Configure and deploy Firebase Hosting sites
 ◯ Storage: Deploy Cloud Storage security rules
 ◯ Emulators: Set up local emulators for Firebase features
 ◯ Remote Config: Get, deploy, and rollback configurations for Remote Config
```

```
? Please select an option:
  Use an existing project
❯ Create a new project
  Add Firebase to an existing Google Cloud Platform project
  Don't set up a default project
```

```
i  If you want to create a project in a Google Cloud organization or folder, please use "firebase projects:create" instead, and return to this command when you've created the project.
? Please specify a unique project id (warning: cannot be modified afterward) [6-30 characters]:
 firebase-chat-app-9832 => 作成するプロジェクト名
? What would you like to call your project? (defaults to your project ID)
```

```
? Set up automatic builds and deploys with GitHub? (y/N) N
```

```
? What do you want to use as your public directory? public
? Configure as a single-page app (rewrite all urls to /index.html)? No
? Set up automatic builds and deploys with GitHub? No
? File public/404.html already exists. Overwrite? No
i  Skipping write of public/404.html
? File public/index.html already exists. Overwrite? No
i  Skipping write of public/index.html
```

# actions

```
// local
firebase serve
```

```
// publish
firebase deploy
```
