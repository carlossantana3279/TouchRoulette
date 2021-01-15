import { Component } from '@angular/core';
import { GestureController } from '@ionic/core/dist/collection/utils/gesture/gesture-controller';
import { HammerGestureConfig } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  showMenuOptions: boolean = false;
  public tapping: boolean = false;

  touches: any[] = [];
  maxFingers: Number = 10;
  fingers: any[] = [];

  tapScreenMessage: string = "Tap the screen with multiple fingers"
  message: string = this.tapScreenMessage;

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
      if (event.targetTouches.length < 1) {
        self.tapping = false;
      }
      console.log(event);
     
      // i need to reset (make the circle disapear) when I untap it
      var touches = event.changedTouches;
      for(var i=0; i < touches.length; i++) {
        var touchId = touches[i].identifier;
        var x = touches[i].pageX;
        var y = touches[i].pageY;
        console.log('x: ', x);
        console.log('y: ', y);
        self.resetCircle(touchId);
      }

      console.log('finger untapped');
    }, false);

    touchArea.addEventListener('touchstart', function(event){
      if (self.showMenuOptions){
        return;
      }
      console.log('finger tapped');
      console.log(event);
      if (event.targetTouches.length > 0) {
        self.tapping = true;
      }
      self.drawCircles(event.changedTouches);
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

  drawCircles(touches){
    let self = this;
    for(var i=0; i < touches.length; i++) {
      var touchId = touches[i].identifier;
      var x = touches[i].pageX;
      var y = touches[i].pageY;
      console.log('x: ', x);
      console.log('y: ', y);
      self.moveCircle(touchId, x, y);
    }
  }

  moveCircle(id, x, y){
    let circle = document.getElementById(`${id}`);
    circle.style.left = `${x - this.circlePixelOffset}px`
    circle.style.top = `${y - this.circlePixelOffset}px`
  }

  resetCircle(id){
    let circle = document.getElementById(`${id}`);
    circle.style.left = `-4000px`
    circle.style.top = `-4000px`
  }

  showMenu(event){
    console.log(`showMenu()`);
    this.showMenuOptions = !this.showMenuOptions;
  }

  notTapping(){
    this.tapping = false;
  }

  isTapping(){
    this.tapping = true;
  }

  tapEvent(event, eventName = "tap"){
    // console.log('x: ' + event.center.x + ', y: ' + event.center.y);
    console.log(eventName);
    console.log(event);
    this.message = JSON.stringify(event);
  }  
}
