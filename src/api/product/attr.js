import request from '@/utils/request';

//平台管理模块的一级分类
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' });

//平台管理模块的二级分类
export const reqCategory2List = (category1id) => request({ url: `/admin/product/getCategory2/${category1id}`, method: 'get' });

//平台管理模块的三级分类
export const reqCategory3List = (category2id) => request({ url: `/admin/product/getCategory2/${category2id}`, method: 'get' });

//获取平台属性的接口
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: "get" });

//添加属性与属性值接口
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', data, method: 'post' });