import { createContext, useState, ReactNode, VoidFunctionComponent, useContext} from  'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  url: string;
  duration: number;
}
type PlayerContexData ={
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying:boolean;
  hasPrevious:boolean;
  hasNext: boolean;
  isLooping:boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playPrevious:() => void;
  playNext:() => void;
  playList:(list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleSuffle: () => void;
  clearPlayerState: () => void;
  setPlayingState: (state:boolean) => void;
} 

type PlayerContexProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContexData);

export function PlayerContextProvider({ children }: PlayerContexProviderProps){
  const [ episodeList, setEpisodeList] = useState([]);
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ isLooping, setIsLooping ] = useState(false);
  const [ isShuffling, setIsShuffling ] = useState (false);

  function play(episode: Episode){    
    setEpisodeList([episode]);    
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
  
  function playNext(){
    if (isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random()*episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
      console.log(nextRandomEpisodeIndex);
    }else
    if (hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex+1);
    }   
  }

  function playPrevious(){
    if (hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex-1);
    }
  }

  function toggleSuffle(){
    setIsShuffling(!isShuffling);
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);    
  }

  function toggleLoop(){
    setIsLooping(!isLooping);    
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      hasPrevious,
      hasNext,
      play,
      togglePlay,
      toggleLoop,
      toggleSuffle,
      setPlayingState,
      playList,
      playNext,
      playPrevious,
      isLooping,
      isShuffling,
      clearPlayerState
    }}>
      { children }
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}
