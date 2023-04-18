import { useState, useEffect } from 'react'
import api from '../../utils/axios'

const Video = (props) => {
  const [info, setInfo] = useState({})

    useEffect(() => {
      api('GET', 'api/site')
        .then(res => {
          if (res.data && res.data.status) {
            console.log("Data: "+res.data)
            setInfo(res.data.site)
          }
        })
    }, [])
    console.log(info.videoId)
  return (
    <div className="video-responsive">
      <div className='video-container'>
        <iframe
          width="853"
          height="480"
          src={`https://www.youtube.com/embed/${info.videoId || props.embedId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
      <div className='video-title'>
        <h3>{info.videoTitle}</h3>
      </div>
    </div>
  )
}

export default Video