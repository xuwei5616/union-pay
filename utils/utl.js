"use strict";
/**
 * Created by xuwei on 2020/3/11.
 */

const crypto = require("crypto");

const utl = module.exports = {};
/**
 * 浅拷贝
 * @param obj
 * @returns {{}}
 */
utl.copy = function(obj) {
  var ret = {};
  for (var k in obj) {
    ret[k] = obj[k];
  }
  return ret;
};
/**
 * 对请求参数进行组装、编码
 * @param {Object} params  请求参数
 * @returns {Object}
 */
utl.encodeParams = function(params) {
  const keys = [];
  for (const k in params) {
    const v = params[k];
    if (v !== undefined && v !== "") keys.push(k);
  }
  keys.sort();

  let unencodeStr = "";
  let encodeStr = "";
  const len = keys.length;
  for (let i = 0; i < len; ++i) {
    const k = keys[i];
    if (i !== 0) {
      unencodeStr += "&";
      encodeStr += "&";
    }
    unencodeStr += k + "=" + (typeof params[k] == "object" ? JSON.stringify(params[k]) : params[k]);
    encodeStr += k + "=" + encodeURIComponent(params[k]);
  }
  return { unencode: unencodeStr, encode: encodeStr };
};

/**
 * 对字符串进行签名验证
 * @param {String} str  要验证的参数的字符串
 * @param {String} sign 要验证的签名
 * @param {String} key  商户应用key
 * @param {String} [signType] 签名类型
 * @returns {Boolean}
 */
utl.signVerify = function(str, sign, key, signType) {
  const _sign = utl.sign(str, key, signType);
  return _sign == sign.toLowerCase();
};

/**
 * 对字符串进行签名
 * @param {String} str 要签名的字符串
 * @param {String} key 商户应用key
 * @param {String} [signType] 签名类型
 * @returns {String}
 */
utl.sign = function(str, key, signType) {
  let sha;
  switch (signType) {
    case "MD5":
      sha = crypto.createHash("md5");
      break;
    case "SHA256":
      sha = crypto.createHash("SHA256");
      break;
  }
  sha.update(str + key);
  const sign = sha.digest("hex");
  return sign;
};