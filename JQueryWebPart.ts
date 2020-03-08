import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';


import * as strings from 'JQueryWebPartStrings';
import MyAccordionTemplate from './MyAccordionTemplate';
import * as jQuery from 'jquery';

import  {Chart} from 'chart.js'
import { SPComponentLoader } from '@microsoft/sp-loader';
export interface IJQueryWebPartProps {
  description: string;
}
import * as workerPath from "file-loader?name=[name].js!./test.worker";


export function groupBy(array, f) {
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
export function MainThreadCost(message){
  var status;
  var st = new Date();
  var temp={'x':[],'y':[],'time':0};
 if(message[0]==1){
          groupBy(message[1],(t)=>{
            return t.country
        }).forEach(function(e){
          temp.x.push(e[0].country);
          var sum=0;
          e.forEach(element => {
              sum+=element.cost;
          });
          temp.y.push(sum);
        })
 }
else if(message[0]==2){
        groupBy(message[1],(t)=>{
          return t.country
      }).forEach(function(e){
        temp.x.push(e[0].country);
        temp.y.push(e.length);
      })
}
else if(message[0]==3){
        groupBy(message[1],(t)=>{
          return t.country
      }).forEach(function(e){
        temp.x.push(e[0].country);
        temp.y.push(12);
      })
}
  status = (new Date().getTime() - st.getTime()) + ' ms';
  temp.time=status;
  return temp;
}
export function CreateWorkerJS(context){
  context.domElement.innerHTML+=`<script id='worker1'  type="javascript/worker">

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
  });
  </script>`;
}
export default class JQueryWebPart extends BaseClientSideWebPart <IJQueryWebPartProps> {

  public render(): void {
    //#region  内联worker
    this.domElement.innerHTML=`Woker Thread<select ><option value='1'>1</option>
    <option value='2'>2</option><option value='3'>3</option>
    </select>
    Main Thread Select
    <select ><option value='1'>1</option>
    <option value='2'>2</option><option value='3'>3</option>
    </select>
    <p>Worker 花费时间: <output id="result"></output></p>
<p>原花费时间: <output id="result1"></output></p>
<canvas id="mychart"></canvas>`;
//#endregion
var res=[];
  CreateWorkerJS(this);
    const ctx=document.getElementById('mychart');
    const chart=new Chart(ctx,{
      type: 'bar',
      data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
    })
    
    //#region 模拟数据
    var o={'country':'a','cost':123};
    var b={'country':'b','cost':1233};var c=[];
    for(var i=0;i<1000000;i++){
      c.push(o);c.push(b);
    }
    //#endregion
    
    //根据select index来存放数据 
    var res=[];
    //#region  模拟worker
    
    //Load Outdoor js
    // const worker = new Worker(workerPath);
     var blob = new Blob([document.querySelector('#worker1').textContent]);
     const worker = new Worker(window.URL.createObjectURL(blob));
    worker.addEventListener('message', message => {
      res.push(message.data);
    });
    //#endregion

    
      //#region 模拟主线程，第一次加载第一个选项
     
          var status;
        var st = new Date();
        var temp={'x':[],'y':[]};
            groupBy(c,(t)=>{
                return t.country
            }).forEach(function(e){
              temp.x.push(e[0].country);
              var sum=0;
              e.forEach(element => {
                  sum+=element.cost;
              });
              temp.y.push(sum);
            })
            res.push(temp);
          chart.data.labels=temp.x;chart.data.datasets[0].data=temp.y;chart.update();
        
        //#endregion

         //#region  选项worker加载其余选项数据
     worker.postMessage([2,c]);worker.postMessage([3,c]);
      var se=  this.domElement.getElementsByTagName('select').item(0);
      se.addEventListener('change',function(e){
           
            chart.data.labels=res[se.selectedIndex].x;
            chart.data.datasets[0].data=res[se.selectedIndex].y;
            chart.update();
        })
        status = (new Date().getTime() - st.getTime()) + ' ms';
        document.getElementById('result').innerHTML=status;
     //#endregion


     //#region  原始耗费时间
     var se1=  this.domElement.getElementsByTagName('select').item(1);
     se1.addEventListener('change',function(e){
          var me=[];me.push(se.selectedIndex+1);me.push(c);
          debugger;
         var re =MainThreadCost(me);
         chart.data.labels=re.x;
            chart.data.datasets[0].data=re.y;
            chart.update();
            document.getElementById('result1').innerHTML+=re.time;
     })
     //#endregion
  }

  protected get dataVersion(): Version {
  return Version.parse('1.0');
}

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('description', {
                label: strings.DescriptionFieldLabel
              })
            ]
          }
        ]
      }
    ]
  };
}
}
