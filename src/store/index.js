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
      getData = await API.get('/events/all', { headers: { token } })

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
  else if (action.type === 'FETCH_DATA_NOTIFICATION') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/notification', { headers: { token } })

      let datas = getData.data.data.filter(el => el.read_inline === 0 && el.read !== 1)
      next({
        type: 'FETCH_DATA_NOTIFICATION_SUCCESS',
        payload: { notif: getData.data.data, newNotif: datas }
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_CONTACT_US') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/contactUs/allContactUs', { headers: { token } })

      // let newData = await getData.data.data.filter(el => el.user_id === action.payload)
      // let newDataStaff = await getData.data.data.filter(el => el.evaluator_1 === action.payload || el.evaluator_2 === action.payload)

      let newData = [], newDataStaff = []

      await getData.data.data.forEach(el => {

        if (el.leave_date) {  // cuti
          let lastDate = el.leave_date.split(" ")[0].split(",")
          let newLastDate = lastDate[lastDate.length - 1] 
          if (
            (
              Number(newLastDate.slice(newLastDate.length - 5, newLastDate.length - 3)) >= new Date().getMonth()
              && Number(newLastDate.slice(newLastDate.length - 10, newLastDate.length - 6)) >= new Date().getFullYear()
            )
          ) {

            if (el.user_id === action.payload) newData.push(el)

            // if (lastDate.length > 1) {   // for data from web php (yyyy-mm-dd,yyyy-mm-dd,yyyy-mm-dd) 
            //   if (Number(newLastDate.slice(newLastDate.length - 2, newLastDate.length)) >= new Date().getDate()) {
            //     if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
            //   }
            // } else { // for data from mobile (yyyy-mm-dd hh:mm:ss)
            //   if ((Number(newLastDate.slice(newLastDate.length - 2, newLastDate.length)) + (Number(el.leave_request) - 1)) >= new Date().getDate()) {                
                if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
            //   }
            // }

          } else if (Number(newLastDate.slice(newLastDate.length - 10, newLastDate.length - 6)) > new Date().getFullYear()) {   // if next year

            if (el.user_id === action.payload) newData.push(el)
            if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
          }
        } else if (el.date_imp) {  // imp
          if (
            Number(el.date_imp.slice(el.date_imp.length - 5, el.date_imp.length - 3)) > new Date().getMonth()
            && Number(el.date_imp.slice(el.date_imp.length - 10, el.date_imp.length - 6)) >= new Date().getFullYear()) {

            if (el.user_id === action.payload) newData.push(el)

            if (Number(el.date_imp.slice(el.date_imp.length - 2, el.date_imp.length)) >= new Date().getDate()) {
              if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
            }

          } else if (Number(el.date_imp.slice(el.date_imp.length - 10, el.date_imp.length - 6)) > new Date().getFullYear()) {   // if next year
            if (el.user_id === action.payload) newData.push(el)
            if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
          }
        } else if (el.date_ijin_absen_end) {  // ia
          if (
            Number(el.date_ijin_absen_end.slice(el.date_ijin_absen_end.length - 5, el.date_ijin_absen_end.length - 3)) > new Date().getMonth()
            && Number(el.date_ijin_absen_end.slice(el.date_ijin_absen_end.length - 10, el.date_ijin_absen_end.length - 6)) >= new Date().getFullYear()) {

            if (el.user_id === action.payload) newData.push(el)

            if (Number(el.date_ijin_absen_end.slice(el.date_ijin_absen_end.length - 2, el.date_ijin_absen_end.length)) > new Date().getDate()) {
              if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
            }

          } else if (Number(el.date_ijin_absen_end.slice(el.date_ijin_absen_end.length - 10, el.date_ijin_absen_end.length - 6)) > new Date().getFullYear()) {  // if next year
            if (el.user_id === action.payload) newData.push(el)
            if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
          }
        } else if (el.type === "contact_us") {  // type === contact_us
          if ((el.status !== 'done' && el.status !== 'cancel') ||
            (el.status === 'done' && new Date(el.done_expired_date).getMonth() >= new Date().getMonth() - 1 &&
              new Date(el.done_expired_date).getFullYear() >= new Date().getFullYear())) {

            if (el.user_id === action.payload) newData.push(el)
            if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)

          } else if (new Date(el.done_expired_date).getFullYear() > new Date().getFullYear()) { // if next year
            if (el.user_id === action.payload) newData.push(el)
            if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
          }
        }
      })
      
      next({
        type: 'FETCH_DATA_CONTACT_US_SUCCESS',
        payload: { dataContactUs: newData, dataContactUsStaff: newDataStaff, dataAllContactUs: getData.data.data }
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
