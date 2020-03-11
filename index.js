/**
 * Created by xuwei on 2020/3/11.
 * 18766212342@qq.com
 */
"use strict";

const { encodeParams, sign, signVerify, copy } = require("./utils/utl");
const axios = require("axios");
module.exports = unionPay;

/**
 *
 * @param {Object} opts
 * @param {String} opts.gateWay         请求地址
 * @param {String} opts.notifyUrl       银联支付回调通知地址
 * @param {String} opts.returnUrl       银联支付页面回调地址
 * @param {String} opts.key             加密key
 * @param {String} opts.signType        签名算法,值为：MD5或 SHA256；若不上送默认为MD5
 * @param {String} opts.msgSrc          来源系统标识
 * @constructor
 */
function unionPay(opts) {
  this.gateWay = opts.gateWay;
  this.key = opts.key;
  this.msgSrc = opts.msgSrc;
  this.signType = opts.signType || "MD5";
  this.notifyUrl = opts.notifyUrl;
  this.returnUrl = opts.returnUrl;
}

const props = unionPay.prototype;

props.makeParams = function(msgType, biz_content) {
  biz_content.msgType = msgType;
  biz_content.instMid = biz_content.instMid || "QRPAYDEFAULT";
  biz_content.msgSrc = this.msgSrc;
  biz_content.notifyUrl = this.notifyUrl;
  biz_content.signType = this.signType || "MD5";
  biz_content.returnUrl = this.returnUrl;
  const { unencode, encode } = encodeParams(biz_content);
  biz_content.sign = sign(unencode, this.key, this.signType);
  return biz_content;
};
/**
 * 生成支付二维码链接，部分参数说明，全部参数需看银联文档
 * @param {Object} opts
 * @param {String} opts.requestTimestamp     报文请求时间，格式yyyy-MM-dd HH:mm:ss
 * @param {String} opts.mid                  商户号
 * @param {String} opts.tid                  终端号
 * @param {String} opts.expireTime           账单过期时间，为空则不过期，格式yyyy-MM-dd HH:mm:ss，一次性二维码的默认过期时间为30分钟，固定码无期限
 * @param {Number} opts.totalAmount          支付总金额，单位：分
 * @param {String} opts.instMid              业务类型,默认：QRPAYDEFAULT 
 * @param {String} opts.billNo               账单号
 * @param {String} opts.billDate             账单日期，格式yyyy-MM-dd
 * @param {String} opts.sign                 签名
 */
props.makeQRCode = async function(opts) {
  const reqData = this.makeParams("bills.getQRCode", opts);
  const { data } = await axios.post(this.gateWay, reqData);
  data.signVerify = this.signVerify(data, data.sign, this.key, this.signType);
  return data;
};

/**
 * 订单查询接口，部分参数说明，全部参数需看银联文档
 * @param {Object} opts
 * @param {String} opts.requestTimestamp     报文请求时间，格式yyyy-MM-dd HH:mm:ss
 * @param {String} opts.mid                  商户号
 * @param {String} opts.tid                  终端号
 * @param {String} opts.instMid              业务类型,默认：QRPAYDEFAULT 
 * @param {String} opts.billNo               账单号
 * @param {String} opts.merOrderId           银联订单号
 * @param {String} opts.billDate             账单支付日期,格式yyyy-MM-dd
 * @param {String} opts.sign                 签名
 */
props.query = async function(opts) {
  const reqData = this.makeParams("bills.query", opts);
  const { data } = await axios.post(this.gateWay, reqData);
  data.signVerify = this.signVerify(data, data.sign, this.key, this.signType);
  return data;
};
/**
 * 订单退款接口，部分参数说明，分账的订单需根据文档传参，全部参数需看银联文档
 * @param {Object} opts
 * @param {String} opts.requestTimestamp     报文请求时间，格式yyyy-MM-dd HH:mm:ss
 * @param {String} opts.mid                  商户号
 * @param {String} opts.tid                  终端号
 * @param {String} opts.instMid              业务类型,默认：QRPAYDEFAULT 
 * @param {String} opts.billNo               账单号
 * @param {Number} opts.refundAmount         要退款的金额,单位：分
 * @param {String} opts.merOrderId           银联订单号
 * @param {String} opts.billDate             账单支付日期,格式yyyy-MM-dd
 * @param {String} opts.refundDesc           退款说明
 * @param {String} opts.sign                 签名
 */

/**
 * 银联验签
 * @param {Object} data
 * @param {String} opts.sign                 签名
 */
props.signVerify = function(data, sign, key, signType) {
  const reqData = copy(data);
  if (!sign) return false;
  delete reqData.sign;
  const { unencode } = encodeParams(reqData);
  return signVerify(unencode, sign, key, signType);
};
props.refund = async function(opts) {
  const reqData = this.makeParams("bills.refund", opts);
  const { data } = await axios.post(this.gateWay, reqData);
  data.signVerify = this.signVerify(data, data.sign, this.key, this.signType);
  return data;
};

/**
 * 银联统一请求接口，部分参数说明，全部参数需看银联文档
 * @param {Object} opts
 * @param {String} opts.requestTimestamp     报文请求时间，格式yyyy-MM-dd HH:mm:ss
 * @param {String} opts.mid                  商户号
 * @param {String} opts.tid                  终端号
 * @param {String} opts.instMid              业务类型,默认：QRPAYDEFAULT 
 * @param {String} opts.sign                 签名
 */
props.request = async function(opts) {
  const reqData = this.makeParams(opts.msgType, opts);
  const { data } = await axios.post(this.gateWay, reqData);
  data.signVerify = this.signVerify(data, data.sign, this.key, this.signType);
  return data;
};