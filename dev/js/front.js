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
      .add(_.componentName,'showForm',_.showCardFileForm.bind(_));

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
      } else btn.parentElement.previousElementSibling.classList.remove('choosen');
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

}
new Front();
