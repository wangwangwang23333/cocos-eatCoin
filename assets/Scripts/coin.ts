// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    mapSize:cc.Size=null;

    start () {
        //获取重力，随机1-3
        this.node.getComponent(cc.RigidBody).gravityScale=1+Math.random()*2;
        this.mapSize=cc.view.getVisibleSize();
    }

    update (dt) {
        //获取该物体位置
        var pos=this.node.position;
        
        //超出边界
        if(pos.y<=-this.mapSize.height/2){
            this.destroy();
        }
    }
}
