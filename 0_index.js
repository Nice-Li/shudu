(function(){

  function Gong(level){
    this.level = level
    this._init()
  }
  
  Gong.prototype._init = function(){
    this.place = []
    this.color = 'rgb(116, 14, 199)'
    this.chance = 0;
    this.createNumber = 0;
    this.arr = [1,2,3,4,5,6,7,8,9]
    this.checkFlag = true;
    this.tipsFlag = true;
    this.createPlace()

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
    let quescolorbtn = document.getElementsByClassName('quescolor')[0]
    let origincolorbtn = document.getElementsByClassName('origincolor')[0]
    showbtn.addEventListener('click', ()=>{
      this.changeLevel(81)
      this.checkFlag = false;
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
      if(this.checkFlag){
        this.tipsInitFn()
      }
    })
    checkbtn.addEventListener('click', ()=>{
      if(this.checkFlag){
        this.checkNum(this.input, this.getCheckResolute)
      }
    }, false)
    let self = this;
    selfbtn.addEventListener('input', debounce(function(){
      self.changeLevel(Object.is(+this.value, NaN) ? 81 : +this.value)
    }, 500), false)
    origincolorbtn.addEventListener('click', ()=>{
      this.color = 'rgb(116, 14, 199)'
    },false)
    quescolorbtn.addEventListener('click', ()=>{
      this.color = 'rgb(24, 11, 34)'
    },false)
    this.tbody.addEventListener('input',function(e){
      e.target.style.color = self.color;
    }, false)
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
    this.eventFn()
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

    this.createNumber ++
    this.place = []
    this.createFlag = true;
    this.checkFlag = true;
    let arr = this.arr;

    let res = this.getCheckNum(this.input);
    let checkRow = res.checkRow;
    let checkCol = res.checkCol;
    let checkItem = res.checkItem;

    for(let i = 0; i < 9; i ++){
      if(!this.createFlag){
        break;
      }
      let j = Math.floor(i / 3)
      let res = this.createNumFn(arr, checkRow[i], checkCol, checkItem[j],checkItem[j + 3], checkItem[j + 6])
      this.place.push(res)
    }

    if(this.createFlag){
      document.body.classList.remove('loading')
      this.createNumber = 0
      let resflag = this.checkNum(this.place.flat(), this.checkPlaceNum)
      if(resflag){
        this.oldPlace = this.place.concat([])
      }else{
        this.place = this.oldPlace.concat([])
      }
      
    }else{
      if(this.createNumber >= 3000){
        this.createNumber = 0;
        document.body.classList.add('noreal')
        setTimeout(()=>{
          document.body.classList.remove('loading','noreal')
        },2000)
        return 
      }
      this.createNum()
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
          }else{
            return this.createNumFn(arr, row, col, ...args)        

          }
        }
        args[Math.floor(j / 3)].push(fin);
        col[j].push(fin)
        res[j] = fin;    
      }
      return res;
    }

  }

  Gong.prototype.changeLevel = function(level){
    document.body.classList.remove('wrong','congratulation','loading')
    this.level = level
    this.checkFlag = true;
    let input = this.input;
    let judgeArr = []
    for(let j = 0; j < 81; j ++){
      input[j].value = '';
      input[j].removeAttribute('disabled')
      judgeArr.push(j)      
    }

    let place = this.oldPlace;
    let res = this.getRandomItem(judgeArr, level)
    res.forEach(ele=>{
      let dom = input[ele]
      dom.value = (place.flat())[ele];
      dom.setAttribute('disabled', true);
      dom.style.color = 'rgb(116, 14, 199)'    
    })
  }

  Gong.prototype.getCheckNum = function(check){
    let input = check;
    let checkRow = [],checkCol = [], checkItem = [];
    for(let i = 0; i < 9; i ++){
      let row = []
      for(let j = 0 ; j < 9; j ++){
        row.push(+input[i * 9 + j].value || +input[i * 9 + j] )
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


   Gong.prototype.checkLastNum = function(check){
    let arr = this.arr;
    return  check.every(ele=>{
      return arr.every(item=>{
        return ele.includes(item)
      })
    })
   }
   Gong.prototype.checkNum = function(check, cb){
    let res = this.getCheckNum(check)
    let rowResult = this.checkLastNum(res.checkRow)
    let colResult = this.checkLastNum(res.checkCol)
    let itemResult = this.checkLastNum(res.checkItem)
    return cb(rowResult && colResult && itemResult)
   }
   Gong.prototype.checkPlaceNum = function(flag){
    if(flag){
      document.body.classList.remove('wrong')
      return true;
    }else{
      document.body.classList.add('wrong')
      return false;
    }
   }
   Gong.prototype.getCheckResolute = function(flag){   
      if(flag){
        document.body.classList.remove('wrong')
        document.body.classList.add('congratulation')
        return true;
      }else{
        document.body.classList.remove('congratulation')
        document.body.classList.add('wrong')
        return false;
      }
   }

   Gong.prototype.tipsInitFn = function(){
    let comFlag = this.comparePlace();
    if(comFlag){
      this.setTipsNum()
    }else{
      document.body.classList.add('loading')
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
    if(dom){
      dom.value = (place.flat())[res];
      dom.setAttribute('disabled', true);
      dom.style.color = 'rgb(116, 14, 199)'
    }
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

  new Gong(36)
}())


