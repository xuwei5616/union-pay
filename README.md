
Install with:

    npm install -s @xuwei4516/union-pay

## Usage Example

```js
const UnionPay = require("@xuwei4516/union-pay"),


const moment = require("moment");

//初始化实例

const unionPay = new UnionPay({
  gateWay: "",
  key: "",
  msgSrc: "",
  returnUrl: "",
  notifyUrl:",
  signType: ""
});


//获取二维码链接

const data = await unionPay.makeQRCode({
    mid: "", // 商户号
    tid: "", // 终端号
    requestTimestamp: moment().format("YYYY-MM-DD HH:MM:ss"),
    totalAmount: 1,
    billNo: "3020202003111",
    billDate: moment().format("YYYY-MM-DD")
  });

//查询订单

const data = await unionPay.query({
    mid: "", // 商户号
    tid: "", // 终端号
    requestTimestamp: moment().format("YYYY-MM-DD HH:MM:ss"),
    billNo: "3020202003111",
    billDate: moment().format("YYYY-MM-DD")
  });


//订单退款

const data = await unionPay.refund({
    mid: "", // 商户号
    tid: "", // 终端号
    requestTimestamp: moment().format("YYYY-MM-DD HH:MM:ss"),
    refundAmount: 1,
    billNo: "",
    billDate: moment().format("YYYY-MM-DD") //订单支付日期
  });

//统一请求方法,设置msgType的值请求相关的接口，包含所有请求功能，msgType的值根据文档填写

const data = await unionPay.request({
    mid: "", // 商户号
    tid: "", // 终端号
    requestTimestamp: moment().format("YYYY-MM-DD HH:MM:ss"),
    refundAmount: 1,
    msgType: "",
    billNo: "",
    billDate: moment().format("YYYY-MM-DD") //订单支付日期
  });


//银联返回验签，支付回调通知可通过本方法验签。其他请求自动验签并返回结果。

const data = unionPay.signVerify(data, sign, key, signType);