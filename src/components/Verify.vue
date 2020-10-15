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
      <el-form-item label="短信验证码">
        <el-input v-model="verify_code" placeholder="输入短信验证码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" :loading="loading" @click="submit">提交</el-button>
        <el-button type="success" @click="stop">停止</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Verify',
    data() {
      return {
        is_request:false,
        count:10,
        ts_session_id: "",
        xoyokey: "",
        id: "620616610738380800",
        total_price: "680",
        separation_service_fee: "180",
        verify_code:"",
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
          url: "/submitVerifyForm",
          data: {
            ts_session_id: this.ts_session_id,
            xoyokey: this.xoyokey,
            id: this.id,
            total_price: this.total_price*100,
            separation_service_fee: this.separation_service_fee*100,
            zone_id: this.zone_id,
            server_id: this.server_id,
            verify_code: this.verify_code
          }
        }).then((res) => {
          if (res.data.code != 0) {
            console.info(res.data.msg);
            if ('抱歉，请先登录' == res.data.msg) {
              this.stop();
              this.$notify({
                title: '失败',
                message: res.data.msg,
                duration: 10000
              });
            }else if ('订单创建处理中，请稍等片刻' != res.data.msg && '该商品已下架或者不存在' != res.data.msg) {
              this.stop();
              this.$notify({
                title: '失败',
                message: res.data.msg,
                duration: 10000
              });
            }else{
              this.$notify({
                title: '失败',
                message: res.data.msg,
                duration: 1000
              });
            }
          } else {
            window.clearInterval(this.interval);
            this.stop();
            this.$notify({
              title: '成功',
              message: res.data.msg,
              duration: 10000
            });
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
      stop: function () {
        window.clearInterval(this.interval);
        this.loading = false;
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
