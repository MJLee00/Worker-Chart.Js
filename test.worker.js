var a;
function groupBy(array, f) {
    const groups = {};
    array.forEach(function (o) {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    });
  }

addEventListener('message', (message) => {
    var status;
    var st = new Date();
    var res={'x':[],'y':[]};
   if(message.data[0]==1){
            groupBy(message.data[1],(t)=>{
              return t.country
          }).forEach(function(e){
            res.x.push(e[0].country);
            var sum=0;
            e.forEach(element => {
                sum+=element.cost;
            });
            res.y.push(sum);
          })
   }
  else if(message.data[0]==2){
          groupBy(message.data[1],(t)=>{
            return t.country
        }).forEach(function(e){
          res.x.push(e[0].country);
          res.y.push(e.length);
        })
  }
  else if(message.data[0]==3){
          groupBy(message.data[1],(t)=>{
            return t.country
        }).forEach(function(e){
          res.x.push(e[0].country);
          res.y.push(12);
        })
  }
    status = (new Date().getTime() - st.getTime()) + ' ms';
    postMessage(res) ;
})
 
   