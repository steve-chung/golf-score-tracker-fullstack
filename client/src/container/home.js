import React, { Component } from 'react'
import Map from '../component/map'
import { TextField,
  List,
  ListItem,
  Dialog,
  DialogActions,
  DialogTitle,
  Slide,
  Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete'
import CourseList from '../component/courseList'
import { withRouter } from 'react-router-dom'
import { apiCall } from '../services/api'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  add: {
    float: 'right',
    height: 80
  },
  title: {
    marginTop: '3.5rem',
    marginBottom: '2.5rem'
  },
  typography: {
    useNextVariants: true
  }
})

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPosition: {
        lat: 0,
        lng: 0
      },
      address: '',
      courses: null,
      open: false,
      selectedCourseName: '',
      redirectToInvite: false,
      smallWindow: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleCourseInfo = this.handleCourseInfo.bind(this)
    this.handleChoose = this.handleChoose.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        currentPosition: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        smallWindow: !window.matchMedia('(min-width: 500px)').matches
      }, () => {
        const {lat, lng} = this.state.currentPosition
        this.handleCourseApi(lat, lng)
      })
    }, (err) => {
      console.error(err)
    },
    {timeout: 30000})
  }

  handleChange(e) {
    this.setState({
      address: e
    })
  }

  handleCourseApi(lat, lng) {
    apiCall('GET', `/api/courses?lat=${lat}&lng=${lng}`, null)
      .then(res => {
        this.handleCourseInfo(res)
      })
      .catch(err => {
        console.error(err)
      })
  }

  handleCourseInfo(info) {
    const newCourseInfo = info.businesses.map((course) => {
      return {
        id: course.id,
        name: course.name,
        address: course.location.display_address,
        phone: course.display_phone,
        coords: course.coordinates,
        distance: (course.distance / 1609.344).toFixed(2)
      }
    })
    this.setState({
      courses: newCourseInfo
    })
  }

  handleSelect(e) {
    geocodeByAddress(e)
      .then(res => getLatLng(res[0]))
      .then(latLng => {
        this.setState({
          currentPosition: {
            lat: latLng.lat,
            lng: latLng.lng
          }
        }, () => {
          const {lat, lng} = this.state.currentPosition
          this.handleCourseApi(lat, lng)
        })
      })
  }

  // handleCouresPost(course) {
  //   const date = Date.now()
  //   // fetch(`/courses`, {method: 'POST',
  //   //   headers: {
  //   //     'Accept': 'application/json',
  //   //     'Content-Type': 'application/json'
  //   //   },
  //   //   body: JSON.stringify({date: `${date}`,
  //   //     name: `${course}` })})
  //   apiCall('POST', `/courses`, null)
  //     .then(res => {
  //       console.log(res)
  //     })
  //     .catch(err => {
  //       console.error(err)
  //     })
  // }

  handleChoose(id) {
    const {courses} = this.state
    const chosenCourse = courses.filter((course) => {
      return course.id === id
    })
    this.props.handleCourseName(chosenCourse[0].name)
    this.setState({
      open: true,
      selectedCourseName: chosenCourse[0].name
    }
    )
  }

  handleClose(e) {
    const answer = e.target.textContent
    // const {selectedCourseName} = this.state
    if (answer === 'Yes') {
      // this.handleCouresPost(selectedCourseName)
      this.setState({
        open: false,
        redirectToInvite: true
      })
    } else {
      this.setState({
        open: false,
        redirectToInvite: false
      })
    }
  }

  render() {
    const { classes } = this.props
    const { courses, selectedCourseName, redirectToInvite } = this.state
    const { lat, lng } = this.state.currentPosition
    const renderFunc = ({ getInputProps, getSuggestionItemProps, suggestions, loading }) => (
      <div className="autocomplete-root">
        <TextField
          label='search city'
          placeholder='search'
          className={classes.textField}
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...getInputProps()} />
        <List componet='nav' className="autocomplete-dropdown-container">
          {loading && <div>Loading...</div>}
          {suggestions.map((suggestion, i) => (
            <ListItem key={i} button component='nav' {...getSuggestionItemProps(suggestion)}>
              <span>{suggestion.description}</span>
            </ListItem>
          ))}
        </List>
      </div>
    )
    return (
      <div className='container' style={{width: '80%', margin: 'auto'}}>
        <h1 className='title'> Golf Score Keeper </h1>
        {redirectToInvite &&
          this.props.history.push(`/invite`)}

        <PlacesAutocomplete value={this.state.address}
          onChange={this.handleChange} onSelect={this.handleSelect} >
          {renderFunc}
        </PlacesAutocomplete>
        <Map courses = {courses} lat={lat} lng={lng}>
        </Map>
        { courses && <CourseList courses={courses} handleChoose={this.handleChoose}>
        </CourseList>}
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description">
          <DialogTitle id="alert-dialog-slide-title">
            Do you want to play at {selectedCourseName}?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              No
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>

    )
  }
}

export default withRouter(withStyles(styles)(Home))
