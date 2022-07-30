import request from '@/utils/request';
/* 1.spu中的sku接口 */
//获取图片的接口
export const reqImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//获取销售属性的接口
export const reqSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });

//获取平台属性的数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

//添加sku的接口
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo });

//查看当前spu的全部sku列表的接口
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' });


/* 2.sku中的sku接口 */
//获取sku模块数据的接口
export const reqList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });

//上架
export const reqOnSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' });

//下架
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });

//获取sku详情的接口
export const reqSkuDetail = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });