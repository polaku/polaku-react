export function setUser(payload) {
  return {
    type: 'SET_USER',
    payload
  }
}

export function fetchDataUsers() {
  return {
    type: 'FETCH_DATA_USERS'
  }
}

export function fetchDataBuildings() {
  return {
    type: 'FETCH_DATA_BUILDINGS'
  }
}

export function fetchDataRooms() {
  return {
    type: 'FETCH_DATA_ROOMS'
  }
}

export function fetchDataRoomMaster() {  
  return {
    type: 'FETCH_DATA_ROOM_MASTER'
  }
}

export function fetchDataCompanies() {
  return {
    type: 'FETCH_DATA_COMPANIES'
  }
}

export function fetchDataBookingRooms() {
  return {
    type: 'FETCH_DATA_BOOKING_ROOMS'
  }
}

export function fetchDataMyBookingRooms() {
  return {
    type: 'FETCH_DATA_MY_BOOKING_ROOMS'
  }
}

export function fetchDataEvent() {
  return {
    type: 'FETCH_DATA_EVENT'
  }
}

export function fetchDataEventNeedApproval() {
  return {
    type: 'FETCH_DATA_EVENT_NEED_APPROVAL'
  }
}

export function fetchDataCreatorMasterAndAssistant() {
  return {
    type: 'FETCH_DATA_CREATOR_MASTER_AND_ASSISTANT'
  }
}

export function fetchDataDepartment() {
  return {
    type: 'FETCH_DATA_DEPARTMENT'
  }
}

export function fetchDataNotification() {
  return {
    type: 'FETCH_DATA_NOTIFICATION'
  }
}

export function fetchDataContactUs(payload) {
  return {
    type: 'FETCH_DATA_CONTACT_US',
    payload
  }
}

export function fetchDataAllKPIM(payload) {
  return {
    type: 'FETCH_DATA_ALL_KPIM',
    payload
  }
}

export function fetchDataAllTAL(payload) {
  return {
    type: 'FETCH_DATA_ALL_TAL',
    payload
  }
}

export function fetchDataRewardKPIM(payload) {
  return {
    type: 'FETCH_DATA_REWARD_KPIM',
    payload
  }
}

export function fetchDataPosition() {
  return {
    type: 'FETCH_DATA_POSITION'
  }
}

export function fetchDataPolanews() {
  return {
    type: 'FETCH_DATA_POLANEWS'
  }
}

export function fetchDataUserDetail(payload) {
  return {
    type: 'FETCH_DATA_USER_DETAIL',
    payload
  }
}

export function userLogout() {
  return {
    type: 'USER_LOGOUT'
  }
}