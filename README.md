# Picturebot
Picturebot is photo organizer app which allows the user to organize photos in a proper way. It allows the user to easily add pictures to albums. 
An album contains workflows, every workflow has a unique purpose. There are six defined workflows: backup, base, preview, favorites, edited and social media.

* **Backup** flow's purpose is to backup pictures taken in a shoot
* **Base** flow contains all filtered photos (blurred, unsharp, duplicate, … pictures are deleted)
* **Preview** flow contains converted RAW pictues, RAW pictures are converted to JPG
* **Favorites** flow contains all the pictures which are favorited, favorites pictures can be edited
* **Edited** flow contains pictures that are edited
* **Social media** flow contains cropped pictures that are used to post on social media

The idea is that the filesystem is mirrored within the application, actions such as library, collection and album deletion are non destructive. Which means that only the database link is deleted. Only picture deletions are destructive, the idea behind is that deleted pictures still can be restored from the backup flow.

Another feature is that all pictures follow a special naming convention, this is done automatically by the program

    <shoot_dd-mm-YYYY_index.extension>

The oldest pictures in the shoot is marked with index one

     <shoot_02-06-2020_1.jpg>
The second oldest pictures in the shoot is marked with index two, etc..

    <shoot_02-06-2020_2.jpg>

<a href="https://imgur.com/a/Ug8Tllf"><img src="https://i.imgur.com/Ug8Tllf.png" title="source: imgur.com" /></a>

----
## Structure
* **Library:** Is the main folder where all collections and albums are stored
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

> :warning: Every album contains workflows

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

![work_flow_8fps](https://user-images.githubusercontent.com/22329280/105846464-82647e80-5fdc-11eb-8dcb-96a40177a7a4.gif)

----
## Converting pictures

Converting RAW images to a JPG format is done by using [ImageMagick](https://imagemagick.org/script/download.php).

> :warning: A converersion percentage must be configured within the settings page

----
## Manual

> Under construction :warning:

----
## Features

* Add, update and delete libraries, collections and albums
* Rename pictures within a shoot accordingly
* Delete pictures
* Open current library, collection and album in explorer
* Open a picture with an external editing program
* Convert RAW pictures to a JPG picture format
* Picture slideshow when displaying pictures in full screen

----
## TODO

| Functionality	| Priority	| Status	|
| ------- | ----------------------------- | --------------- |
| Add picture lazy loading                                                                                                  | High      | :white_check_mark: |
| Database API                                                                                                              | High      | :x: |
| Investigate memory & performance issues                                                                                   | High      | :x: |
| Delete collections                                                                                                        | High      | :x: |
| Delete libraries                                                                                                          | High      | :x: |
| Import albums                                                                                                             | High      | :x: |
| Remove menu bar                                                                                                           | High      | :white_check_mark: |
| Enable full-screen when in display mode                                                                                   | High      | :white_check_mark: |
| Add functionality to import legacy albums to the new database system                                                      | High      | :white_check_mark: |
| Add pictures to an existing shoots                                                                                        | High      | :x: |
| Display update status' when the application is updating                                                                   | High	    | :x: |
| Fix: Date component layout issues in production                                                                           | High	    | :white_check_mark: |
| Conversion percentage default value                                                                                       | High      | :white_check_mark: |
| Automatically set the album date                                                                                          | Medium    | :x: |
| Visual representation whether a shoot is fully edited, partially edited, or not edited at all                             | Medium    | :x: |
| Investigate whether it is possible to add a tool to automatically upload pictures to google pictures                      | Medium	| :x: |
| Detect whether an external memory-card is connected and automatically open the directory when adding a new shoot          | Medium    | :x: |
| Investigate and implement the best way how to add a pictures within the backup flow to the base flow                      | Medium	| :x: |
| Add meta-data information to pictures                                                                                     | Medium	| :x: |
| Import compressed pictures                                                                                                | Medium	| :x: |
| Investigate and implement a way of dragging pictures to lightroom, since lightroom doesn’t support a CLI to open files    | Low       | :x: |
| Different themes                                                                                                          | Low       | :x: |
| Let the user decide how they want to format the datetime format                                                           | Low       | :x: |
| Add a picture rating system and the ability to filter pictures based on their rating                                      | Low       | :x: |
