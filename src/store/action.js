export function fetchDataUsers(payload) {
  return {
    type: 'FETCH_DATA_USERS'
  }
}

export function fetchDataBuildings(payload) {
  return {
    type: 'FETCH_DATA_BUILDINGS'
  }
}

export function fetchDataRooms(payload) {
  return {
    type: 'FETCH_DATA_ROOMS'
  }
}

export function fetchDataRoomMaster(payload) {  
  return {
    type: 'FETCH_DATA_ROOM_MASTER'
  }
}

export function fetchDataCompanies(payload) {
  return {
    type: 'FETCH_DATA_COMPANIES'
  }
}

export function setUser(payload) {
  return {
    type: 'SET_USER',
    payload
  }
}

export function fetchDataBookingRooms(payload) {
  return {
    type: 'FETCH_DATA_BOOKING_ROOMS'
  }
}

export function fetchDataMyBookingRooms(payload) {
  return {
    type: 'FETCH_DATA_MY_BOOKING_ROOMS'
  }
}

export function fetchDataEvent(payload) {
  return {
    type: 'FETCH_DATA_EVENT'
  }
}

export function fetchDataEventNeedApproval(payload) {
  return {
    type: 'FETCH_DATA_EVENT_NEED_APPROVAL'
  }
}

export function fetchDataCreatorMasterAndAssistant(payload) {
  return {
    type: 'FETCH_DATA_CREATOR_MASTER_AND_ASSISTANT'
  }
}

export function fetchDataDepartment(payload) {
  return {
    type: 'FETCH_DATA_DEPARTMENT'
  }
}