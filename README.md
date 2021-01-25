# Picturebot
Picturebot is photo organizer app which allows the user to organize photos in a proper way. It allows the user to easily add pictures to albums. 
An album contains workflows, every workflow has a unique purpose. There are six defined workflows: backup, base, preview, favorties, edited and social media.

* **Backup** flow's purpose is to backup pictures taken in a shoot
* **Base** flow contains all filtered photos (blurred, unsharp, duplicate, … pictures are deleted)
* **Preview** flow contains converted RAW pictues, RAW pictures are converted to JPG
* **Favorites** flow contains all the pictures which are favorited, favorites pictures can be edited
* **Edited** flow contains pictures that are edited
* **Social media** flow contains cropped pictures that are used to post on social media

All pictures follow a special naming convention

    <shoot_dd-mm-YYYY_index.extension>

The oldest pictures in the shoot is marked with index one

     <shoot_02-06-2020_1.jpg>
The second oldest pictures in the shoot is marked with index two, etc..

    <shoot_02-06-2020_2.jpg>

<a href="https://imgur.com/a/Ug8Tllf"><img src="https://i.imgur.com/Ug8Tllf.png" title="source: imgur.com" /></a>

----
## Structure
* **Library:** Is the main folder where all collections and ablums are stored
* **Collection:** Multiple collections can be linked to a library, their purpose is to hold multiple albums
* **Album:** Contains pictures organized in flows

### Example
```bash
United states (library)
├── Arizona (collection)
│   ├── Grand canyon (album)
│   └── Monument valley (album)
├── Florida (collection)
│   ├── Miami (album)
│   └── Disney world (album)
└── California (collection)
    ├── Los Angeles (album)
    └── San Francisco (album)
```
> Note: every album contains workflows
----
## Workflow

1. Create a library 
2. Create a collection and link it to a library
3. Create an album and link an album to a collection
4. Drag pictures to the dropzone and save the pictures
5. Delete blurred, unsharp and duplicated pictures
6. Click on the start organizing button
7. Favorite the pictures you did like to edit
8. After editing the picture save the picture within the edited flow

<a href="https://imgur.com/A1pWAMZ"><img src="https://i.imgur.com/A1pWAMZ.gif" title="source: imgur.com" /></a>

----
## Converting pictures

Converting RAW images to a JPG format is done by using [ImageMagick](https://imagemagick.org/script/download.php).

----
## Manual

> Under construction :warning:

An in depth manual can be found on the wiki page of this Git repository [wiki](https://github.com/Tomekske/PicturebotGUI/wiki).

----
## Features

* Add, update and delete workspaces
* Switch between workspaces
* Reorder workspace order
* Add a new shoot to the workspace
* Rename shoot and pictures accordingly 
* Delete shoots
* Delete pictures
* Open current workspace in explorer
* Open current shoot in explorer
* Edit pictures
* Upload pictures to the cloud in a very basic and straightforward way
* Convert RAW pictures to a JPG picture format
* Picture slideshow when displaying pictures in full screen
* View log file with the user’s default editor

----
## TODO

| Functionality	| Priority	| Status	|
| ------- | ----------------------------- | --------------- |
| Port the application to WPF using dotnet core(front-end and back-end), refactor code in doing so                          | High      | :x: |
| Move to a database system instead of working with absolute file paths                                                     | High      | :x: |
| Add functionality to import pictures to the new database system once the new system is rolled out                         | High      | :x: |
| Investigate and implement an alternative for the JSON configuration file                                                  | High      | :x: |
| Speed up converting RAW pictures to a JPG picture format                                                                  | High      | :x: |
| Add pictures to an existing shoots                                                                                        | High      | :x: |
| Detect whether an external memory-card is connected and automatically open the directory when adding a new shoot          | High      | :x: |
| Display an error message when the user tries to open the workspace directory when a workspace is not added yet            | High      | :white_check_mark: |
| Add / configure an installer to install Picturebot on a machine                                                           | High      | :white_check_mark: |
| Add a picture rating system and the ability to filter pictures based on their rating                                      | Medium    | :x: |
| Visual representation whether a shoot is fully edited, partially edited, or not edited at all                             | Medium	| :x: |
| Investigate whether it is possible to add a tool to automatically upload pictures to google pictures                      | Medium	| :x: |
| Ability to delete a picture when the user is browsing the pictures in the slideshow                                       | Medium	| :x: |
| Update the application whenever a newer version is available without overwriting the user’s settings                      | Medium	| :x: |
| Investigate and implement the best way how to add a picture within the backup flow to the base flow                       | Medium	| :x: |
| Add meta-data information to pictures                                                                                     | Medium	| :x: |
| Import mixed file formats shoots (RAW and JPG combined)                                                                   | Medium	| :x: |
| CI to run C# tests                                                                                                        | Medium	| :x: |
| Investigate and implement a way of dragging pictures to lightroom, since lightroom doesn’t support a CLI to open files    | Low	| :x: |
| Different themes                                                                                                          | Low   | :x: |
| Let the user decide how they want to format the datetime format                                                           | Low	| :x: |

