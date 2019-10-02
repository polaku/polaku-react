import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import { API } from '../config/API';

const api = store => next => async action => {
  let token = localStorage.getItem('token')

  if (action.type === 'FETCH_DATA_USERS') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/users', { headers: { token } })

      next({
        type: 'FETCH_DATA_USERS_SUCCESS',
        payload: getData.data.data
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_ROOMS') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/bookingRoom/rooms', { headers: { token } })
      next({
        type: 'FETCH_DATA_ROOMS_SUCCESS',
        payload: getData.data.data
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_ROOM_MASTER') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/bookingRoom/roomMaster', { headers: { token } })

      getData.data.data.forEach(element => {
        let companyList = []
        let company_id = element.company_id.split(',')

        if (company_id[0] !== '0') {
          company_id.forEach(el => {
            let temp = getData.data.dataCompany.find(company => (company.company_id === Number(el)))
            companyList.push(temp)
          })
        }
        element.tbl_companys = companyList
      });

      next({
        type: 'FETCH_DATA_ROOM_MASTER_SUCCESS',
        payload: getData.data.data
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_COMPANIES') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/company', { headers: { token } })

      next({
        type: 'FETCH_DATA_COMPANIES_SUCCESS',
        payload: getData.data.data
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_BUILDINGS') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/bookingRoom/building', { headers: { token } })

      next({
        type: 'FETCH_DATA_BUILDINGS_SUCCESS',
        payload: getData.data.data
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_BOOKING_ROOMS') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/bookingRoom', { headers: { token } })

      next({
        type: 'FETCH_DATA_BOOKING_ROOMS_SUCCESS',
        payload: getData.data.data
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_MY_BOOKING_ROOMS') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/bookingRoom/myroom', { headers: { token } })

      next({
        type: 'FETCH_DATA_MY_BOOKING_ROOMS_SUCCESS',
        payload: getData.data.data
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_EVENT') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/events', { headers: { token } })

      let newDataEvent = await getData.data.data.filter(event => event.status === 1)

      await newDataEvent.forEach(data => {
        data.start_date = new Date(data.start_date)
        data.end_date = new Date(data.end_date)
      })

      next({
        type: 'FETCH_DATA_EVENT_SUCCESS',
        payload: newDataEvent
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_EVENT_NEED_APPROVAL') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/events', { headers: { token } })

      let newDataEvent = await getData.data.data.filter(event => event.status === 0)

      await newDataEvent.forEach(data => {
        data.start_date = new Date(data.start_date)
        data.end_date = new Date(data.end_date)
      })

      next({
        type: 'FETCH_DATA_EVENT_NEED_APPROVAL_SUCCESS',
        payload: newDataEvent
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_CREATOR_MASTER_AND_ASSISTANT') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/events/masterCreator', { headers: { token } })

      next({
        type: 'FETCH_DATA_CREATOR_MASTER_AND_ASSISTANT_SUCCESS',
        payload: getData.data.data
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_DEPARTMENT') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/department', { headers: { token } })

      next({
        type: 'FETCH_DATA_DEPARTMENT_SUCCESS',
        payload: getData.data.data
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else {
    next(action)
  }
}

const store = createStore(reducer, applyMiddleware(api))

export default store
