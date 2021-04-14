import { MainEventBus } from "./libs/MainEventBus.lib.js";
import { _front } from "./libs/_front.js";
class Front extends _front{
  constructor(){
    super();
    const _ = this;
    _.componentName = 'Front';
    MainEventBus
      .on(_,'createOrderSuccess')
      .on(_,'createOrderFail')
      .on(_,'selectToActive')
      .on(_,'selectToInactive')
      .on(_,'showPop')
      .on(_,'addSpace')
      .on(_,'closePop')
      .on(_,'addFile')
      .on(_,'removeFile')
      .add(_.componentName,'showForm',_.showCardFileForm.bind(_));

  }
  el(tag,params){
    const _ = this;
    if(params == undefined) params = {};
    if (!tag) return null;
    let
        childes =  params['childes'] ?  params['childes']: null;
    delete params['childes'];
    let temp = document.createElement(tag);
    if (tag == 'temp'){
      temp = document.createDocumentFragment();
    }
    if(params){
      for(let key in params){
        if(key === 'text') {
          if( (tag === 'INPUT') || (tag === 'TEXTAREA') ) temp.value = params[key];
          else temp.textContent = params[key];
        } else if(key === 'prop')  _[params[key]] = temp;
        else if(key === 'html') temp.innerHTML = params[key];
        else temp.setAttribute(`${key}`,`${params[key]}`);
      }
    }
    if(  (childes instanceof  Array) && (childes.length) ) {
      childes.forEach(function (el) {
        temp.append(el);
      });
    }
    return temp;
  }
  createOrderSuccess(orderData){}
  createOrderFail(orderData){}

  showCardFileForm(clickData){
    const _ = this;
    let btn = clickData.item;
    let container = btn.closest('.cont');
    if (container.classList.contains('active')){
      container.classList.remove('active')
    } else {
      document.querySelectorAll(`*[data-click-action='Front:showForm']`).forEach(function (el){
        let cont = el.closest('.active');
        if(cont) cont.classList.remove('active');
      })
      container.querySelectorAll('.select-head').forEach(function (el){
        _.selectToInactive({item:el},true)
      })
      container.classList.add('active')
    }
  }
  selectToActive(clickData){
    const _ = this;
    let
      selectHead = clickData.item,
      select = selectHead.parentElement;

    let selects = document.querySelectorAll(`*[data-click-action='Front:selectToInactive']`);
    selects.forEach(function (el){
      _.selectToInactive({item:el},true)
    })

    select.classList.add('active');
    selectHead.setAttribute('data-click-action','Front:selectToInactive');
  }
  selectToInactive(clickData,another){
    let
      btn = clickData.item,
      select = btn.closest('.select'),
      value = btn.textContent;

    let head = select.querySelector('.select-head');
    if (!another){
      if (btn.classList.contains('select-option')){
        btn.parentElement.previousElementSibling.classList.add('choosen');
      } else btn.parentElement.classList.remove('choosen');
      if (select.firstElementChild.tagName === 'INPUT') select.firstElementChild.value = value;
      head.firstElementChild.textContent = value;
    }

    select.classList.remove('active');
    head.setAttribute('data-click-action','Front:selectToActive')
  }

  showPop(clickData){
    let target = clickData.item;
    let popClass = target.getAttribute('data-target');
    let pop = document.querySelector(`.${popClass}`);
    pop.classList.add('active');
  }
  closePop(clickData){
    let target = clickData.item;
    let popBgc = target.closest(`.pop`);
    popBgc.classList.remove('active');
  }

  addSpace(clickData){
    let btn = clickData.item,
        input = btn.previousElementSibling;
    if (btn.classList.contains('active')) {
      input.removeAttribute('disabled');
      btn.classList.remove('active');
      input.value = '';
    } else {
      input.setAttribute('disabled',true);
      btn.classList.add('active');
      input.value = 'Н';
    }
  }

  addFile(changeAction){
    const _ = this;
    let
      input = changeAction.item;
    _.changeFileInput(input);
    let newAddButton = _.createFileAdded();
    input.closest('.add-file-row').prepend(newAddButton);
  }
  changeFileInput(input){
    const _ = this;
    let
      nextElem = input.nextElementSibling,
      img = nextElem.firstElementChild,
      cont = input.parentElement,
      value = input.value;

    value = value.split('\\');
    value = value[value.length - 1];
    let lastPosition = value.lastIndexOf('.');
    let title = value.substring(0,lastPosition);
    let type = value.substring(lastPosition + 1);

    cont.className = 'add-file-added';
    cont.setAttribute('data-click-action','Front:removeFile');
    input.type = 'hidden';
    img.src = `img/${type}.svg`;

    let nameElem = _.el('SPAN',{text:title})
    nextElem.append(nameElem)
  }
  createFileAdded(){
    const _ = this;
    let tpl = _.el('DIV',{
      'class':'add-file','childes':[
        _.el('INPUT',{'type':'file','data-change-action':'Front:addFile'}),
        _.el('DIV',{'childes':[
          _.el('IMG',{'src':'img/big-plus.svg'})
        ]})
      ]
    });
    return tpl;
  }
  removeFile(clickData){
    clickData.item.remove();
  }
}
new Front();
