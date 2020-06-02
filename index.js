(function(){

  function Gong(level){
    this.level = level
    this._init()
  }
  
  Gong.prototype._init = function(){
    this.place = []
    this.chance = 0;
    this.createNumber = 0;
    this.arr = [1,2,3,4,5,6,7,8,9]
    this.checkFlag = true;
    this.tipsFlag = true;
    this.createPlace()
    this.eventFn()
  }
  
  Gong.prototype.eventFn = function(){
    let showbtn = document.getElementsByClassName('show')[0];
    let easybtn = document.getElementsByClassName('easy')[0];
    let midbtn = document.getElementsByClassName('middle')[0];
    let highbtn = document.getElementsByClassName('hight')[0];
    let checkbtn = document.getElementsByClassName('check')[0];
    let refreshbtn = document.getElementsByClassName('refresh')[0];
    let tipsbtn = document.getElementsByClassName('tips')[0];
    let selfbtn = document.getElementById('selfbtn')
    showbtn.addEventListener('click', ()=>{
      this.checkFlag = false;
      this.changeLevel(81)
    },false)
    easybtn.addEventListener('click', ()=>{
      this.changeLevel(36)
    }, false)
    midbtn.addEventListener('click', ()=>{
      this.changeLevel(27)
    }, false)
    highbtn.addEventListener('click', ()=>{
      this.changeLevel(18)
    }, false)
    refreshbtn.addEventListener('click',()=>{
      this.getCreateNum(this.level)
    })
    tipsbtn.addEventListener('click', ()=>{
      document.body.classList.remove('wrong')
      // if(this.checkFlag){
        this.tipsInitFn()
      // }
    })
    checkbtn.addEventListener('click', ()=>{
      // if(this.checkFlag){
        this.getCheckResolute()
      // }
    }, false)
    let self = this;
    selfbtn.addEventListener('input', debounce(function(){
      self.changeLevel(Object.is(+this.value, NaN) ? 81 : +this.value)
    }, 500), false)
  }

  Gong.prototype.createPlace = function(){
    let n  = 9
    let str = ''
    let tbody = document.getElementsByClassName('tbody')[0];
    this.tbody = tbody;
    for(let i = 0; i < 9; i ++){
      str += `<td>
                <input type="text" maxlength="1">
              </td>`
    }

    let trDom = '<tr>' + str + '</tr>'

    while(n --){
      tbody.innerHTML += trDom;
    }
    this.input = tbody.getElementsByTagName('input');
    this.getCreateNum(this.level)
  }
  Gong.prototype.getCreateNum = function(level){
    let input = this.input
    for(let j = 0; j < 81; j ++){
      input[j].value = '';
      input[j].removeAttribute('disabled')    
    }
    this.createNum()
    this.changeLevel(level)
  }
  Gong.prototype.createNum = function(){
    document.body.classList.remove('noreal')
    this.createNumber ++
    this.place = []
    this.createFlag = true;
    this.checkFlag = true;
    let arr = this.arr;

    let res = this.getCheckNum();
    let checkRow = res.checkRow;
    let checkCol = res.checkCol;
    let checkItem = res.checkItem;
    console.log(this.createNumber)
    let a = this.createFlag && this.createNumFn(arr, checkRow[0], checkCol, checkItem[0],checkItem[3], checkItem[6])
    let b = this.createFlag && this.createNumFn(arr, checkRow[1], checkCol, checkItem[0],checkItem[3], checkItem[6])
    let c = this.createFlag && this.createNumFn(arr, checkRow[2], checkCol, checkItem[0],checkItem[3], checkItem[6])
    let d = this.createFlag && this.createNumFn(arr, checkRow[3], checkCol, checkItem[1],checkItem[4], checkItem[7])
    let e = this.createFlag && this.createNumFn(arr, checkRow[4], checkCol, checkItem[1],checkItem[4], checkItem[7])
    let f = this.createFlag && this.createNumFn(arr, checkRow[5], checkCol, checkItem[1],checkItem[4], checkItem[7])
    let g = this.createFlag && this.createNumFn(arr, checkRow[6], checkCol, checkItem[2],checkItem[5], checkItem[8])
    let h = this.createFlag && this.createNumFn(arr, checkRow[7], checkCol, checkItem[2],checkItem[5], checkItem[8])
    let i = this.createFlag && this.createNumFn(arr, checkRow[8], checkCol, checkItem[2],checkItem[5], checkItem[8])
    if(this.createFlag){
      this.createNumber = 0
      this.place.push(a, b, c, d, e, f, g, h, i) 
      this.oldPlace = this.place.concat([])
    }else{
      if(this.createNumber >= 1000){
        console.log('不能再生')
        this.createNumber = 0;
        document.body.classList.add('noreal')
        return 
      }
      this.createNum(this.level)
    }

  }

  Gong.prototype.createNumFn = function(arr, row, col, ...args ){
    if(this.createFlag){
      let res = row;  
      for(let j = 0; j < 9; j ++){
        if(res[j]){
          continue;
        }
        let deleteArr = col[j].concat([]);
        deleteArr.push(...args[Math.floor(j / 3)])
        let fin = this.getRandomItem(this.getNotInNumber(deleteArr.concat(res), arr),1)[0]
        if(!fin){
          this.chance ++;
          if(this.chance >= 100){
            this.chance = 0
            this.createFlag = false;
            this.tipsFlag = false;
            break;
          }
          return this.createNumFn(arr, row, col, ...args)        
        }
        args[Math.floor(j / 3)].push(fin);
        col[j].push(fin)
        res[j] = fin;    
      }
      return res;
    }

  }

  Gong.prototype.changeLevel = function(level){
    this.level = level
    let input = this.input;
    this.judgeArr =[]
    let judgeArr = this.judgeArr
    for(let j = 0; j < 81; j ++){
      input[j].value = '';
      input[j].removeAttribute('disabled')
      judgeArr.push(j)      
    }

    this.showNum(level)
  }

  Gong.prototype.showNum = function(level = 81){
    document.body.classList.remove('wrong','congratulation')
    let input = this.input;
    let judgeArr = this.judgeArr.concat([])
    let place = this.oldPlace;
    let res = this.getRandomItem(judgeArr, level)
    res.forEach(ele=>{
      let dom = input[ele]
      dom.value = (place.flat())[ele];
      dom.setAttribute('disabled', true);
    })

  }

  Gong.prototype.getCheckNum = function(){
    let input = this.input;
    let checkRow = [],checkCol = [], checkItem = [];
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
        checkItem.push(item)
      }
    }
  
    return {
      checkRow,
      checkCol,
      checkItem
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
   Gong.prototype.getCheckResolute = function(){
    
    let res = this.getCheckNum()
    let rowResult = this.checkNum(res.checkRow)
    let colResult = this.checkNum(res.checkCol)
    let itemResult = this.checkNum(res.checkItem)
    if(rowResult && colResult && itemResult ){
      document.body.classList.remove('wrong')
      document.body.classList.add('congratulation')
    }else{
      document.body.classList.remove('congratulation')
      document.body.classList.add('wrong')
    }
   }

   Gong.prototype.tipsInitFn = function(){
    let comFlag = this.comparePlace();
    if(comFlag){
      this.setTipsNum()
    }else{
      console.log('再创造')
      this.createNum()

    }

   }

   Gong.prototype.setTipsNum = function(){
    let input = this.input;
    let judgeArr = []
    let place = this.oldPlace;
    place.flat().forEach((ele, index)=>{
      if(!(+input[index].value)){
        judgeArr.push(index)
      }
    })
    let res = this.getRandomItem(judgeArr, 1)[0]
    let dom = input[res]
    dom.value = (place.flat())[res];
    dom.setAttribute('disabled', true);
    dom.style.color = 'rgb(116, 14, 199)'
   }

   Gong.prototype.comparePlace = function(){
    let place = this.oldPlace.flat();
    let input = this.input;
    return place.every((ele, index)=>{
      if(+input[index].value && ele !== +input[index].value){
        return false
      }
      return true;
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
  

  Gong.prototype.getRandomItem = function(arr = [], num = 0){
    let newArr = []
    for(let j =0; j < num; j ++){
      let randomNum = Math.floor(Math.random() * arr.length)
      newArr.push(arr.splice(randomNum,1))
    }
    return newArr.flat()
  }
  
  function debounce(fn, delay){
    let timer = null;
    return function(...args){
      clearTimeout(timer)
      timer = setTimeout(()=>{
        fn.apply(this, args)
      }, delay)
    }
  }

  new Gong()
}())


