import React from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer'

const Map = props => {

  const {lat, lng} = props
  const GoogleMapContainer = withGoogleMap(() => {
    return (
      <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat, lng }} >
        { (props.courses) &&
        (<MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={60}>
          {props.courses.map((marker, i) => (
            <Marker
              position={{lat: +marker.coords.latitude, lng: +marker.coords.longitude}}
              key={i} />
          ))}
        </MarkerClusterer>)
        }
      </GoogleMap>
    )
  })

  return (
    <div style={{height: `25rem`}}>
      <GoogleMapContainer
        loadingElement={<div style={{ heigh: `100%` }}/>}
        containerElement={<div style={{height: `100%`}}/>}
        mapElement={<div style={{height: `100%`}}/>} />
    </div>
  )
}

export default Map
