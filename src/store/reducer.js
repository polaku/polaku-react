const defaultState = {
  userId: null,
  dataUserDetail: {},
  isAdmin: false,
  isRoomMaster: false,
  isCreatorMaster: false,
  isCreatorAssistant: false,
  adminContactCategori: null,
  sisaCuti: 0,
  evaluator1: null,
  evaluator2: null,
  bawahan: [],
  loading: false,
  error: {},
  isLogin: false,
  dataUsers: [],
  lengthAllDataUsers: 0,
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
  dataAllRewardKPIM: [],
  myRewardKPIM: [],
  dataPositions: [],
  dataPolanews: [],
  dataPIC: [],
  dataAddress: [],
  dataStructure: []
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
        bawahan: action.payload.bawahan,
        adminContactCategori: action.payload.adminContactCategori
      }
    }
    case 'FETCH_DATA_USER_DETAIL_SUCCESS': {
      return {
        ...state,
        dataUserDetail: action.payload.dataUserDetail
      }
    }
    case 'USER_LOGOUT': {
      return {
        userId: null,
        isAdmin: false,
        isRoomMaster: false,
        isCreatorMaster: false,
        isCreatorAssistant: false,
        sisaCuti: 0,
        evaluator1: null,
        evaluator2: null,
        bawahan: [],
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
        dataAllRewardKPIM: [],
        myRewardKPIM: []
      }
    }
    case 'FETCH_DATA_USERS_SUCCESS': {
      return {
        ...state,
        dataUsers: action.payload.dataUsers,
        lengthAllDataUsers: action.payload.lengthAllDataUsers,
        loading: false
      }
    }
    case 'FETCH_DATA_ROOMS_SUCCESS': {
      return {
        ...state,
        dataRooms: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_ROOM_MASTER_SUCCESS': {
      return {
        ...state,
        dataRoomMaster: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_COMPANIES_SUCCESS': {
      return {
        ...state,
        dataCompanies: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_BUILDINGS_SUCCESS': {
      return {
        ...state,
        dataBuildings: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_BOOKING_ROOMS_SUCCESS': {
      return {
        ...state,
        dataBookingRooms: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_MY_BOOKING_ROOMS_SUCCESS': {
      return {
        ...state,
        dataMyBookingRooms: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_EVENT_SUCCESS': {
      return {
        ...state,
        dataEvents: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_EVENT_NEED_APPROVAL_SUCCESS': {
      return {
        ...state,
        dataEventNeedApproval: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_CREATOR_MASTER_AND_ASSISTANT_SUCCESS': {
      return {
        ...state,
        dataCreatorMasterAndAssistant: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_DEPARTMENT_SUCCESS': {
      return {
        ...state,
        dataDepartments: action.payload,
        loading: false
      }
    }
    case 'FETCH_DATA_NOTIFICATION_SUCCESS': {
      return {
        ...state,
        dataNewNotif: action.payload.newNotif,
        dataNotification: action.payload.notif,
        loading: false
      }
    }
    case 'FETCH_DATA_CONTACT_US_SUCCESS': {
      return {
        ...state,
        dataContactUs: action.payload.dataContactUs,
        dataContactUsStaff: action.payload.dataContactUsStaff,
        dataAllContactUs: action.payload.dataAllContactUs,
        loading: false
      }
    }
    case 'FETCH_DATA_ALL_KPIM_SUCCESS': {
      return {
        ...state,
        dataAllKPIM: action.payload.dataAllKPIM,
        loading: false
      }
    }
    case 'FETCH_DATA_ALL_TAL_SUCCESS': {
      return {
        ...state,
        dataAllTAL: action.payload.dataAllTAL,
        loading: false
      }
    }
    case 'FETCH_DATA_REWARD_KPIM_SUCCESS': {
      return {
        ...state,
        dataAllRewardKPIM: action.payload.dataAllRewardKPIM,
        myRewardKPIM: action.payload.myRewardKPIM,
        loading: false
      }
    }
    case 'FETCH_DATA_POSITION_SUCCESS': {
      return {
        ...state,
        dataPositions: action.payload.dataPositions,
        loading: false
      }
    }
    case 'FETCH_DATA_POLANEWS_SUCCESS': {
      return {
        ...state,
        dataPolanews: action.payload.dataPolanews,
        loading: false
      }
    }
    case 'FETCH_DATA_PIC_SUCCESS': {
      return {
        ...state,
        dataPIC: action.payload.dataPIC,
        loading: false
      }
    }
    case 'FETCH_DATA_ADDRESS_SUCCESS': {
      return {
        ...state,
        dataAddress: action.payload.dataAddress,
        loading: false
      }
    }
    case 'FETCH_DATA_STRUCTURE_SUCCESS': {
      return {
        ...state,
        dataStructure: action.payload.dataStructure,
        loading: false
      }
    }
    case 'FETCH_DATA_LOADING_CONTACT_US': {
      return {
        ...state,
        loading: true,
        dataContactUs: [],
        dataContactUsStaff: [],
        dataAllContactUs: []
      }
    }
    case 'FETCH_DATA_LOADING': {
      return {
        ...state,
        loading: true
      }
    }
    case 'FETCH_DATA_ERROR': {
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    }
    default:
      return state
  }
}

export default reducer