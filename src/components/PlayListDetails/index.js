import {Component} from 'react'
import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {GoArrowLeft} from 'react-icons/go'
import SmallDeviceDetails from '../SmallDeviceDetails'
import MediaPlayer from '../MediaPlayer'
import SongContexts from '../../SongContext/SongContexts'
import './PlayList.css'

const status = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class PlayListDetails extends Component {
  state = {
    ActiveStatus: status.initial,
    banner: '',
    name: '',
    description: '',
    smallDetails: [],
    newValue: false,
  }

  componentDidMount = () => {
    this.getApis()
  }

  componentDidUpdate(prevProps, prevState) {
    const {newValue} = this.state
    if (newValue !== prevState.newValue) {
      this.setState({newValue})
    }
  }

  getApis = async () => {
    try {
      const Token = Cookies.get('Token')
      this.setState({ActiveStatus: status.pending})
      const {match} = this.props
      const {params} = match
      const {id} = params

      const url = `https://apis2.ccbp.in/spotify-clone/playlists-details/${id}`
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }

      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        this.setState({
          name: data.name,
          banner: data.images[0].url,
          description: data.description,
        })
        const updated = data.tracks.items.map(each => ({
          songName: each.track.name,
          song: each.track.preview_url,
          duration: each.track.duration_ms,
          artist: each.track.artists[0].name,
          id: each.track.id,
        }))

        this.setState({ActiveStatus: status.success, smallDetails: updated})
      } else if (response.status === 404) {
        this.setState({ActiveStatus: status.failed})
      }
    } catch (e) {
      this.setState({ActiveStatus: status.failed})
    }
  }

  goBack = () => {
    const {history} = this.props
    history.replace('/')
  }

  render() {
    const {ActiveStatus, banner, name, description, smallDetails} = this.state
    console.log(ActiveStatus)

    return (
      <SongContexts.Consumer>
        {contextValue => {
          const {ActiveSong} = contextValue
          const {newValue} = this.state

          if (ActiveSong !== newValue) {
            this.setState({newValue: ActiveSong})
          }

          return (
            <div className="main-container">
              <nav className="nav-bar">
                <img
                  src="https://i.ibb.co/tMjFXWf/music.png"
                  alt="website logo"
                  className="music-img"
                />
                <div className="flex">
                  <GiHamburgerMenu style={{color: '#ffffff'}} />
                </div>
              </nav>
              <div
                className="back"
                data-testid="back"
                onClick={this.goBack}
                role="button"
                tabIndex={0}
              >
                <GoArrowLeft />
                <p>Back</p>
              </div>
              <div className="banner">
                <img
                  src={banner}
                  alt="featured playlist"
                  className="banner-img"
                />
                <div className="name-para">
                  <h1 className="name-heading">{name}</h1>
                  <p className="name-para">{description}</p>
                </div>
              </div>
              <div className="small">
                <ul className="smallUl">
                  {smallDetails
                    .filter(each => each.song !== null)
                    .map(each => (
                      <SmallDeviceDetails key={each.id} value={each} />
                    ))}
                </ul>
              </div>
              {ActiveSong && <MediaPlayer />}
            </div>
          )
        }}
      </SongContexts.Consumer>
    )
  }
}

export default PlayListDetails
