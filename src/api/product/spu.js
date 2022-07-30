import request from '@/utils/request';

//获取 Spu 列表数据的接口。
export const reqSpuList = (page, limit, Category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { Category3Id } });

//获取 Spu 信息
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });

//获取品牌的信息
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' });

//获取 Spu 图片的接口
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//获取 Spu 销售属性的接口
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' });

//修改和添加 spu 的接口参数是大致一样的,区别就是是否需要携带 id
export const reqAddOrUpdateSpu = (spuInfo) => {
   //修改
   if (spuInfo.id) {
      return request({ url: '/admin/product/updateSpuInfo', data: spuInfo, method: 'post' });
      //添加
   } else {
      return request({ url: '/admin/product/saveSpuInfo', data: spuInfo, method: 'post' });
   }
}

//删除spu的接口
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });
