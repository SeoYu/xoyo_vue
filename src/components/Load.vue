<template>
  <div>
    <el-form label-position="right" label-width="250px" style="padding-bottom: 150px;">
      <el-form-item label="号所属区服">
        <el-cascader
          :options="zooms"
          :props="cascaderOption"
          @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="cookie 中的输入ts_session_id_">
        <el-input v-model="ts_session_id" placeholder="输入ts_session_id_"></el-input>
      </el-form-item>
      <el-form-item label="cookie 中的输入xoyokey_">
        <el-input v-model="xoyokey" placeholder="输入xoyokey_"></el-input>
      </el-form-item>
      <el-form-item label="总费用 元">
        <el-input type="number" v-model="total_price" placeholder="账号费用+分离费用"></el-input>
      </el-form-item>
      <el-form-item label="分离费用 元">
        <el-input type="number" v-model="separation_service_fee" placeholder="新账号90 老账号 180"></el-input>
      </el-form-item>
      <el-form-item label="账号 ID">
        <el-input v-model="id" placeholder="输入代抢 id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" :loading="loading" @click="submit">提交</el-button>
        <el-button type="success" @click="stop">停止</el-button>
      </el-form-item>
      <el-form-item label="二维码">
        <iframe :src="qrcode"></iframe>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Load',
    data() {
      return {
        is_request:false,
        count:3,
        ts_session_id: "",
        xoyokey: "",
        id: "620616610738380800",
        total_price: "680",
        separation_service_fee: "180",
        loading: false,
        interval: {},
        zone_id:"z22",
        server_id:"gate2204",
        qrcode:"",
        cascaderOption: {
          value: "zone_id",
          label: "zone_name",
          children: "servers",
        },
        zooms: [
          {
            "zone_id": "z01",
            "zone_name": "电信一区",
            "zone_type": "telecom",
            "servers": [{"zone_id": "gate0126", "zone_name": "蝶恋花"}, {
              "zone_id": "gate0115",
              "zone_name": "龙争虎斗"
            }, {"zone_id": "gate0101", "zone_name": "长安城"}]
          }, {
            "zone_id": "z05",
            "zone_name": "电信五区",
            "zone_type": "telecom",
            "servers": [{"zone_id": "gate0519", "zone_name": "幽月轮"}, {
              "zone_id": "gate0515",
              "zone_name": "斗转星移"
            }, {"zone_id": "gate0524", "zone_name": "剑胆琴心"}, {
              "zone_id": "gate0514",
              "zone_name": "乾坤一掷"
            }, {"zone_id": "gate0505", "zone_name": "唯我独尊"}, {"zone_id": "gate0502", "zone_name": "梦江南"}]
          }, {
            "zone_id": "z08",
            "zone_name": "电信八区",
            "zone_type": "telecom",
            "servers": [{"zone_id": "gate0807", "zone_name": "绝代天骄"}]
          }, {
            "zone_id": "z21",
            "zone_name": "双线一区",
            "zone_type": "netcom",
            "servers": [{"zone_id": "gate2107", "zone_name": "天鹅坪"}, {
              "zone_id": "gate2106",
              "zone_name": "破阵子"
            }]
          }, {
            "zone_id": "z22",
            "zone_name": "双线二区",
            "zone_type": "netcom",
            "servers": [{"zone_id": "gate2204", "zone_name": "飞龙在天"}]
          }, {
            "zone_id": "z24",
            "zone_name": "双线四区",
            "zone_type": "netcom",
            "servers": [{"zone_id": "gate2402", "zone_name": "青梅煮酒"}, {
              "zone_id": "gate2407",
              "zone_name": "凌雪藏锋"
            }, {"zone_id": "gate2409", "zone_name": "风月同天"}, {"zone_id": "gate2410", "zone_name": "江湖故人"}]
          }]
      }
    },
    methods: {
      submit: function () {
        this.loading = true;
        this.interval = setInterval(this.submitForm, 100);
      },
      submitForm: function () {
        if (this.is_request && this.count<=0){
          return;
        }
        this.is_request = true;
        this.count = this.count -1;
        this.$axios({
          method: "POST",
          url: "/submitForm",
          data: {
            ts_session_id: this.ts_session_id,
            xoyokey: this.xoyokey,
            id: this.id,
            total_price: this.total_price*100,
            separation_service_fee: this.separation_service_fee*100,
            zone_id: this.zone_id,
            server_id: this.server_id
          }
        }).then((res) => {
          if (res.data.code != 0) {
            if ('抱歉，请先登录' == res.data.msg) {
              this.stop();
            }
            this.$notify({
              title: '失败',
              message: res.data.msg,
              duration: 1000
            });
          } else {
            window.clearInterval(this.interval);
            this.qrcode = res.data.url;
          }
          this.is_request = false;
          this.count = this.count +1;
        }).catch((res) => {
          this.stop();
          console.info("catch")
          console.info(res)
          this.$notify({
            title: '失败',
            message: res,
            duration: 3000
          });
          this.is_request = false;
          this.count = this.count +1;
        })
      },
      test: function () {
        this.qrcode = "https://openapi.alipay.com/gateway.do?charset=utf-8&method=alipay.trade.page.pay&sign=XCmMnDPejyHLV8yd%2BVAbGlikj2JCAaZOobqUxPmmFRxyNqRhaLhlT60w9lke3KgyF%2B%2BSLeJxMS3BFYI%2BOIsnxmv%2FmuKknVp%2FZzvbAia87ZZcMeS7mxycIdVtp75oG6CBGZFFKTFwxABsKKJYNpBYCwe4vl%2FvORbBittO9xz1x%2FOMjyS9%2BDJ%2F1vFfi%2BXHhhRUMNplM%2F%2BRQOR4L65uh6V%2F42RjIs%2FPOou27GdTD7S04bAHWxNeDs3hFJCWEk5CJz2NR5G%2FckkbyNbZQd6NZ7FYtuk88GKnAsPdTUsJrBYP5ET6pjlkkhx1M0Y%2BTRlb68oM3I2DKSjh8Wqsp0AO7v%2B1xA%3D%3D&notify_url=http%3A%2F%2Fpop.pay.kingsoft.com%2Fapi%2Fchannel%2F25%2Ftrading-mall%2Fpay%2Fcallback&version=1.0&app_id=2018101161626922&sign_type=RSA2&timestamp=2020-09-15+22%3A13%3A47&alipay_sdk=alipay-sdk-java-4.8.62.ALL&format=json&biz_content={%22body%22:%22%E8%A7%92%E8%89%B2%E8%B4%AD%E4%B9%B0%22,%22subject%22:%22%E6%B8%B8%E6%88%8F%E5%85%85%E5%80%BC|%E8%B0%A8%E9%98%B2%E8%AF%88%E9%AA%97|%E8%A5%BF%E5%B1%B1%E5%B1%85%E4%B8%87%E5%AE%9D%E6%A5%BC%22,%22out_trade_no%22:%22250001623159605477199872%22,%22timeout_express%22:%223m%22,%22goods_type%22:%221%22,%22total_amount%22:%22680.00%22,%22qr_pay_mode%22:%224%22,%22qrcode_width%22:110,%22product_code%22:%22FAST_INSTANT_TRADE_PAY%22}";
      },
      stop: function () {
        window.clearInterval(this.interval);
        this.loading = false;
        this.qrcode = "";

      },
      handleChange: function (e) {
        this.zone_id = e[0];
        this.server_id = e[1];
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .block {
    margin-top: 30px;
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .block span{
    width: 100%;
  }
  .block iframe{
    margin-top: 1px;
    height: 150px;
    width: 150px;
  }
</style>
