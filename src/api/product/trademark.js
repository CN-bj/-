//引入axios
import request from "@/utils/request";

//请求数据函数 page:代表在分页器的第几页,  limit:代表当前页面展示数据条数
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'GET' });

//添加和修改品牌操作的函数 (添加函数的参数: 品牌名称,品牌LOGO, 修改函数的参数: id,品牌名称,品牌LOGO)
export const reqAddOrUpdateTradeMark = (trademark) => {
    if (trademark.id) {
        //修改函数
        return request({ url: '/admin/product/baseTrademark/update', data: trademark, method: 'PUT' });
    } else {
        //添加函数
        return request({ url: '/admin/product/baseTrademark/save', data: trademark, method: 'POST' });
    }
};

//删除品牌的函数
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'DELETE' });
