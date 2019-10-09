const defaultState = {
  userId: null,
  isAdmin: false,
  isRoomMaster: false,
  isCreatorMaster: false,
  isCreatorAssistant: false,
  loading: false,
  error: {},
  isLogin: false,
  dataUsers: [],
  dataRooms: [],
  dataRoomMaster: [],
  dataCompanies: [],
  dataDepartments: [],
  dataBuildings: [],
  dataBookingRooms: [],
  dataMyBookingRooms: [],
  dataEvents: [],
  dataEventNeedApproval: [],
  dataCreatorMasterAndAssistant: [],
  dataNotification: [],
  dataNewNotif: []
}

function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_USER': {
      return {
        ...state,
        userId: action.payload.user_id,
        isAdmin: action.payload.isAdmin,
        isRoomMaster: action.payload.isRoomMaster,
        isCreatorMaster: action.payload.isCreatorMaster,
        isCreatorAssistant: action.payload.isCreatorAssistant
      }
    }
    case 'FETCH_DATA_USERS_SUCCESS': {
      return {
        ...state,
        dataUsers: action.payload
      }
    }
    case 'FETCH_DATA_ROOMS_SUCCESS': {
      return {
        ...state,
        dataRooms: action.payload
      }
    }
    case 'FETCH_DATA_ROOM_MASTER_SUCCESS': {
      return {
        ...state,
        dataRoomMaster: action.payload
      }
    }
    case 'FETCH_DATA_COMPANIES_SUCCESS': {
      return {
        ...state,
        dataCompanies: action.payload
      }
    }
    case 'FETCH_DATA_BUILDINGS_SUCCESS': {
      return {
        ...state,
        dataBuildings: action.payload
      }
    }
    case 'FETCH_DATA_BOOKING_ROOMS_SUCCESS': {
      return {
        ...state,
        dataBookingRooms: action.payload
      }
    }
    case 'FETCH_DATA_MY_BOOKING_ROOMS_SUCCESS': {
      return {
        ...state,
        dataMyBookingRooms: action.payload
      }
    }
    case 'FETCH_DATA_EVENT_SUCCESS': {
      return {
        ...state,
        dataEvents: action.payload
      }
    }
    case 'FETCH_DATA_EVENT_NEED_APPROVAL_SUCCESS': {
      return {
        ...state,
        dataEventNeedApproval: action.payload
      }
    }
    case 'FETCH_DATA_CREATOR_MASTER_AND_ASSISTANT_SUCCESS': {
      return {
        ...state,
        dataCreatorMasterAndAssistant: action.payload
      }
    }
    case 'FETCH_DATA_DEPARTMENT_SUCCESS': {
      return {
        ...state,
        dataDepartments: action.payload
      }
    }
    case 'FETCH_DATA_NOTIFICATION_SUCCESS': {
      return {
        ...state,
        dataNewNotif: action.payload.newNotif,
        dataNotification: action.payload.notif
      }
    }
    case 'FETCH_DATA_ERROR': {
      return {
        ...state,
        error: action.payload
      }
    }
    default:
      return state
  }
}

export default reducer