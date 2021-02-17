import { Component } from '@angular/core';
import { GestureController } from '@ionic/core/dist/collection/utils/gesture/gesture-controller';
import { HammerGestureConfig } from '@angular/platform-browser';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // DONE:
  // app icon
  // app splash screen
  // random color on each tap
  // single mode winner
  // rumble

  // TODO:
  // *** reset after winner is selected
  // Bug: if persono 0 and 1 untap. only 2, 3 are left. But it can't select a winner
  // team mode divider
  // ads

  // General 
  showMenuOptions: boolean = false;
  public multiTapping: boolean = false;
  public oneIsTapping: boolean = false;

  // Timer for selecting a winner. 
  resetTimer: number = 5;
  timer: number = 5;
  startedCountdownTimer: boolean = false;
  timerTid: any;

  // Keeping tack uf current touches
  touches: any = [];
  maxFingers: Number = 10;
  fingers: any[] = [];
  currentTouches: number = 0;

  // MENU
  tapMoreScreenMessage: string = "Tap more fingers on screen";
  tapScreenMessage: string = "Tap the screen with multiple fingers";
  timerCountdownMessage: string = "Starting in: ";
  message: string = this.tapScreenMessage; // this is the message that is displayed on the screen
  isSelectingWinner: boolean = false;
  selectingWinnerTid: any;
  isSingleMode = true;
  showingModeMenu = false;

  // Rendering circle, move to constants file
  circlePixelOffset = 20;
  
  constructor(private vibration: Vibration ) {}

  ngAfterViewInit(){
    let self = this;
    var touchArea = document.getElementById('touchArea');

    // When someone has stopped touching the screen
    touchArea.addEventListener('touchend', function(event){
      // If the menu is being used
      if (self.showMenuOptions){
        return;
      }
      
      if (event.targetTouches.length < 2) {
        self.multiTapping = false;
        // end timer here
        self.endCountDownTimer();
        
        if (!self.selectSingleWinner){
          self.message = self.tapMoreScreenMessage;
        } else if (self.selectSingleWinner){
          // completely stop if too many people untap
          self.resetAfterWin();
        }
      }
      if (event.targetTouches.length < 1) {
        self.resetAfterWin();
        self.oneIsTapping = false;
        self.message = self.tapScreenMessage;
      }
     
      // i need to reset (make the circle disapear) when I untap it
      let touches = event.changedTouches;
      for(var i=0; i < touches.length; i++) {
        var touchId = touches[i].identifier;
        self.resetCircle(touchId);
      }

      self.touches = event.touches;
      self.currentTouches--;
      console.log('finger untapped');
    }, false);

    // When someone has tapped the screen
    touchArea.addEventListener('touchstart', function(event){
      // If the menu is being used
      if (self.showMenuOptions){
        return;
      }

      console.log('finger tapped');
      if (event.targetTouches.length > 1) {
        self.multiTapping = true;
        // start timer
        if (!self.startedCountdownTimer){
          self.startCountDownTimer();
        }
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
      self.currentTouches++;

      self.drawCircles(event.changedTouches, newIds);
    }, false);

    // When users move their fingers
    touchArea.addEventListener('touchmove', function(event){
      if (self.showMenuOptions){
        return;
      }
      var touches = event.changedTouches;
      self.touches = event.touches;
      self.drawCircles(touches);
    }, false);
  }

  // Render the circles (touches)
  drawCircles(touches, newIds = []){
    let self = this;
    this.touches = touches;
    // Set a new color for every new touch
    for(let i=0; i < newIds.length; i++) {
      self.setCircleColor(newIds[i]);
    }

    for(let i=0; i < touches.length; i++) {
      let touchId = touches[i].identifier;
      let x = touches[i].pageX;
      let y = touches[i].pageY;
      self.moveCircle(touchId, x, y);
    }

  }

  // Move the circle to a certain spot
  moveCircle(id, x, y){
    let circle = document.getElementById(`${id}`);
    circle.style.left = `${x - this.circlePixelOffset}px`
    circle.style.top = `${y - this.circlePixelOffset}px`
  }

  // Set the color of a circle
  setCircleColor(id){
    let circle = document.getElementById(`${id}`);
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    circle.style["background-color"] = `#${randomColor}`;
    circle.style["box-shadow"] = `0px 0px 35px 10px #${randomColor}`;
  }

  // Reset the location of a circle
  resetCircle(id){
    let circle = document.getElementById(`${id}`);
    circle.style.left = `-4000px`
    circle.style.top = `-4000px`
  }

  // Toggling the menu
  handleMenuChange(event){
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
    // If the count down timer has already started
    if (this.startedCountdownTimer || this.isSelectingWinner){
      console.log(`return;`)
      return;
    }
    console.log(`startCountDownTimer()`);
    this.startedCountdownTimer = true;
    this.timerTid = setInterval(() => {

      // When the timer has reached 0
      if (self.timer <= 0){
        self.message = "Start counting boys!!!"
        self.endCountDownTimer();
        self.selectWinnter();
        return;
      }

      self.timer--;
      self.message = `${self.timerCountdownMessage} ${self.timer}`;
    }, 1000)
  }

  // End the countdown timer
  endCountDownTimer(){
    this.timer = this.resetTimer;
    this.startedCountdownTimer = false;
    clearInterval(this.timerTid);
  }

  // Selecting a winner
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
    let i = 0;
    let selecting = setInterval(() => {

      let oldCircle = document.getElementById(`${i}`);
      oldCircle.classList.remove("circle--active");
      if (i >= self.currentTouches-1){
        i = 0;
      } else {
        i++
      }
      self.message = `new i: ${i}, touches.length: ${self.touches.length}, currentTouches: ${self.currentTouches}`

      let circle = document.getElementById(`${i}`);
      circle.classList.add("circle--active");
      self.vibration.vibrate(100);
    }, 200)

    this.selectingWinnerTid = setTimeout(() => {
      // selecting winner process
      clearInterval(selecting);
      for(let i = 0; i < self.currentTouches; i++){
        let clearCircle = document.getElementById(`${i}`);
        clearCircle.classList.remove("circle--active");
      }

      setTimeout(() => {
        self.message = 'Winner selected'
        self.vibration.vibrate([500,200,500,200,500]);
        self.message = 'Winner selected -- vibrate?'

        // selecting the winner
        const randomElement = Math.floor(Math.random() * self.currentTouches);
        let winnerId = randomElement;
        let circle = document.getElementById(`${winnerId}`);
        circle.classList.add("circle--active");
        
        self.message = "Untap all fingers"
      }, 1000)
    }, 5000);

    ;
  }

  divideIntoTeams(){
    let self = this;
    this.selectingWinnerTid  = setInterval(() => {
      // TODO: dividing team process
    }, 300);
  }

  resetAfterWin(){
    this.isSelectingWinner = false;
    clearTimeout(this.selectingWinnerTid);
    this.message = this.tapMoreScreenMessage;
    this.vibration.vibrate(0); // stop any current vibrations immediately
    for(let i = 0; i < this.maxFingers; i++) {
      let circle = document.getElementById(`${i}`);
      circle.classList.remove("circle--active");
    }
  }
}
