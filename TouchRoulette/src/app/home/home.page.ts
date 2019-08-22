import { Component } from '@angular/core';
import { GestureController } from '@ionic/core/dist/collection/utils/gesture/gesture-controller';
import { HammerGestureConfig } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  showOptions: boolean = false;
  public tapping: boolean = false;

  touches: any[] = [];
  maxFingers: Number = 10;
  fingers: any[] = [];

  message: string = "";

  constructor(){

  }

  ngAfterViewInit(){
    let self = this;
    var touchArea = document.getElementById('touchArea');

    touchArea.addEventListener('touchend', function(event){
      if (event.targetTouches.length < 1) {
        self.tapping = false;
      }
      console.log('finger untapped');
    }, false);

    touchArea.addEventListener('touchstart', function(event){
      if (event.targetTouches.length > 0) {
        self.tapping = true;
      }
      console.log('finger tapped');
    }, false);

    // If there's exactly one finger inside this element
    touchArea.addEventListener('touchmove', function(event){
      console.log('touches');
      console.log(event.targetTouches);
      var touches = event.changedTouches;

      for(var i=0; i < event.changedTouches.length; i++) {
          var touchId = event.changedTouches[i].identifier;
          var x       = event.changedTouches[i].pageX;
          var y       = event.changedTouches[i].pageY;
      }      
    }, false);
  }

  showMenu(){
    this.showOptions = !this.showOptions;
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
