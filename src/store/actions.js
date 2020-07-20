import request from '@/utils/request';
export default {
  // 首页--banner
  async getBanner({}, params) {
    const {code, obj} = await request.get(`index/banners/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject();
    }
  },
  // 首页--今日操盘牛人
  async getProfit({}, params) {
    const {code, obj} = await request.get(`contract/getProfit/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject();
    }
  },
  // 登录
  async login({commit}, params) {
    commit('showLoading');
    const {code, obj, msg} = await request.post('user/login', params);
    commit('hideLoading');
    if (code === 1) {
      if (obj.mobileAuth === 1 || obj.emailAuth === 1) {
        commit('setVerifyInfo', obj);
      }
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 验证登录
  async loginVerification({commit}, params) {
    commit('showLoading');
    const {code, msg} = await request.post('user/loginVerification', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(msg);
    } else {
      return Promise.reject(msg);
    }
  },
  // 获取验证码
  async sendSMS({commit}, params) {
    commit('showLoading');
    const {code} = await request.post('common/sendVerificationCode', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  },
  // 注册
  async register({commit}, params) {
    commit('showLoading');
    const {code, msg, obj} = await request.post('user/register', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 获取我的资产
  async getAccoutDetails({commit}, params) {
    commit('showLoading');
    const {code, obj} = await request.post('account/details', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject();
    }
  },
  // 获取提币手续费
  async getPoundage({}, params) {
    const {code, obj} = await request.get(`account/getPoundage?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject();
    }
  },
  // 获取用户信息
  async getUserInfo({}, params) {
    const { code, obj } = await request.post('user/userInfo', params);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject();
    }
  },

  // 获取邀请人数
  async getInviteNum({}, params) {
    const { code, obj } = await request.get(`user/inviteNum/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject();
    }
  },

  // 绑定手机号或邮箱
  async bindingNumber({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.post('user/bindingNumber', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 忘记和设置密码
  async resetPassword({commit}, params) {
    commit('showLoading');
    const { code, msg } = await request.post('user/resetPassword', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve();
    } else {
      return Promise.reject(msg);
    }
  },
  async modifyPassword({commit}, params) {
    commit('showLoading');
    const { code, msg } = await request.post('user/modifyPassword', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve();
    } else {
      return Promise.reject(msg);
    }
  },
  // 上传照片
  async uploadImage({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.post('common/uploadImage', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 身份认证
  async auth({commit}, params) {
    commit('showLoading');
    const { code, msg } = await request.post('user/auth', params)
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(msg);
    } else {
      return Promise.reject(msg);
    }
  },
  // 提币
  async withdraw({commit}, params) {
    commit('showLoading');
    const { code, msg } = await request.post('account/withdraw', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve();
    } else {
      return Promise.reject(msg);
    }
  },
  // 获取资产账户记录
  async getTradeRecords({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.get(`account/tradeRecords?${params}`);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 获取资金账户详情
  async getAccount({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.post('account/account', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 流转
  async fundsTransfer({commit}, params) {
    commit('showLoading');
    const { code, msg } = await request.post('account/fundsTransfer', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve();
    } else {
      return Promise.reject(msg);
    }
  },
  // 修改邮箱验证
  async updateEmailAuth({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.post('user/updateEmailAuth', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 修改手机验证
  async updateMobileAuth({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.post('user/updateMobileAuth', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 获取分销奖励
  async getRewardList({}, params) {
    const { code, msg, obj } = await request.get(`contract/getRewardList/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 查询个人奖励
  async getUserReward({}, params) {
    const { code, msg, obj } = await request.get(`contract/getUserReward/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 查询资产
  async getAsset({}, params) {
    const { code, msg, obj } = await request.get(`contract/getAsset?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 查询委托
  async getEntrust({}, params) {
    const { code, msg, obj } = await request.get(`contract/getEntrust?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 止盈止损委托记录
  async getStopList({}, params) {
    const { code, msg, obj } = await request.get(`contract/stopRecord/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 查询所有合约信息
  async getContracts({}) {
    const { code, msg, obj } = await request.get('contract/getContracts');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 提交委托
  async subEntrust({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.post('contract/subEntrust', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 取消委托
  async cancelEntrust({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.post('contract/cancelEntrust', params)
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 提交止盈止损
  async setStop({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.post('contract/setStop', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 查询止盈止损
  async queryStop({}, params) {
    const { code, msg, obj } = await request.get(`contract/queryStop/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 取消止盈止损
  async cancelStop({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.get(`contract/cancelStop/${params}`);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 获取资产记录
  async tradeRecords({}, params) {
    const { code, msg, obj } = await request.get(`account/tradeRecords?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 获取K线图数据
  async kline({}, params) {
    const { code, msg, obj } = await request.post(`btc/kline?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 获取汇率
  async getRate({}) {
    const { code, obj } = await request.post('btc/price');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject();
    }
  },
  // 社区-滚动播放
  async communityRoll({}) {
    const { code, obj } = await request.get('follow/roll');
    if (code === 1) {
      return Promise.resolve(obj)
    } else {
      return Promise.reject();
    }
  },
  // 社区--榜单
  async communityRank({commit}, params) {
    commit('showLoading');
    const { code, obj } = await request.get(`follow/ranking/${params}`);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj)
    } else {
      return Promise.reject();
    }
  },
  // 添加跟单
  async addFollow({commit}, params) {
    commit('showLoading');
    const { code, obj, msg } = await request.post('follow/addFollow', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 修改跟单
  async modifyFollow({commit}, params) {
    commit('showLoading');
    const { code, obj, msg } = await request.post('follow/modifyFollow', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 取消跟随
  async cancelFollow({commit}, params) {
    commit('showLoading');
    const { code, obj, msg } = await request.post('follow/cancelFollow', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 查询此单是否存在
  async queryOnly({}, params) {
    const { code, obj, msg } = await request.get(`follow/queryOnly?${params}`, params);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 跟单管理
  async queryAll({}, params) {
    const { code, obj, msg } = await request.get(`follow/queryAll?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 是否分享活动
  async setLead({commit}, params) {
    commit('showLoading');
    const { code, obj, msg } = await request.post('follow/setLead', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 查询是否开启活动分享
  async queryLead({commit}, params) {
    commit('showLoading');
    const { code, msg, obj } = await request.get(`follow/queryLead/${params}`)
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 带单管理列表
  async leadCount({}, params) {
    const { code, msg, obj } = await request.get(`follow/leadCount?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 个人主页--历史持仓
  async followHistory({}, params) {
    const { code, msg, obj } = await request.get(`follow/history?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 个人主页--跟随者
  async followFollower({}, params) {
    const { code, msg, obj } = await request.get(`follow/follower?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 修改用户信息
  async updateUserInfo({commit}, params) {
    commit('showLoading');
    const { msg, code, obj } = await request.post(`user/updateUserIcon?${params}`);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 币种列表
  async coinTypes({}) {
    const { msg, code, obj } = await request.get('account/coinTypes');
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 获取充币地址
  async depositAddress({}, params) {
    const { msg, code, obj } = await request.post('account/depositAddress', params);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 公告列表
  async getMessageList({}, params) {
    const { obj, code, msg } = await request.get(`index/notice/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },

  // 修改杠杆
  async setLever({}, params) {
    const { obj, code, msg } = await request.post('contract/setLever', params);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },

  // 期权-- 期权列表
  async guessContract({}, params) {
    const { obj, code, msg } = await request.get('guess/getContracts', params);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 期权-- 获取期权记录
  async guessEntrust({}, params) {
    const { obj, code, msg } = await request.get(`guess/queryEntrust?${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 期权 -- 获取期权账户信息
  async guessAccount({}, params) {
    const { obj, code, msg } = await request.get(`guess/getAccount/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  },
  // 期权 -- 提交猜涨跌下单
  async addGuessEntrust({commit}, params) {
    commit('showLoading');
    const { code, msg } = await request.post('guess/addEntrust', params);
    commit('hideLoading');
    if (code === 1) {
      return Promise.resolve(msg);
    } else {
      return Promise.reject(msg);
    }
  },
  // 期权 -- 账户信息
  async guessAccounts({}, params) {
    const { code, msg, obj } = await request.get(`guess/guessAccount/${params}`);
    if (code === 1) {
      return Promise.resolve(obj);
    } else {
      return Promise.reject(msg);
    }
  }
};

