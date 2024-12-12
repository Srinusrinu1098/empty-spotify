import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import SongContexts from '../../SongContext/SongContexts'
import './index.css'

const MediaPlayer = () => (
  <SongContexts.Consumer>
    {contextValue => {
      const {oldSong} = contextValue
      return <AudioPlayer className="media-player" autoPlay src={oldSong} />
    }}
  </SongContexts.Consumer>
)
export default MediaPlayer
