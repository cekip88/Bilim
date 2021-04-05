import { MainEventBus } from "./libs/MainEventBus.lib.js";
import { _front } from "./libs/_front.js";
class Front extends _front{
  constructor(){
    super();
    const _ = this;
    MainEventBus
      .on(_,'createOrderSuccess')
      .on(_,'createOrderFail')
      .on(_,'selectToActive')
      .on(_,'selectToInactive')
      .on(_,'showForm');

  }
  createOrderSuccess(orderData){}
  createOrderFail(orderData){}

  showForm(clickData){
    const _ = this;
    let btn = clickData.item;
    let container = btn.parentElement.parentElement;
    if (container.classList.contains('active')){
      container.classList.remove('active')
    } else {
      document.querySelectorAll(`*[data-click-action='Front:showForm']`).forEach(function (el){
        el.parentElement.parentElement.classList.remove('active');
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
      select = btn.parentElement,
      value = btn.textContent;

    if (!select.classList.contains('select')){
      while(!select.classList.contains('select')){
        select = select.parentElement;
      }
    }

    let head = select.querySelector('.select-head');
    if (!another){
      if (select.firstElementChild.tagName === 'INPUT') select.firstElementChild.value = value;
      head.firstElementChild.textContent = value;
    }

    select.classList.remove('active');
    head.setAttribute('data-click-action','Front:selectToActive')
  }
}
new Front();
