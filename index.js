(function(){

  function Gong(level){
    this.level = level
    this._init()
  }
  
  Gong.prototype._init = function(){
    this.place = []
    this.chance = 0;
    this.arr = [1,2,3,4,5,6,7,8,9]
    this.createPlace()
    this.eventFn()
  }
  
  Gong.prototype.eventFn = function(){
    let showbtn = document.getElementsByClassName('show')[0];
    let easybtn = document.getElementsByClassName('easy')[0];
    let midbtn = document.getElementsByClassName('middle')[0];
    let highbtn = document.getElementsByClassName('hight')[0];
    let checkbtn = document.getElementsByClassName('check')[0];
    showbtn.addEventListener('click', ()=>{
      this.writeNum(81)
    },false)
    easybtn.addEventListener('click', ()=>{
      this.createNum('easy')
    }, false)
    midbtn.addEventListener('click', ()=>{
      this.createNum('middle')
    }, false)
    highbtn.addEventListener('click', ()=>{
      this.createNum('hight')
    }, false)
    checkbtn.addEventListener('click', ()=>{
      this.getCheckNum()
    }, false)
  }

  Gong.prototype.createPlace = function(){
    let n  = 9
    let str = ''
    let tbody = document.getElementsByClassName('tbody')[0];
    for(let i = 0; i < 9; i ++){
      str += `<td>
                <input type="text" maxlength="1">
              </td>`
    }

    let trDom = '<tr>' + str + '</tr>'

    while(n --){
      tbody.innerHTML += trDom;
    }
    this.createNum(this.level)
  }

  Gong.prototype.createNum = function(level){

    this.level = level
    this.place = []
    this.flag = true;
    let arr = this.arr;
    let a = this.createNumFn(arr, [], [])
    let b = this.createNumFn(arr, a, [])
    let c = this.createNumFn(arr, a, b)
    let d = this.createNumFn(arr, [], [], a, b, c)
    let e = this.createNumFn(arr, d, [], a, b, c)
    let f = this.createNumFn(arr, d, e, a, b, c)
    let g = this.createNumFn(arr, [], [], a, b, c, d, e, f)
    let h = this.createNumFn(arr, g, [], a, b, c, d, e, f)
    let i = this.createNumFn(arr, g, h, a, b, c, d, e, f)
    if(this.flag){
      this.place.push(a, b, c, d, e, f, g, h, i) 
      this.changeLevel(this.level)
    }else{
      this.createNum(this.level)
    }

  }

  Gong.prototype.createNumFn = function(arr, arr1, arr2, ...args){
    let init = [];

    for(let j = 0; j < 9; j ++){
      let deleteArr = null;
      if(args.length === 0){
        deleteArr = []
      }else{
        deleteArr = args.reduce((prev, next)=>{
          prev.push(next[j])
          return prev
        }, [])
      }

      if(j < 3){
        deleteArr.push(...arr1.slice(0,3), ...arr2.slice(0, 3))
      }else if(j >= 3 && j < 6){
        deleteArr.push(...arr1.slice(3, 6), ...arr2.slice(3, 6))
      }else{
        deleteArr.push(...arr1.slice(6, 9), ...arr2.slice(6, 9))
      }

      let und = this.randomRang(this.getNotInNumber(deleteArr.concat(init), arr))[0]
      if(!und){
        this.chance ++;
        if(this.chance >= 100){
          this.chance = 0
          this.flag = false;
          break;
        }
        return this.createNumFn(arr, arr1, arr2, ...args)        
      }
      init.push(und)    
    }
    return init;
  }

  Gong.prototype.changeLevel = function(level){
    if(level === 'easy'){
      this.writeNum(36)
    }else if(level === 'middle'){
      this.writeNum(27)
    }else if (level === 'hight'){
      this.writeNum(18)
    }else{
      this.writeNum(81)
    }
  }

  Gong.prototype.writeNum = function(level){
    document.body.classList.remove('wrong','congratulation')
    let input = document.getElementsByTagName('input');
    let judgeArr = []
    for(let j = 0; j < 81; j ++){
      input[j].value = '';
      input[j].removeAttribute('disabled')
      judgeArr.push(j)      
    }

    let res = this.randomRang(judgeArr).slice(0, level)
    res.forEach(ele=>{
      let dom = input[ele]
      dom.value = (this.place.flat())[ele];
      dom.setAttribute('disabled', true);
      dom.style.color = '#555';
    })

  }

  Gong.prototype.getCheckNum = function(){
    let input = document.getElementsByTagName('input');
    let checkRow = [],checkCol = [], checkitem = [];
    for(let i = 0; i < 9; i ++){
      let row = []
      for(let j = 0 ; j < 9; j ++){
        row.push(+input[i * 9 + j].value)
      }
      checkRow.push(row)
    }

    let flatCheck = checkRow.flat();

    for(let i = 0; i < 9; i ++){
      let col = []
      for(let j = 0 ; j < 9; j ++){
        col.push(flatCheck[i + 9 * j])
      }
      checkCol.push(col)
    }

    for(let i = 0; i < 9; i += 3){
      for(let k = 0; k < 9; k += 3){
        let item = []
        for(let j = 0 ; j < 3; j ++){
          item.push(flatCheck[i + 9 * (j + k)], flatCheck[i + 1 + 9 * (j + k)], flatCheck[i + 2 + 9 * (j + k)])
        }
        checkitem.push(item)
      }
    }
  
    let rowResult = this.checkNum(checkRow)
    let colResult = this.checkNum(checkCol)
    let itemResult = this.checkNum(checkitem)
    if(rowResult && colResult && itemResult ){
      document.body.classList.remove('wrong')
      document.body.classList.add('congratulation')
    }else{
      document.body.classList.remove('congratulation')
      document.body.classList.add('wrong')
    }
  }


   Gong.prototype.checkNum = function(check){
    let arr = this.arr;
    return  check.every(ele=>{
      return arr.every(item=>{
        return ele.includes(item)
      })
    })
   }
  // 两个工具
  // 判断b数组中，a数组不包含的值
  Gong.prototype.getNotInNumber = function(a,b){
    return b.filter(ele=>{
      if(a.includes(ele)){
        return false
      }
      return true
    })
  }
  
  Gong.prototype.randomRang = function(arr){
    return arr.sort(()=> Math.random() * 10 - 5).concat([])
    
  }

  new Gong()
}())
