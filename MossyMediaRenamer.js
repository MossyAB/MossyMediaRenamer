const fs = require('fs');
const path = require('path');

function GetEpisodeNumber(FileName){
  if(DebugMode)console.log(`Starting GetEpisodeNumber Function`);
  
  const Regex = /[eE]\d+/;
  const Match = FileName.match(Regex);

  if(Match){
    return Match[0].substring(1);
  }else{
    if(DebugMode){
      console.error("Episode Number Unfound For: ", FileName);
    }
    return null;
  }

}

function GetSeasonNumber(FolderPath){
  if(DebugMode)console.log(`Starting GetSeasonNumber Function`);

  const PathParts = FolderPath.split(/[\\/]/);
  let SeasonNumber = null;

  for (let i = 0; i < PathParts.length; i++) {
    if (PathParts[i].toLowerCase().includes('season')) {
      const Matches = PathParts[i].match(/\d{1,2}/);

      if (Matches) {
        SeasonNumber = Matches[0];
      }
      
      break;
    }
  }

  if(SeasonNumber == null){
    if(DebugMode){
      console.error("Error Getting Season Number For: ". FolderPath);
    }
  }else{
    return SeasonNumber;
  }

}

function GetShowName(FolderPath, MainFolderName){
  if(DebugMode)console.log(`Starting GetShowName Function`);

  const RegexPattern = `[\\\\/]?${MainFolderName}[\\\\/](.*?)[\\\\/]Season\\s\\d+`;
  const Regex = new RegExp(RegexPattern, 'i');

  const Match = FolderPath.match(Regex);

  if(Match && Match[1]){
    if(DebugMode){
      console.log("Show Name Got For:", FolderPath);
    }
    return Match[1]
  }else{
    if(DebugMode){
      console.error("Error Getting Show Name For: ", FolderPath);
    }
    return null;
  }
}

function GetFileExtention(FilePath){
  if(DebugMode)console.log(`Starting GetFileExtention Function`);
  const FileExention = path.extname(FilePath);

  if(FileExention == null){
    if(DebugMode){
      console.error("Error Getting File Extention For: ", FilePath);
    } 
    return null;
  }else{
    return FileExention;
  }

}

function RenameFile(OldPath, NewPath){
  if(DebugMode)console.log(`Starting RenameFile Function`);
  fs.rename(OldPath, NewPath, (Err) => {
    if(Err){
      if(DebugMode){
        console.error("Error Renaming File: ", FilePath);
      }
      return;
    }
  })
}

function RenameFiles(FolderPath, MainFolderName){

  if(DebugMode)console.log(`Starting RenameFiles Function`);

  fs.readdir(FolderPath, (Err, Files) => {
    
    if(Err){
      if(DebugMode){
        console.error('Error Reading Folder:', Err);
      }
      return;
    }

    Files.forEach((file) => {
      const FilePath = path.join(FolderPath, file);
      const FileName = file;

      if(DebugMode){
        console.log('Original FileName: ', file);
      }

      let EpisodeNumber = GetEpisodeNumber(FileName);
      let SeasonNumber = GetSeasonNumber(FolderPath);
      let ShowName = GetShowName(FolderPath, MainFolderName);
      let FileExention = GetFileExtention(FilePath);
      if(EpisodeNumber == null)return;
      if(SeasonNumber == null)return;
      if(ShowName == null)return;
      if(FileExention == null)return;
      
      let NewFileName = 
      `${ShowName} S${SeasonNumber} E${EpisodeNumber}${FileExention}`;

      if(DebugMode)console.log("NewFileName", NewFileName)

      let NewFilePath = `${FolderPath}/${NewFileName}`;

      if(DebugMode)console.log("NewFilePath", NewFilePath)

      RenameFile(FilePath, NewFilePath);

    })
  })

}

function LoopThroughSeasons(FolderPath, MainFolderName){
  if(DebugMode)console.log(`Starting LoopThroughSeasons Function`);

  fs.readdir(FolderPath, (Err, Folders) => {
    if(Err){
      if(DebugMode){
        console.error("Error Reading SubFolders In FolderPath: ", FolderPath);
      }
      return;
    }

    Folders.forEach((Folder) => {
      const SubFolderPath = path.join(FolderPath, Folder);

      if(fs.statSync(SubFolderPath).isDirectory()){
        RenameFiles(SubFolderPath, MainFolderName);
      }
    })
  })
}

function LoopThroughShowFolder(FolderPath, MainFolderName){
  console.log("Renaming Started");
  if(DebugMode)console.log(`Starting LoopThroughShowFolder Function`);

  fs.readdir(FolderPath, (Err, Folders) => {
    if(Err){
      if(DebugMode){
        console.error("Error Reading SubFolders In FolderPath: ", FolderPath);
      }
      return;
    }

    Folders.forEach((Folder) => {
      const SubFolderPath = path.join(FolderPath, Folder);

      if(fs.statSync(SubFolderPath).isDirectory()){
        LoopThroughSeasons(SubFolderPath, MainFolderName);
      }
    })
  })
  console.log("Renaming Finished");
}


const ConfigData = fs.readFileSync('config.json', 'utf8');

const Config = JSON.parse(ConfigData);

const DebugMode = Config.Debug;
const MainFolderName = Config.MainFolderName;
const ShowFolderPath = Config.ShowFolderPath;

const Repeat = Config.Repeat;
const RepeatInterval = Config.RepeatTime;


LoopThroughShowFolder(ShowFolderPath, MainFolderName);

if(Repeat){
  const IntervalTime = RepeatInterval * 60 * 1000;
  

  setInterval(() => {
    LoopThroughShowFolder(ShowFolderPath, MainFolderName);
  }, IntervalTime);
}