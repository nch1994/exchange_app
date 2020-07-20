export default {
  setVerifyInfo(state, payload) {
    state.verifyInfo = payload;
  },
  showLoading(state) {
    state.loading = true
  },
  hideLoading(state) {
    state.loading = false
  },
  pushToken: (state, src) => {
    state.cancelTokenArr.push(src.cancelToken)
  },
  clearToken: ({cancelTokenArr}) => {
    cancelTokenArr.forEach(item => {
      item('interrupt')
    })
    cancelTokenArr = []
  },
  contractList(state, payload) {
    state.contractList = payload
  }
};
