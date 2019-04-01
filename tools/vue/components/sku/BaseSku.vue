<template>
    <!--<div v-transfer-dom>-->
        <!--<popup v-model="curValue" class="customer">-->
            <div class="popup-mask" v-show="curValue" @click.self="curValue = false">
                <div class="popup0">
                    <div class="goods">
                        <div class="thumbnail-box">
                          <img v-lazy="selectedVal.image || goodsData.coverImage" @click="$emit('thumbnailClick')" class="thumbnail">
                        </div>
                        <div class="goods-info">
                            <p class="goods-info-title row-2-ellipsis">{{`${goodsData.name}${selectedVal.skus || ''}`}}</p>
                            <p class="goods-info-price">{{selectedVal.sellPrice | price}}</p>
                            <p class="goods-info-tips">库存剩余：{{selectedVal.stock || 0}}</p>
                        </div>
                        <i class="icon-close"></i>
                    </div>
                    <div class="scroll-wrapper">
                        <div class="sku">
                            <div class="sku-box" v-for="(item1, index1) in keysObj" :key="index1">
                                <p class="sku-title">{{index1}}</p>
                                <div class="check-box">
                                    <span class="sku-item" :class="{'selected':item2.selected, 'disabled': item2.disabled }" @click="selectedHandler(index1,index2)" v-for="(item2, index2) in item1" :key="index2">
                                        {{ item2.key }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="count">
                            <p class="count-title">数量</p>
                            <input-number v-model="count" :minValue="selectedVal.stock*1 > 0 ? 1 : 0" :maxValue="selectedVal.stock*1 > 0 ? selectedVal.stock*1 : 0"></input-number>
                        </div>
                        <slot></slot>
                    </div>
                    <div class="btn-wrapper" @click="submit">
                        <button type="button">{{btnText}}</button>
                    </div>
                </div>
            </div>
        <!--</popup>-->
    <!--</div>-->
</template>
<script type = 'text/javascript'>
import InputNumber from '@/components/input/InputNumber';
export default {
    props: {
        btnText: {
            type: String,
            default: '提交'
        },
        goodsData: {
            type: Object,
            require: true
        },
        skuArr: {
            type: Array,
            require: true
        },
        value: {
            type: Boolean,
            require: true
        }
    },
    components: {
      InputNumber
    },
    computed: {
        pathStr() {
            return this.path.join(';');
        },
        selectedVal() {
            const skus = this.skuArr;
            if (skus.length === 1 && (!skus.skusArray)) {//默认没有sku的商品（但是后台会返回一条没有skusArray字段的sku对象）
                return skus[0]
            }
            return this.avalibleObj[this.pathStr] || {};
        },
        selectedPrice() {
            if (!this.pathStr) return this.goodsData.sellPrice * 1
            let prices = this.SKUResult[this.pathStr].prices;

            let maxPrice = Math.max.apply(Math, prices);
            let minPrice = Math.min.apply(Math, prices);
            return (maxPrice > minPrice ? `${minPrice} - ${maxPrice}` : maxPrice);
        }
    },
    
    data() {
        return {
            keysObj: {},
            avalibleObj: {},
            SKUResult: {},
            path: [],
            curValue: this.value,
            count: 0
        }
    },
    methods: {
        start() {
            const skus = this.skuArr;
            if (skus.length === 1 && !skus[0].skusArray) {//默认没有sku的商品（但是后台会返回一条没有skusArray字段的sku对象）
                console.log('当前商品没有配置sku')
                return this.count = 1;
            }
            this.formatSkus();
            this.initSKU();
            this.setDefault();
        },
        submit() {
            this.$emit('submit', { ...this.selectedVal, num: this.count })
        },
        formatSkus() {//格式化
            let keysObj = {};//
            let avalibleObj = {};
            let hash1 = {};//存储sku标题重复
            let hash2 = {};//存储sku是否重复
            this.skuArr.forEach((item1, index1) => {
                let keys = [];//存在的项
                item1.skusArray.forEach((item2, index2) => {
                    // let id = item2.propertySetValue;
                    // let key = item2.propertyKey;
                    // let val = item2.propertySetKey;
                    let id = item2.propertyValue;
                    let key = item2.propertySetKey;
                    let val = item2.propertyKey;
                    keys.push(id)
                    if (!hash2[val]) {
                        hash2[val] = true;
                        let pushObj = {
                            id: id,
                            key: val,
                            selected: false,
                            disabled: false
                        }
                        if (!hash1[key]) {
                            // pushObj.selected = true;
                            keysObj[key] = []
                            hash1[key] = true;
                        } 
                        keysObj[key].push(pushObj)
                    }

                })

                keys.sort((value1, value2) => parseInt(value1) - parseInt(value2));
                avalibleObj[keys.join(';')] = {
                    ...item1
                }
            });
            this.avalibleObj = { ...avalibleObj }
            this.keysObj = { ...keysObj }
        },
        selectedHandler(key, index) {//点击回调
            let newObj = { ...this.keysObj };
            let path = [];
            let curId = newObj[key][index].id;//当前点击项的id
            if (newObj[key][index].disabled) return
            //选中自己，兄弟节点取消选中
            // newObj[key][index].selected = !newObj[key][index].selected;
            newObj[key][index].selected = true;
            newObj[key].forEach(item => {
                if (item.id !== curId) {
                    item.selected = false
                }
            })
            //已经选中的项
            for (let item1 in newObj) {
                for (let item2 of newObj[item1]) {
                    if (item2.selected) path.push(item2.id)
                }
            }
            path.sort((value1, value2) => parseInt(value1) - parseInt(value2));
            let len = path.length;

            if (path.length) {
                //用已选中的节点验证待测试节点 underTestObjs
                let arr = [];
                for (let item1 in newObj) {

                    newObj[item1].map(item2 => {
                        if (!item2.selected && item2.id !== curId) {
                            let testAttrIds = [];//从选中节点中去掉选中的兄弟节点
                            let curId2 = item2.id;
                            let brotherSelectedId = '';//获取选中状态兄弟元素的id

                            newObj[item1].map(item => {
                                if (item.id !== curId2 && item.selected) {//获取遍历到当前的兄弟元素
                                    brotherSelectedId = item.id;
                                }
                            })
                            if (brotherSelectedId) {
                                for (let i = 0; i < len; i++) {
                                    (path[i] != brotherSelectedId) && testAttrIds.push(path[i]);
                                }
                            } else {
                                testAttrIds = path.concat();
                            }
                            testAttrIds = testAttrIds.concat(curId2);
                            testAttrIds.sort(function (value1, value2) {
                                return parseInt(value1) - parseInt(value2);
                            });
                            const curSkuResult = this.SKUResult[testAttrIds.join(';')]
                            if (!curSkuResult || curSkuResult.stock < 1) {
                                item2.disabled = true;
                                item2.selected = false;
                            } else {
                                item2.disabled = false;
                            }
                        }
                    })
                }

            } else {
                //设置属性状态
                for (let item1 in newObj) {
                    newObj[item1].map(item2 => {
                        if (this.SKUResult[item2.id]) {
                            item2.disabled = false
                        } else {
                            item2.disabled = true
                        }
                    })
                }
            }
            this.keysObj = { ...newObj };
            this.path = [...path];

        },
        //初始化得到结果集
        initSKU() {
            let avalibleObj = { ...this.avalibleObj }
            let i, j, skuKeys = this.getObjKeys(avalibleObj);

            for (i = 0; i < skuKeys.length; i++) {
                let skuKey = skuKeys[i];//一条SKU信息key
                let sku = avalibleObj[skuKey];	//一条SKU信息value
                let skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组
                let len = skuKeyAttrs.length;


                //对每个SKU信息key属性值进行拆分组合
                let combArr = this.arrayCombine(skuKeyAttrs);
                for (j = 0; j < combArr.length; j++) {
                    this.add2SKUResult(combArr[j], sku);
                }
                //结果集接放入SKUResult
                this.SKUResult = {
                    ...this.SKUResult,
                    [skuKey]: {
                        stock: sku.stock,
                        prices: [sku.price]
                    }
                }
            }
            //过滤不可选的（包括库存不足的）
            let newKeysObj = { ...this.keysObj };
            for (let item in newKeysObj) {
                newKeysObj[item].map(item2 => (this.SKUResult[item2.id] && (this.SKUResult[item2.id].stock > 0)) ? item2.disabled = false : item2.disabled = true)
            }
            this.keysObj = { ...newKeysObj };

        },
        //获得对象的key
        getObjKeys(obj) {
            if (obj !== Object(obj)) throw new TypeError('Invalid object');
            let keys = [];
            for (let key in obj)
                if (Object.prototype.hasOwnProperty.call(obj, key))
                    keys[keys.length] = key;
            return keys;
        },
        //把组合的key放入结果集SKUResult
        add2SKUResult(combArrItem, sku) {
            let key = combArrItem.join(";");
            let newSKUResult = { ...this.SKUResult }
            if (newSKUResult[key]) {//SKU信息key属性·
                newSKUResult[key].stock += sku.stock;
                newSKUResult[key].prices.push(sku.price);
            } else {
                newSKUResult[key] = {
                    stock: sku.stock,
                    prices: [sku.price]
                };
            }
            this.SKUResult = { ...newSKUResult };
        },

        /**
         * 从数组中生成指定长度的组合
         */
        arrayCombine(targetArr) {
            if (!targetArr || !targetArr.length) {
                return [];
            }

            let len = targetArr.length;
            let resultArrs = [];

            // 所有组合
            for (let n = 1; n < len; n++) {
                let flagArrs = this.getFlagArrs(len, n);
                while (flagArrs.length) {
                    let flagArr = flagArrs.shift();
                    let combArr = [];
                    for (let i = 0; i < len; i++) {
                        flagArr[i] && combArr.push(targetArr[i]);
                    }
                    resultArrs.push(combArr);
                }
            }
            return resultArrs;
        },

        /**
         * 获得从m中取n的所有组合
         */
        getFlagArrs(m, n) {
            if (!n || n < 1) {
                return [];
            }

            let resultArrs = [],
                flagArr = [],
                isEnd = false,
                i, j, leftCnt;

            for (i = 0; i < m; i++) {
                flagArr[i] = i < n ? 1 : 0;
            }

            resultArrs.push(flagArr.concat());

            while (!isEnd) {
                leftCnt = 0;
                for (i = 0; i < m - 1; i++) {
                    if (flagArr[i] == 1 && flagArr[i + 1] == 0) {
                        for (j = 0; j < i; j++) {
                            flagArr[j] = j < leftCnt ? 1 : 0;
                        }
                        flagArr[i] = 0;
                        flagArr[i + 1] = 1;
                        let aTmp = flagArr.concat();
                        resultArrs.push(aTmp);
                        if (aTmp.slice(-n).join("").indexOf('0') == -1) {
                            isEnd = true;
                        }
                        break;
                    }
                    flagArr[i] == 1 && leftCnt++;
                }
            }
            return resultArrs;
        },
        setDefault(){//设置默认选项
            const _this = this;
            
            let newObj = {...this.keysObj};
            Object.keys(newObj).forEach(function(item, index) {
                let item2 = newObj[item]
                for (let index2 = 0, len = item2.length; index2 < len; index2++) {
                    if(!item2[index2].disabled){
                        _this.count = 1;
                        return _this.selectedHandler(item, index2) 
                    }
                }
            });
        }

    },
    created() {
        this.start()
        
    },
    watch: {
        skuArr(val) {
            if (!val.length) return console.error('SKU不能为空')
            this.start()
        },
        value(val) {
            this.curValue = val;
        },
        curValue(val) {
            this.$emit('input', val)
        },
        selectedVal(val) {
            this.$emit('change', { ...this.selectedVal, num: this.count })
        }
    }
}
</script>
<style lang = 'less' scoped>
@desktopGutter: 0.3rem;
@borderColor: #ccc;
@darkerAccentColor: #ddd;
@accentColor: red;
.popup-mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0,0,0,0.6);
    .popup0{
        position: absolute;;
        bottom: 0;
        width: 100%;
        background: #fff;
    }
}
.customer {
    overflow-y: initial;
}
.title{
    height: 0.86rem;
}
.goods {
    display: flex;
    padding: 0.2rem @desktopGutter;
    border-bottom: 0.01rem solid @borderColor;
    .thumbnail-box {
        margin-top: -1rem;
        width: 2.2rem;
        height: 2.2rem;
        margin-right: 0.3rem;
        background: #fff;
        border: 0.01rem solid #ddd;
        border-radius: 0.1rem;
        overflow: hidden;
        .thumbnail {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .goods-info {
        flex: 1;
        .goods-info-title {
            font-size: 0.3rem;
            line-height: 0.36rem;
            color: #353535;
        }
        .goods-info-price {
            font-size: 0.36rem;
            color: @darkerAccentColor;
        }
        .goods-info-tips {
            line-height: 0.36rem;
            font-size: 0.24rem;
            color: #666666;
        }
    }
}
.scroll-wrapper{
    max-height: 6.48rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.count {
    padding: 0.2rem 0.24rem 0.1rem;
    .count-title {
        margin-bottom: 0.2rem;
        font-size: 0.24rem;
        color: #333333;
    }
}

.sku {
    .sku-box {
        padding: 0.2rem 0.12rem 0.2rem;
        .sku-title {
            padding: 0 0.12rem;
            font-size: 0.24rem;
            color: #333333;
        }
        .sku-item {
            display: inline-block;
            height: 0.54rem;
            margin: 0.16rem 0.12rem 0;
            padding: 0.1rem 0.3rem;
            text-align: center;
            font-size: 12px;
            color: #353535;
            border-radius: 0.04rem;
            border: 1px solid #666666;
            &.selected {
                background: #FFFFFF;
                border: 1px solid @accentColor;
                color: @accentColor;
            }
            &.disabled {
                /*border: 1px solid @theme;*/
                color: #bdbdbd;
            }
        }
    }
}

.btn-wrapper {
    width: 100%;
    height: 0.98rem;
    margin-top: 0.3rem;
    button {
        width: 100%;
        background: @accentColor;
        line-height: 0.98rem;
        text-align: center;
        font-size: 0.3rem;
        border: none;
    }
}
</style>