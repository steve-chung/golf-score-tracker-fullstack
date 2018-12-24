import React, { Component } from 'react'
import { CardContent, Typography, Card, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  card: {
    maxWidth: '100%',
    marginBottom: '10px'
  },
  button: {
    float: 'right'
  },
  title: {
    fontSize: '1rem',
    fontWeight: 700
  }
}

class CourseList extends Component {
  constructor(props) {
    super(props)

    this.handleChoose = this.handleChoose.bind(this)
  }

  handleChoose(id) {
    this.props.handleChoose(id)
  }

  render() {
    const { classes } = this.props
    const courses = this.props.courses.map((list) => (
      <Card className={classes.card} key={list.id}>
        <CardContent>
          <Typography className={classes.title} gutterBottom={false}>
            {list.name}
          </Typography>
          <Typography>
            {list.address.length > 2 ? list.address[0] + ' ' + list.address[1] : list.address[0]}
          </Typography>
          <Typography>
            {list.address.length > 2 ? list.address[2] : list.address[1]}
          </Typography>
          <Typography>
            Phone: {list.phone}
          </Typography>
          <Typography>
            Distance: {list.distance} mi
            <Button variant='contained' color='primary' className={classes.button} onClick={() => this.handleChoose(list.id)}>
              Choose
            </Button>
          </Typography>

        </CardContent>
      </Card>
    ))

    return (
      <div>
        { courses }
      </div>
    )
  }

}

export default withStyles(styles)(CourseList)
