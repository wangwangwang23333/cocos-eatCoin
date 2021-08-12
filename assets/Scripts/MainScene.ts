// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    coin:cc.Prefab=null;

    //地图大小
    mapSize:cc.Size=null;

    @property(cc.ProgressBar)
    progressBar:cc.ProgressBar=null;

    //通关音乐
    @property(cc.AudioClip)
    sceneWin:cc.AudioClip=null;

    //当前硬币数
    curCoin:number=0;

    //硬币下落状态
    coinDrop:boolean=true;

    //目标硬币数
    @property
    targetCoin:number=10;

    /*场景*/
    @property(cc.SpriteFrame)
    jinZhaiPic:cc.SpriteFrame=null;

    @property(cc.SpriteFrame)
    meiShanPic:cc.SpriteFrame=null;

    @property(cc.SpriteFrame)
    guangChangPic:cc.SpriteFrame=null;

    @property(cc.SpriteFrame)
    tianTangZhaiPic:cc.SpriteFrame=null;

    onLoad () {
        cc.director.getPhysicsManager().enabled=true;
        //cc.director.getPhysicsManager().debugDrawFlags = 1;
        //播放音乐

        //添加硬币监听事件
        let that=this;
        this.node.on('getCoin',function(event){
            that.curCoin+=1;
            that.progressBar.progress=that.curCoin/that.targetCoin;
            
            //判断是否通关
            if(that.curCoin==that.targetCoin){
                that.scenePassed();
            }
        });

        // 改变进度条初始长度
        this.progressBar.totalLength = this.progressBar.node.width;
    }

    start () {

        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            let pos=event.getLocation().x-this.mapSize.width/2;
            this.node.getChildByName("Hero").getComponent('Controller').dealPos(pos)
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, (event)=>{
            this.node.getChildByName("Hero").getComponent('Controller').endClick()
        }, this);

        this.mapSize=cc.view.getVisibleSize();
        this.schedule(this.createCoint,1);
    }

    // update (dt) {}

    //动态创建硬币
    createCoint(){
        if(!this.coinDrop)
            return;
        
        //一次下落1-4个硬币
        let number=Math.round(1+3*Math.random());
        for(let i=0;i<number;++i){
            //创建硬币
            var newCoin=cc.instantiate(this.coin);
            //随机位置
            newCoin.setPosition(-this.mapSize.width/2+Math.random()*this.mapSize.width,
            this.mapSize.height/2);
            //添加硬币
            this.node.addChild(newCoin);
        }
        
        
    }

    //通关
    scenePassed(){
        //清空所有硬币
        let coins=this.node.children.filter((item)=>{return item.name=="coin"});
        for(let i=0;i<coins.length;++i){
            coins[i].destroy();
        }

        //暂时停止下落


        //播放通关bgm
        cc.audioEngine.play(this.sceneWin, false, 1);
        
        //绘制通关文本
        let node=new cc.Node('scenePassed');
        let labels=node.addComponent(cc.Label);
        labels.string="关卡通过！";
        node.parent=this.node;
        
        //硬币停止下落
        this.coinDrop=false;

        //回调函数，一段时间后消除该标识
        setTimeout(() => {
            node.destroy();
            this.coinDrop=true;

            //积分清零
            this.curCoin=0;
            this.targetCoin+=10;
            this.progressBar.progress=this.curCoin/this.targetCoin;

            //获取场景图片
            let spriteNode=this.node.getChildByName("sprite").getComponent(cc.Sprite);
            console.log("场景为",spriteNode.spriteFrame.name);
            if(spriteNode.spriteFrame.name=='JinZhai'){
                spriteNode.spriteFrame=this.meiShanPic;
            }
            else if (spriteNode.spriteFrame.name=='meiShan'){
                spriteNode.spriteFrame=this.guangChangPic;
            }
            else if (spriteNode.spriteFrame.name=='guangChang'){
                spriteNode.spriteFrame=this.tianTangZhaiPic;
            }
            else{
                spriteNode.spriteFrame=this.jinZhaiPic;
            }
        }, 1500);

    }
    
}
