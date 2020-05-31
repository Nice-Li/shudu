(function($){

  // let inputs = document.getElementsByTagName('input');
  // randomRang(arr)
  // console.log(inputs, arr)
  // for(let i = 0; i < 9; i ++){
  //   inputs[i].value = arr[i]
  // }
  function Gong(){

    this._init()
  }
  
  Gong.prototype._init = function(){
    this.place = []
    this.arr = [1,2,3,4,5,6,7,8,9]
    this.createPlace()
  }
  
  Gong.prototype.createPlace = function(){
    let n  = 9
    let str = ''

    let trDom = '<tr></tr>'

    for(let i = 0; i < 9; i ++){
      str += `<td>
                <input type="text" maxlength="1">
              </td>`
    }
    while(n --){
      $('.tbody').append($(trDom).append(str))
    }
    this.firstLine()
  }

  Gong.prototype.firstLine = function(){

    // for(let i = 0; i < 9; i ++){
    //   let a = this.randomRang(this.arr)
    //   this.place.push(a)
    // }
    let a = this.randomRang(this.arr)
    this.place.push(a)
    this.judgeLine()

  }
  Gong.prototype.judgeLine = function(){
    let fir = this.place[0]
    this.comLine(fir, [], [])
  }
  Gong.prototype.comLine = function(a, b, c){

    for(let j = 0; j < 9; j += 3){
      let a1 = a.slice(j, j + 3)
      for(let i = 0; i < 3; i ++){
        let und = this.randomRang(this.getNotInNumber(a1.concat(b), a))[0]
        if(!und){
          this.comLine(a, [],[])
          return 
        }
        b[i + j] = und
      }
    }

    for(let j = 0; j < 9; j += 3){
      let a1 = a.slice(j, j + 3).concat(b.slice(j, j+3))
      for(let i = 0; i < 3; i ++){
        let und = this.randomRang(this.getNotInNumber(a1.concat(c), a))[0]
        if(!und){
          this.comLine(a, [],[])
          return 
        }
        c[i + j] = und
      }
    }
    let d = []
    for(let j = 0; j < 9; j ++){
      let a1 = [a[j], b[j], c[j]]
        let und = this.randomRang(this.getNotInNumber(a1.concat(d), a))[0]
        if(!und){
          this.comLine(a, [],[])
          return 
        }
        d[j] = und
      
    }

    let e = []
    for(let j = 0; j < 9; j ++){
      let a1 = [a[j], b[j], c[j], d[j]]
      if(j < 3){
        a1.push(...d.slice(0,3))
      }else if(j >= 3 && j < 6){
        a1.push(...d.slice(3, 6))
      }else{
        a1.push(...d.slice(6, 9))
      }
      let und = this.randomRang(this.getNotInNumber(a1.concat(e), a))[0]
      if(!und){
        this.comLine(a, [],[])
        return 
      }
      e[j] = und
    }


    let f = []
    for(let j = 0; j < 9; j ++){
      let a1 = [a[j], b[j], c[j], d[j], e[j]]
      if(j < 3){
        a1.push(...d.slice(0,3), ...e.slice(0, 3))
      }else if(j >= 3 && j < 6){
        a1.push(...d.slice(3, 6), ...e.slice(3, 6))
      }else{
        a1.push(...d.slice(6, 9), ...e.slice(6, 9))
      }
      let und = this.randomRang(this.getNotInNumber(a1.concat(f), a))[0]
      if(!und){
        this.comLine(a, [],[])
        return 
      }
      f[j] = und
    }


    let g = []
    for(let j = 0; j < 9; j ++){
      let a1 = [a[j], b[j], c[j], d[j], e[j], f[j]]
        let und = this.randomRang(this.getNotInNumber(a1.concat(g), a))[0]
        if(!und){
          this.comLine(a, [],[])
          return 
        }
        g[j] = und
      
    }

    let h = []
    for(let j = 0; j < 9; j ++){
      let a1 = [a[j], b[j], c[j], d[j], e[j], f[j]]
      if(j < 3){
        a1.push(...g.slice(0,3))
      }else if(j >= 3 && j < 6){
        a1.push(...g.slice(3, 6))
      }else{
        a1.push(...g.slice(6, 9))
      }
      let und = this.randomRang(this.getNotInNumber(a1.concat(h), a))[0]
      if(!und){
        this.comLine(a, [],[])
        return 
      }
      h[j] = und
    }


    let l = []
    for(let j = 0; j < 9; j ++){
      let a1 = [a[j], b[j], c[j], d[j], e[j], f[j]]
      if(j < 3){
        a1.push(...g.slice(0,3),...h.slice(0, 3))
      }else if(j >= 3 && j < 6){
        a1.push(...g.slice(3, 6),...h.slice(3, 6))
      }else{
        a1.push(...g.slice(6, 9),...h.slice(6, 9))
      }
      let und = this.randomRang(this.getNotInNumber(a1.concat(l), a))[0]
      if(!und){
        this.comLine(a, [],[])
        return 
      }
      l[j] = und
    }


    this.place.push(b.flat(), c.flat(), d.flat(), e.flat(),f,g,h,l)
    this.createNum()
  }



  Gong.prototype.createNum = function(){
    for(let j = 0; j < 81; j ++){
      $($('input')[j]).val((this.place.flat())[j])
    }
  }
  

  Gong.prototype.getNotInNumber = function(a,b){
    return b.filter(ele=>{
      if(a.includes(ele)){
        return false
      }
      return true
    })
  }
  
  Gong.prototype.randomRang = function(arr){
    return arr.sort((a,b)=> Math.random() * 10 - 5).concat([])
    
  }
  


  new Gong()
}(window.jQuery))

