const defaultState = {
  userId: 913,
  isAdmin: false,
  isRoomMaster: false,
  isCreatorMaster: false,
  isCreatorAssistant: false,
  sisaCuti: 0,
  evaluator1: null,
  evaluator2: null,
  bawahan: null,
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
  dataNewNotif: [],
  dataContactUs: [],
  dataContactUsStaff: [],
  dataAllContactUs: [],
  dataAllKPIM: [],
  dataAllTAL: [],
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
        isCreatorAssistant: action.payload.isCreatorAssistant,
        sisaCuti: action.payload.sisaCuti,
        evaluator1: action.payload.evaluator1,
        evaluator2: action.payload.evaluator2,
        bawahan: action.payload.bawahan
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
    case 'FETCH_DATA_CONTACT_US_SUCCESS': {
      return {
        ...state,
        dataContactUs: action.payload.dataContactUs,
        dataContactUsStaff: action.payload.dataContactUsStaff,
        dataAllContactUs: action.payload.dataAllContactUs
      }
    }
    case 'FETCH_DATA_ALL_KPIM_SUCCESS': {
      return {
        ...state,
        dataAllKPIM: action.payload.dataAllKPIM
      }
    }
    case 'FETCH_DATA_ALL_TAL_SUCCESS': {
      return {
        ...state,
        dataAllTAL: action.payload.dataAllTAL
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