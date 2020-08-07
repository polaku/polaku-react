import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import { API } from '../config/API';
import Cookies from 'js-cookie';
// import axios from 'axios';

// const CancelToken = axios.CancelToken;
// let cancel;

const api = store => next => async action => {
  let token = Cookies.get('POLAGROUP')

  if (action.type === 'FETCH_DATA_USERS') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get('/users', { headers: { token } })

      let newData = await getData.data.data.filter(user => user.tbl_account_detail)

      await newData.sort(compare)

      next({
        type: 'FETCH_DATA_USERS_SUCCESS',
        payload: newData
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
              Number(newLastDate.slice(newLastDate.length - 5, newLastDate.length - 3)) >= new Date().getMonth() + 1
              && Number(newLastDate.slice(newLastDate.length - 10, newLastDate.length - 6)) >= new Date().getFullYear()
            )
          ) {

            if (el.user_id === action.payload) newData.push(el)
            else if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)

            // if (lastDate.length > 1) {   // for data from web php (yyyy-mm-dd,yyyy-mm-dd,yyyy-mm-dd) 
            //   if (Number(newLastDate.slice(newLastDate.length - 2, newLastDate.length)) >= new Date().getDate()) {
            //     if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
            //   }
            // } else { // for data from mobile (yyyy-mm-dd hh:mm:ss)
            //   if ((Number(newLastDate.slice(newLastDate.length - 2, newLastDate.length)) + (Number(el.leave_request) - 1)) >= new Date().getDate()) {                
            //   }
            // }

          } else if (Number(newLastDate.slice(newLastDate.length - 10, newLastDate.length - 6)) > new Date().getFullYear()) {   // if next year

            if (el.user_id === action.payload) newData.push(el)
            else if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
          }



        } else if (el.date_imp) {  // imp
          if (
            Number(el.date_imp.slice(el.date_imp.length - 5, el.date_imp.length - 3)) > new Date().getMonth()
            && Number(el.date_imp.slice(el.date_imp.length - 10, el.date_imp.length - 6)) >= new Date().getFullYear()) {

            if (el.user_id === action.payload) newData.push(el)
            else if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)

            // if (Number(el.date_imp.slice(el.date_imp.length - 2, el.date_imp.length)) >= new Date().getDate()) {
            // }

          } else if (Number(el.date_imp.slice(el.date_imp.length - 10, el.date_imp.length - 6)) > new Date().getFullYear()) {   // if next year
            if (el.user_id === action.payload) newData.push(el)
            else if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
          }
        } else if (el.date_ijin_absen_end) {  // ia
          if (
            Number(el.date_ijin_absen_end.slice(el.date_ijin_absen_end.length - 5, el.date_ijin_absen_end.length - 3)) > new Date().getMonth()
            && Number(el.date_ijin_absen_end.slice(el.date_ijin_absen_end.length - 10, el.date_ijin_absen_end.length - 6)) >= new Date().getFullYear()) {

            if (el.user_id === action.payload) newData.push(el)
            else if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)

            // if (Number(el.date_ijin_absen_end.slice(el.date_ijin_absen_end.length - 2, el.date_ijin_absen_end.length)) > new Date().getDate()) {
            // }

          } else if (Number(el.date_ijin_absen_end.slice(el.date_ijin_absen_end.length - 10, el.date_ijin_absen_end.length - 6)) > new Date().getFullYear()) {  // if next year
            if (el.user_id === action.payload) newData.push(el)
            else if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
          }
        } else if (el.type === "contact_us") {  // type === contact_us
          if ((el.status !== 'done' && el.status !== 'cancel') ||
            (el.status === 'done' && new Date(el.done_expired_date).getMonth() >= new Date().getMonth() - 1 &&
              new Date(el.done_expired_date).getFullYear() >= new Date().getFullYear())) {

            if (el.user_id === action.payload) newData.push(el)
            else if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)

          } else if (new Date(el.done_expired_date).getFullYear() > new Date().getFullYear()) { // if next year
            if (el.user_id === action.payload) newData.push(el)
            else if (el.evaluator_1 === action.payload || el.evaluator_2 === action.payload) newDataStaff.push(el)
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
  else if (action.type === 'FETCH_DATA_ALL_KPIM') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getDataKPIM
    try {
      if (action.payload["for-setting"]) getDataKPIM = await API.get(`/kpim?for-setting=true&year=${action.payload.year}&month=${action.payload.month}&week=${action.payload.week}`, { headers: { token } })
      else if (action.payload["for-dashboard"]) getDataKPIM = await API.get(`/kpim?for-dashboard=true&year=${action.payload.year}&month=${action.payload.month}&week=${action.payload.week}&user-id=${action.payload.userId}`, { headers: { token } })
      else if (action.payload["for-report"]) getDataKPIM = await API.get(`/kpim?for-report=true&year=${action.payload.year}&month=${action.payload.month}`, { headers: { token } })
      else getDataKPIM = await API.get(`/kpim`, { headers: { token } })

      next({
        type: 'FETCH_DATA_ALL_KPIM_SUCCESS',
        payload: { dataAllKPIM: getDataKPIM.data.data }
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_ALL_TAL') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      if (action.payload["for-setting"]) getData = await API.get(`/tal?for-setting=true&year=${action.payload.year}&month=${action.payload.month}&week=${action.payload.week}`, { headers: { token } })
      else if (action.payload["for-dashboard"]) getData = await API.get(`/tal?for-dashboard=true&year=${action.payload.year}&month=${action.payload.month}&week=${action.payload.week}&user-id=${action.payload.userId}`, { headers: { token } })
      else if (action.payload["for-tal-team"]) getData = await API.get(`/tal?for-tal-team=true&year=${action.payload.year}&month=${action.payload.month}&week=${action.payload.week}&user-id=${action.payload.userId}`, { headers: { token } })
      else getData = await API.get(`/tal?year=${action.payload}`, { headers: { token } })

      next({
        type: 'FETCH_DATA_ALL_TAL_SUCCESS',
        payload: { dataAllTAL: getData.data.data }
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_REWARD_KPIM') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get(`/rewardKPIM?all=true`, { headers: { token } })

      let myRewardKPIM = await getData.data.data.filter(el => el.user_id === action.payload)

      next({
        type: 'FETCH_DATA_REWARD_KPIM_SUCCESS',
        payload: { dataAllRewardKPIM: getData.data.data, myRewardKPIM }
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_POSITION') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get(`/position`, { headers: { token } })

      next({
        type: 'FETCH_DATA_POSITION_SUCCESS',
        payload: { dataPositions: getData.data.data }
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_POLANEWS') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get(`/news`, { headers: { token } })

      next({
        type: 'FETCH_DATA_POLANEWS_SUCCESS',
        payload: { dataPolanews: getData.data.data }
      })

    } catch (err) {
      next({
        type: 'FETCH_DATA_ERROR',
        payload: err
      })
    }
  }
  else if (action.type === 'FETCH_DATA_USER_DETAIL') {
    next({
      type: 'FETCH_DATA_LOADING'
    })

    let getData
    try {
      getData = await API.get(`/users/${action.payload}`, { headers: { token } })

      next({
        type: 'FETCH_DATA_USER_DETAIL_SUCCESS',
        payload: { dataUserDetail: getData.data.data }
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

const compare = (a, b) => {
  if (a.tbl_account_detail.fullname < b.tbl_account_detail.fullname) {
    return -1;
  }
  if (a.tbl_account_detail.fullname > b.tbl_account_detail.fullname) {
    return 1;
  }
  return 0;
}

const store = createStore(reducer, applyMiddleware(api))

export default store
