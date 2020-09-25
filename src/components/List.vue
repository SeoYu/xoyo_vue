<template>
  <div class="hello">
    <el-form :inline="true" label-width="80px">
      <el-select
        v-model="shopExterior"
        size="medium"
        clearable
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="成衣搜索">
      </el-select>
      <el-select
        v-model="hair"
        size="medium"
        clearable
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="头发搜索">
      </el-select>
      <el-select
        v-model="adventure"
        size="medium"
        clearable
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="奇遇搜索">
      </el-select>
      <el-cascader
        :options="zooms"
        :props="cascaderOption"
        clearable
        @change="handleChange" placeholder="区服"></el-cascader>
      <el-cascader
        :options="sects"
        clearable
        @change="sectsChange" placeholder="门派"></el-cascader>
      <el-cascader
        :options="ships"
        clearable
        @change="shipsChange" placeholder="门派"></el-cascader>
      <br>
      <br>
      <el-form-item>
        <el-input label="价格" placeholder="价格最低" v-model="price_s"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input label="价格" placeholder="价格最高" v-model="price_e"></el-input>
      </el-form-item>
      <el-cascader
        :options="order"
        clearable
        @change="orderChange" placeholder="排序"></el-cascader>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-divider></el-divider>

    <el-table
      height="600"
      border stripe
      :data="list"
      v-loading="loading"
      ref="gridTable"
    >
      <el-table-column
        prop="consignment_id"
        label="万宝楼编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role_experience_point"
        label="资历">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 3"size="medium">公示期</el-tag>
          <el-tag v-if="scope.row.state == 5"size="medium">已开售</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签">
      </el-table-column>
      <el-table-column
        fixed
        prop="info"
        label="信息">
      </el-table-column>
      <el-table-column
        fixed
        prop="role_sect"
        label="门派">
      </el-table-column>
      <el-table-column
        fixed
        prop="role_shape"
        label="体型">
      </el-table-column>
      <el-table-column
        fixed
        prop="followed_num"
        label="关注">
      </el-table-column>
      <el-table-column
        prop="remaining_time"
        label="时间(有误差)"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="single_unit_price"
        label="售价">
      </el-table-column>
      <el-table-column
        prop="hair"
        label="头发"
        width="150"
      >
        <template slot-scope="scope" v-if="null != scope.row.hair">
          <el-tag v-for="(item,index) in scope.row.hair.split('|')" v-if="item != ''" :key="index" size="medium">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="shopExterior"
        label="成衣"
        width="300"
      >
        <template slot-scope="scope" v-if="null != scope.row.shopExterior">
          <el-tag v-for="(item,index) in scope.row.shopExterior.split('|')" v-if="item != ''" :key="index" size="medium">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="backCloak"
        label="披风"
        width="250"
      >
        <template slot-scope="scope" v-if="null != scope.row.backCloak">
          <el-tag v-for="(item,index) in scope.row.backCloak.split('|')" v-if="item != ''" :key="index" size="medium">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="horse"
        label="坐骑"
        width="150"
      >
        <template slot-scope="scope" v-if="null != scope.row.horse">
          <el-tag v-for="(item,index) in scope.row.horse.split('|')" v-if="item != ''" :key="index" size="medium">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="pet"
        label="挂宠"
        width="150"
      >
        <template slot-scope="scope" v-if="null != scope.row.pet">
          <el-tag v-for="(item,index) in scope.row.pet.split('|')" v-if="item != ''" :key="index" size="medium">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="adventure"
        label="奇遇"
        width="250"
      >
        <template slot-scope="scope" v-if="null != scope.row.adventure">
          <el-tag v-for="(item,index) in scope.row.adventure.split('|')" v-if="item != ''" :key="index" size="medium">{{ item }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="count"
        :current-page="page"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      page: 1,
      offset:0,
      pageSize:10,
      count:0,
      list:[],
      shopExterior: "",
      hair:"",
      adventure:"",
      server_id:"",
      zone_id:"",
      price_s:"",
      price_e:"",
      role_sect:"",
      role_shape:"",
      sort:"followed_num",
      sortType:"DESC",
      loading:false,
      cascaderOption: {
        value: "zone_id",
        label: "zone_name",
        children: "servers",
      },
      sects: [
        {
          label:"凌雪阁",
          value:"凌雪阁"
        },
        {
          label:"蓬莱",
          value:"蓬莱",
        },
        {
          label:"霸刀",
          value:"霸刀",
        },
        {
          label:"长歌",
          value:"长歌",
        },
        {
          label:"苍云",
          value:"苍云",
        },
        {
          label:"丐帮",
          value:"丐帮",
        },
        {
          label:"明教",
          value:"明教",
        },
        {
          label:"唐门",
          value:"唐门",
        },
        {
          label:"五毒",
          value:"五毒",
        },
        {
          label:"藏剑",
          value:"藏剑",
        },
        {
          label:"天策",
          value:"天策",
        },
        {
          label:"纯阳",
          value:"纯阳",
        },
        {
          label:"少林",
          value:"少林",
        },
        {
          label:"七秀",
          value:"七秀",
        },
        {
          label:"万花",
          value:"万花",
        },
        {
          label:"大侠",
          value:"大侠",
        },
      ],
      ships: [
        {
          label:"全部",
          value:"",
        },
        {
          label:"成男",
          value:"成男",
        },
        {
          label:"成女",
          value:"成女",
        },
        {
          label:"萝莉",
          value:"萝莉",
        },
        {
          label:"正太",
          value:"正太",
        }
      ],
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
        }],
      order: [
        {
          label:"关注",
          value:"followed_num",
          children: [
            {
              label:"升序",
              value:"ASC",
            },
            {
              label:"降序",
              value:"DESC",
            }
          ]
        },
        {
          label:"价格",
          value:"single_unit_price",
          children: [
            {
              label:"升序",
              value:"ASC",
            },
            {
              label:"降序",
              value:"DESC",
            }
          ]
        },
        // {
        //   label:"时间",
        //   value:"remaining_time",
        //   children: [
        //     {
        //       label:"升序",
        //       value:"ASC",
        //     },
        //     {
        //       label:"降序",
        //       value:"DESC",
        //     }
        //   ]
        // },
      ]
    }
  },
  methods:{
    onSubmit:function () {
      this.page = 1;
      this.offset = 0;
      this.init();
    },
    init:function () {
      this.loading = true;
      this.$axios({
        method: "POST",
        url: "/xoyo/goods/list",
        data: {
          sort: this.sort,
          sortType: this.sortType,
          offset: this.offset,
          pageSize: this.pageSize,
          hairs: this.hair,
          shopExteriors: this.shopExterior,
          adventures: this.adventure,
          zone_id: this.zone_id,
          server_id: this.server_id,
          role_sect: this.role_sect,
          role_shape: this.role_shape,
          price_s: this.price_s*100,
          price_e: this.price_e*100
        }
      }).then(res=>{
        this.list = res.data.data.list
        this.count = res.data.data.count
        this.loading = false;
      }).catch(e=>{
        console.info(e)
        this.$notify({
          title: '失败',
          message: e,
          duration: 1000
        });
        this.loading = false;
      })
    },
    handleChange: function (e) {
      this.zone_id = e[0];
      this.server_id = e[1];
    },
    sectsChange: function (e) {
      this.role_sect = e[0];
    },
    shipsChange: function (e) {
      this.role_shape = e[0];
    },
    orderChange: function (e) {
      this.sort = e[0];
      this.sortType = e[1];
    },
    pageChange: function(e){
      this.page = e;
      this.offset = (e-1)*this.pageSize;
      this.init();
      this.$nextTick(() => {
        this.$refs.gridTable.bodyWrapper.scrollTop = 0;
      });
    },
    test:function (e) {

      // this.searchArray[key].push()
    }
  },
  mounted() {
    this.init();
  },
  created() {
    // this.init();
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
.hello{
  height: 100%;
}
</style>
