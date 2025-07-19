import { Writable } from './store'
import { ActionResultVariant, ActionType, DbConnection, EventContext, GameAction, Person, PutAction, ReducerEventContext, Tile } from './module_bindings';

import { LoadUserFunction } from './userspace';


const app = document.querySelector<HTMLDivElement>('#app')!


let dbtoken = new Writable("dbtoken", "")

import { Block, int2color, int2pos, makestate, Pos, State, world_size } from './world';

DbConnection.builder()
.withUri("ws://localhost:3000")
.withModuleName("pixel")
.withToken(dbtoken.value)
.onConnect((connect, id, token )=>{


  let actionid = 0;
  console.log("connected.");
  dbtoken.set(token)
  let actionqueue = new Map<number, (r:ActionResultVariant)=>void> ()

  const onPersonChange = (p:Person)=>{

    let res = p.result
    if (!res) return
    
    let handle = actionqueue.get(res.id)
    if (!handle) return
    handle(res.result)
  }

  connect.subscriptionBuilder()
  .onApplied(c=>{
    let player = c.db.person.conn.find(id)!
    const send_action = (action:GameAction)=>{

      return new Promise<void>((resolve, reject)=>{
        actionqueue.set(action.id, res=>{
          if (res.tag == "Ok"){ resolve() }
          else { reject(res.value) }
        })
        connect.reducers.requestAction(action)
      })
    }
    let state = makestate(send_action)

    c.db.person.onInsert((c,p)=>onPersonChange(p))
    c.db.person.onUpdate((c,o,n)=>onPersonChange(n))
    connect.subscriptionBuilder()
    .onApplied(c=>{

      for (let tile of c.db.tile.iter()){

        
        state.world.setPixel(int2pos(tile.pos), tile)
      }

      c.db.tile.onInsert((c,i) => {
        state.world.setPixel(int2pos(i.pos), i)
        draw_world(state.world.pixels)
      })
      c.db.tile.onUpdate((u,o,n) => {
        let block = state.world.getPixel(int2pos(o.pos))!
        block.pos = int2pos(n.pos)
        console.log(block.pos);
        block.energy = n.energy
        state.world.setPixel(int2pos(o.pos), null);
        state.world.setPixel(int2pos(n.pos), n)
        draw_world(state.world.pixels)

      })
      c.db.tile.onDelete((d, old) => {
        state.world.getPixel(int2pos(old.pos))!.alive = false
        state.world.setPixel(int2pos(old.pos), null)
        draw_world(state.world.pixels)
      })

      let pos = connect.db.tile.id.find(player.bodytile)?.pos;
      if (!pos) throw new Error("no body found")

      let bod = state.world.getPixel(int2pos(pos))!

      LoadUserFunction().then(fn=>{
        console.log(fn);
        
        fn(state, bod)
      });


    })
    .onError(console.error)
    .subscribe(`SELECT * FROM tile`)

  })
  .onError(console.error)
  .subscribe(`SELECT * FROM person WHERE conn == '${id.toHexString()}'`)

})

.onConnectError(e=>console.error(e))
.build()


export function button(text:string){
  const button = document.createElement('button')
  button.innerText = text
  app.appendChild(button)
  return button
}



const codebutton = button('Show Code')


const canvas = document.createElement('canvas')
const csize = Math.min(window.innerWidth,window.innerHeight)-codebutton.clientHeight-10
canvas.width = csize
canvas.height = csize
app.appendChild(canvas)
const ctx = canvas.getContext('2d')!
const player = new Writable('player', {position:{x:0, y:0}, energy:0, id:"0"})
const addPermanentEventListener = document.addEventListener.bind(document);


codebutton.onclick = () => {window.location.href = '/code'}

addPermanentEventListener('keyup', e => {
  if(e.key === 'Escape') codebutton.click()
})

const block_size = canvas.width / world_size




function draw_block(x:number, y:number, color:string){
  ctx.fillStyle = color
  ctx.fillRect(x * block_size, y * block_size, block_size, block_size)
}
function draw_world(pixels: (null | Block)[][]){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  pixels.forEach((row, x) => row.forEach((color, y) => {    
    if(color !== null)
      {

      draw_block(x, y, `rgb(${color.color[0]}, ${color.color[1]}, ${color.color[2]})`)
    }
  }))
}

