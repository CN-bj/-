import mockRequest from '@/utils/mockRequest';
const state = {
    list:{},
};
const actions = {
    //发送请求获取首页的模拟数据
    async getData({ commit }) {
        let res = await mockRequest.get('/home/list');
        if (res.code === 20000) {
            commit('GETDATA',res.data);
        }
    }
};
const mutations = {
    GETDATA(state,data){
        state.list = data;
    }
};
const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
}