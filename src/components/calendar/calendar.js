import React, { Component } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

Object.keys(Views).map(k => Views[k])
const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

const localizer = momentLocalizer(moment)

export default class calendar extends Component {
  render() {
    return (
      <Calendar
        events={this.props.data}
        views={['month', 'day']}
        step={60}
        showMultiDayTimes
        defaultDate={new Date()}
        components={{
          timeSlotWrapper: ColoredDateCellWrapper,
        }}
        style={{ width: '100%', height: '80vh' }}
        localizer={localizer}
        startAccessor="start_date"
        endAccessor="end_date"
        titleAccessor="event_name"
        minAccessor="time_in"
        maxAccessor="time_out"
      />
    )
  }
}
