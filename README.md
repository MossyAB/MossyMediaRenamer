## Welcome
Welcome to The Mossy Media Namer. This program will rename all your show files to match this naming format:
{Show Name} S{Season Number} E{Episode Number}.{File Type}
For Example `The Simpsons S09 E05.mkv`
The show name and Season are got from the file structure, so be sure to check out the *Media File Structure* section to make sure that your media is organised in the correct way before use. In addition make sure to read the config file setup to make sure that the program is setup correctly.

All libraries used in this program come with nodejs, so none need to be installed. And you run it the same way as any other nodejs file, just make sure the MossyMediaNaming.js and config.json file are in the same folder.

## Config File Setup
**Debug**
Debug does not need to be enabled at any point other then for extra information. There is extra information that you can get, and makes it easier to catch bugs.
**MainFolderName**
This is your main folder name, refer to the Media File Structure for what this should be.
**ShowFolderName**
This should be the file path to the folder that contains all of your shows.
**Repeat**
When this is true, the program can be kept open, and will run itself repeatively.
**RepeatTime**
This should be the amout of time in minutes in which you want the program to re-execute itself. You do not need to change this to have it not repeat, just set Repeat to false.

## Media File Structure
An example of the file structure is this breakdown:
All media on the server is in the folder
`F:/Jellyfin`
This is then broken down so all the shows are in `F:/Jellyfin/Shows`
Then in there each show has it's own folder such as `F:/Jellyfin/Shows/The Simpsons`
Then in each show folder each season of the show has it's own folder such as
 `F:/Jellyfin/Shows/The Simpsons/Season 9`

In this example the "ShowFolderPath" for the config file would be the `F:/Jellyfin/Shows` and the "MainFolderName" would be `Shows`

## Function Breakdown
**GetEpisodeName**
The GetEpisodeName function takes in the variable FileName. This is expected to be a string that follows a similar structure to this `The Simpsons S09 E05 Very Legit DVD RIP.mkv`
The function seaches the string until it finds something matching the format `E01` or `e01`. This is what is assumed to be the episode number.
If the function was able to find `E01` or `e01` in the FileName, then it will return the number. So in this case it would return 5.
However, if it is not able to find something matching the format, it will return null.

**GetSeasonNumber**
The SeasonNumber function takes in the variable FolderPath. This is expected to be a string that follows a similar structure to this `F:/Media Server/Shows/The Simpsons/Season 9`
The function searches through this string until it finds `season` (it is not case sensative). If it finds this it then takes that section of the folder path, and checks the rest for a 1 or 2 digit integer. If it finds this then it will return the number. So in this case it would return 9.
However, if it is not able to find something, it will return null.

**GetShowName**
The GetShowName function takes in the variables: FolderPath, and MainFolderName. FolderPath is expected to be a string that follows a similar structure to this `F:/Media Server/Shows/The Simpsons/Season 9` and MainFolderName is expected to be a string that a substring of the FolderPath such as `Shows`.
The function then goes through the FolderPath, checking for what is after the MainFolderName, and returns what is between that and the Season. So in this case it would check between the "Show/" and "/Season" and thus find The Simpons.
If it is able to find something in the desired location, it will return it therefore in this case `The Simpsons` is returned. However, if it is not able to find this, then it returns null.

**GetFileExtention**
TheGetFileExtention function takes in the variable FilePath. This is expected to be a string that folows a similar structure to this `F:/Media Server/Shows/The Simpsons/Season 9/The Simpsons S09 E05 Very Legit DVD RIP.mkv`
The function then strips the rest of the FilePath variable so it is just left with a recognised file extention. If it finds a file extention it will return said extentnion, therefore in this case it will return `.mkv`. However, if it can not find one it will return null.

**RenameFile**
The RenameFile function takes in the variables: OldPath, and NewPath. OldPath is expected to be a string that follows a similar structure to this `F:/Media Server/Shows/The Simpsons/Season 9/The Simpsons S09 E05 Very Legit DVD RIP.mkv` and NewPath is expected to be a string that follows a similar structure to this `F:/Media Server/Shows/The Simpsons/Season 9/The Simpsons S09 E05.mkv`
The function then renames the file at OldPath, so that it is now NewPath. Therefore in this case the file `The Simpsons S09 E05 Very Legit DVD RIP.mkv` would now be called `The Simpsons S09 E05.mkv`

**LoopThroughShowFolder**
The LoopThroughShowFolder function takes in the variables: FolderPath, and MainFolderName. FolderPath is expected to be a string that follows a similar structure to this `F:/Media Server` and MainFolderName is expexted to be a string that follows a similar structure to this `Shows`
The function then loops through the main folder, and for each folder in the folder it calls the LoopThroughSeasons function for each of them.
For example if `F:/Media Server/Shows` contained the folders: The Simpsons, Family Guy, American Dad, and Bobs Burger it would loop call the LoopThroughSeason function passing in the file path for the sub folders, such as `F:/Media Server/Shows/The Simpsons`, as well as also passing in the MainFolderName.

**LoopThroughSeasons**
The LoopThroughSeasons function takes in the variables: FolderPath, and MainFolderName. FolderPath is expected to be a string that follows a similar structure to this `F:/Media Server/Shows/The Simpsons` and MainFolderName is expected to be a string that follows a similar structure to this `Shows`
The function then goes through the folder, checking for any sub folders it has. It then passes these subfolders through to the function RenameFiles, as well as the MainFolderName. For example if The Simpsons folder contained the sub folders; Season 10, Season 9, and Season 32 it would pass through the file paths to the RenameFiles functon such as `F:/Media Server/Shows/The Simpsons/Season 9`

**RenameFiles**
The RenameFiles function takes in the variables: FolderPath, and MainFolderName. FolderPath is expected to bea string that follows a smilar structure to this `F:/Media Server/Shows/The Simpsons/Season 9` and MainFolderName ie expected to be a string that follows a similar structure to this `Shows`
The function then loops through the folder to get all the files within. With these files it calls the EpisodeNumber, SeasonNumber, ShowName, and FileExtention functions in order to attempt to get all the information required to rename the files. Once it has this information it builds a string of the new name, and the new file path for the file. It then passes the old file path and new file path to the RenameFile function. For example if the folder contained the file `The Simpsons S09 E05 Very Legit DVD RIP.mkv` it would call the RenameFile function using `F:/Media Server/Shows/The Simpsons/Season 9/The Simpsons S09 E05 Very Legit DVD RIP.mkv` as the old file path. Based on settings the new file name would be `The Simspons S09 E05.mkv` therefore it would pass in `F:/Media Server/Shows/The Simpsons/Season 9/The Simspons S09 E05.mkv` as the new file path.
