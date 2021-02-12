import { Component } from '@angular/core';
import { GestureController } from '@ionic/core/dist/collection/utils/gesture/gesture-controller';
import { HammerGestureConfig } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  // app icon
  // app splash screen
  // random color on each tap
  // single mode winner

  // reset after winner is selected
  // rumble
  // team mode divider
  // ads


  showMenuOptions: boolean = false;
  public multiTapping: boolean = false;
  public oneIsTapping: boolean = false;

  resetTimer: number = 5;
  timer: number = 5;
  startedCountdownTimer: boolean = false;
  timerTid: any;

  touches: any = [];
  maxFingers: Number = 10;
  fingers: any[] = [];

  tapMoreScreenMessage: string = "Tap more fingers on screen";
  tapScreenMessage: string = "Tap the screen with multiple fingers";
  timerCountdownMessage: string = "Starting in: ";
  message: string = this.tapScreenMessage; // this is the message that is displayed on the screen
  isSelectingWinner: boolean = false;
  selectingWinnerTid: any;
  isSingleMode = true;
  showingModeMenu = false;

  circlePixelOffset = 20;
  
  constructor() {}

  ngAfterViewInit(){
    console.log(`ngAfterViewInit()`);
    let self = this;
    var touchArea = document.getElementById('touchArea');
    console.log(`touchArea: `, touchArea);

    touchArea.addEventListener('touchend', function(event){
      if (self.showMenuOptions){
        return;
      }
      if (event.targetTouches.length < 2) {
        self.multiTapping = false;
        // end timer here
        self.endCountDownTimer();
        self.message = self.tapMoreScreenMessage;
      }
      if (event.targetTouches.length < 1) {
        
        self.oneIsTapping = false;
        self.message = self.tapScreenMessage;
      }
      console.log(event);
     
      // i need to reset (make the circle disapear) when I untap it
      let touches = event.changedTouches;
      for(var i=0; i < touches.length; i++) {
        var touchId = touches[i].identifier;
        var x = touches[i].pageX;
        var y = touches[i].pageY;
        // console.log('x: ', x);
        // console.log('y: ', y);
        self.resetCircle(touchId);
      }
      self.touches = event.touches;
      console.log(`self.touches: `, self.touches);
      console.log('finger untapped');
    }, false);

    touchArea.addEventListener('touchstart', function(event){
      if (self.showMenuOptions){
        return;
      }
      console.log('finger tapped');
      console.log(event);
      if (event.targetTouches.length > 1) {
        self.multiTapping = true;
        // start timer here?
        self.startCountDownTimer();
      }
      if (event.targetTouches.length === 1) {
        self.message = self.tapMoreScreenMessage;
        self.oneIsTapping = true;
      }
      let newIds = [];
      for(var i=0; i < event.changedTouches.length; i++) {
        newIds.push(event.changedTouches[i].identifier);
      }
      self.touches = event.touches;
      console.log(`self.touches: `, self.touches);
      self.drawCircles(event.changedTouches, newIds);
    }, false);

    // If there's exactly one finger inside this element
    touchArea.addEventListener('touchmove', function(event){
      if (self.showMenuOptions){
        return;
      }
      // console.log('touches');
      // console.log(event.targetTouches);
      var touches = event.changedTouches;
      self.drawCircles(touches);
    }, false);

    console.log(`finished gnAfterViewInit()`)
  }

  drawCircles(touches, newIds = []){
    let self = this;
    this.touches = touches;
    for(let i=0; i < newIds.length; i++) {
      self.setCircleColor(newIds[i]);
    }

    for(let i=0; i < touches.length; i++) {
      let touchId = touches[i].identifier;
      let x = touches[i].pageX;
      let y = touches[i].pageY;
      // console.log('x: ', x);
      // console.log('y: ', y);
      self.moveCircle(touchId, x, y);
    }

  }

  moveCircle(id, x, y){
    let circle = document.getElementById(`${id}`);
    circle.style.left = `${x - this.circlePixelOffset}px`
    circle.style.top = `${y - this.circlePixelOffset}px`
  }

  setCircleColor(id){
    // console.log(`setCircleColor()`);
    // console.log(id)
    let circle = document.getElementById(`${id}`);
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    circle.style["background-color"] = `#${randomColor}`;
    circle.style["box-shadow"] = `0px 0px 35px 10px #${randomColor}`;
  }

  resetCircle(id){
    let circle = document.getElementById(`${id}`);
    circle.style.left = `-4000px`
    circle.style.top = `-4000px`
  }

  handleMenuChange(event){
    console.log(`handleMenuChange()`);
    if (this.showingModeMenu){
      this.showingModeMenu = false;
      return;
    }
    this.showMenuOptions = !this.showMenuOptions;
  }

  showModeMenu(){
    this.showingModeMenu = true;
  }

  notTapping(){
    this.multiTapping = false;
  }

  isTapping(){
    this.multiTapping = true;
  }

  tapEvent(event, eventName = "tap"){
    // console.log('x: ' + event.center.x + ', y: ' + event.center.y);
    console.log(eventName);
    console.log(event);
    this.message = JSON.stringify(event);
  }

  selectSingleMode() {
    this.isSingleMode = true;
  }

  selectTeamMode() {
    this.isSingleMode = false;
  }

  startCountDownTimer(){
    let self = this;
    if (this.startedCountdownTimer || this.isSelectingWinner){
      console.log(`return;`)
      return;
    }
    console.log(`startCountDownTimer()`);
    this.startedCountdownTimer = true;
    this.timerTid = setInterval(() => {
      // console.log(`interval()`);

      if (self.timer <= 0){
        self.message = "Start counting boys!!!"
        self.endCountDownTimer();
        console.log(`here?`)
        self.selectWinnter();
        return;
      }

      self.timer--;
      self.message = `${self.timerCountdownMessage} ${self.timer}`;
      // console.log(`self.timer: `, self.timer);

    }, 1000)
  }

  endCountDownTimer(){
    console.log(`endCountDownTimer()`);
    this.timer = this.resetTimer;
    this.startedCountdownTimer = false;
    clearInterval(this.timerTid);
  }

  selectWinnter(){
    if (this.isSelectingWinner){
      return;
    }
    this.isSelectingWinner = true;
    if (this.isSingleMode){
      this.selectSingleWinner();
    } else {
      this.divideIntoTeams();
    }
  }

  selectSingleWinner(){
    let self = this;
    
    // make it look like it's going around for a bit
    // ** need to add rumble!
    let i = 0;
    let selecting = setInterval(() => {
      // if we passed the last circle
      // if (i-1 >= 0){
      //   let previousCirlce = document.getElementById(`${i-1}`);
      //   previousCirlce.classList.remove("circle--active");
      // } else if (i === 0){
      //   let previousCirlce = document.getElementById(`${self.touches.length - 1}`);
      //   previousCirlce.classList.remove("circle--active");
      // }
     
      // let circle = document.getElementById(`${i}`);
      // circle.classList.add("circle--active");
      // i++;
      
      // if (i === self.touches.length){
      //   i = 0;
      // }

      // if (i == 0){
      //   i = 1;
      // } else {
      //   i = 0;
      // }
      // self.message = `old i: ${i}, touches.length: ${self.touches.length}`
      let oldCircle = document.getElementById(`${i}`);
      oldCircle.classList.remove("circle--active");
      if (i >= self.touches.length){
        i = 0;
      } else {
        i++
      }
      self.message = `new i: ${i}, touches.length: ${self.touches.length}`

      let circle = document.getElementById(`${i}`);
      circle.classList.add("circle--active");
    }, 200)

    this.selectingWinnerTid = setTimeout(() => {
      // selecting winner process
      console.log(`clear!!!`)
      clearInterval(selecting);
      for(let i = 0; i < self.touches.length; i++){
        let clearCircle = document.getElementById(`${i}`);
        clearCircle.classList.remove("circle--active");
      }

      setTimeout(() => {
        const randomElement = Math.floor(Math.random() * self.touches.length + 1);
        let winnerId = randomElement;
        let circle = document.getElementById(`${winnerId}`);
        circle.classList.add("circle--active");
        self.isSelectingWinner = false
      }, 2000)
    }, 5000);

    ;
  }

  divideIntoTeams(){
    let self = this;
    this.selectingWinnerTid  = setInterval(() => {
      // TODO: dividing team process
    }, 300);
  }
}
