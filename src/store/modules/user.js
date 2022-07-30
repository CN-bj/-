import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, anyRoutes, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router/index';

const getDefaultState = () => {
  return {
    token: getToken(),
    //用户名
    name: '',
    //头像
    avatar: '',
    //服务器返回的菜单信息(根据不同用户的身份返回的标记信息)
    routes: [],
    //按钮权限标记
    buttons: [],
    //用户角色信息
    roles: [],
    //对比之后(项目中已有的异步路由,与服务器返回的标记信息进行对比最终需要展示的路由)
    resultAsyncRoutes: [],
    //用户最终需要展示的全部路由
    resultAllRoutes:[],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  //最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //这里只保存了异步路由,用户还需要有常量路由和任意路由
    state.resultAsyncRoutes = asyncRoutes;
    //合并路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    //给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes);
  }
}

//定义一个函数,两个数组进行对比,对比当前用户要显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    //服务器返回的信息有需要的路由信息时
    if (routes.indexOf(item.name) !== -1) {
      //递归,可能有很多层数据
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  })
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    let res = await login({ username: username.trim(), password: password });
    if (res.code === 20000) {
      commit('SET_TOKEN', res.data.token)
      setToken(res.data.token)
      return 'ok';
    } else {
      return Promise.reject(new Error('fail'));
    }
    /* return new Promise((resolve, reject) => {
          login({ username: username.trim(), password: password }).then(response => {
            const { data } = response
            commit('SET_TOKEN', data.token)
            setToken(data.token)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }) */
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response;
        commit('SET_USERINFO', data)
        //对比路由信息
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes));
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

