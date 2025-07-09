export default function userReducer(state, action) {
  switch (action.type) {
    case "UPDATE_IS_LOADING":
      return { ...state, isLoading: !state.isLoading };
    case "SET_PROFILE":
      // console.log("I am payload", action.payload);
      return { ...state, profileData: action.payload };
    case "SET_SHOW_UPDATE_COMPONENT":
      switch (action.payload) {
        // User and Profile update
        // email, profile, user,username, avatar, password
        case "email":
          return {
            ...state,
            showUpdateComponent: !state.showUpdateComponent,
            dataUpdate: {
              email: state.profileData.email,
              type: action.payload,
            },
          };
        case "username":
          return {
            ...state,
            showUpdateComponent: !state.showUpdateComponent,
            dataUpdate: {
              username: state.profileData.username,
              type: action.payload,
            },
          };
        case "user":
          return {
            ...state,
            showUpdateComponent: !state.showUpdateComponent,
            dataUpdate: { ...state.profileData.user, type: action.payload },
          };
        case "profile":
          return {
            ...state,
            showUpdateComponent: !state.showUpdateComponent,
            dataUpdate: { ...state.profileData.profile, type: action.payload },
          };
        case "password":
          return {
            ...state,
            showUpdateComponent: !state.showUpdateComponent,
            dataUpdate: {
              old_password: "",
              new_password: "",
              type: action.payload,
            },
          };
        case "avatar":
          return {
            ...state,
            type: action.payload,
            showUpdateComponent: !state.showUpdateComponent,
          };
        default:
          return { ...state, showUpdateComponent: !state.showUpdateComponent };
      }

    case "UPDATE_PROFILE_DATA":
      const { name, value } = action.payload;
      return { ...state, dataUpdate: { ...state.dataUpdate, [name]: value } };
    default:
      return state;
  }
}
