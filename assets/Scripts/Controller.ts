// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Controller extends cc.Component {


    //移动状态
    leftMoving:boolean=false;
    rightMoving:boolean=false;

    //地图大小
    mapSize:cc.Size=null;
    
    @property(cc.AudioClip)
    gainCoin:cc.AudioClip=null;

    /*人物形象*/
    @property(cc.SpriteFrame)
    frontSprite:cc.SpriteFrame=null;

    @property(cc.SpriteFrame)
    leftSprite:cc.SpriteFrame=null;

    @property(cc.SpriteFrame)
    rightSprite:cc.SpriteFrame=null;

    onLoad () {
        this.mapSize=cc.view.getVisibleSize();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
        /*
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            console.log('鼠标被按下');
        }, this);
        */
    }

    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
 
    onKeyDown(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.leftMoving=true;
                break;
            case cc.macro.KEY.d:
                this.rightMoving=true;
                
                break;
        }
    }

    dealPos(pos){
        console.log('位置为',pos);
        if(pos<this.node.position.x){
            this.leftMoving=true;
        }
        else{
            this.rightMoving=true;
        }
    }

    endClick(){
        this.leftMoving=false;
        this.rightMoving=false;
    }

   
    onKeyUp(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.leftMoving=false;
                break;
            case cc.macro.KEY.d:
                this.rightMoving=false;
                break;
        }
    }

    update(dt){
        if(this.leftMoving){
            if(!this.rightMoving){
                //向左移动
                this.node.getComponent(cc.Sprite).spriteFrame=this.leftSprite;
                if(this.node.position.x>-this.mapSize.width/2){
                    this.node.setPosition(this.node.position.x-5,
                        this.node.position.y);
                }
            }
            else{
                this.node.getComponent(cc.Sprite).spriteFrame=this.frontSprite;
            }
        }
        else if (this.rightMoving){
            //向右移动
            if(this.node.position.x<this.mapSize.width/2){
                this.node.getComponent(cc.Sprite).spriteFrame=this.rightSprite;
                this.node.setPosition(this.node.position.x+5,
                    this.node.position.y);
            }
            else{
                this.node.getComponent(cc.Sprite).spriteFrame=this.frontSprite;
            }
        }
        else{
            this.node.getComponent(cc.Sprite).spriteFrame=this.frontSprite;
        }
    }

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider) {
        otherCollider.node.destroy();
        //播放动画

        //播放音效
        cc.audioEngine.play(this.gainCoin, false, 1);

        //发送事件
        this.node.dispatchEvent( new cc.Event.EventCustom('getCoin',true) );
    }
}
