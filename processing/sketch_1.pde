/*
    This is used for receiving osc message, and display it whit 3D box.

*/
//size(400,400);
//ellipse(200,200,300,300);

import oscP5.*;
import netP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;

void setup(){
   size(480,480); 
   frameRate(25);
   oscP5 = new OscP5(this,12000);
   myRemoteLocation = new NetAddress("127.0.0.1", 12000);
   print("Started\n");
}
void draw(){
/*   if(mousePressed){
     fill(0);
   }else{
     fill(255);
   }
   ellipse(mouseX, mouseY, 80,80);
   */
   background(0);
}
void mousePressed() {
   OscMessage myMessage = new OscMessage("/gravity");
   myMessage.add(123.1);
   myMessage.add(12.34);
   myMessage.add(9.8);
   oscP5.send(myMessage, myRemoteLocation);
   
}
void oscEvent(OscMessage theOscMessage){
  if(theOscMessage.checkAddrPattern("/gravity")==true){
    
    println("received osc message /gravity");
    if(theOscMessage.checkTypetag("fff")){
       float firstVal = theOscMessage.get(0).floatValue();
       float secondVal = theOscMessage.get(1).floatValue();
       float thirdVal = theOscMessage.get(2).floatValue();
       println(" values: ", firstVal, " ", secondVal, " ", thirdVal);
       return;
    }
    
  }else{
    println("received something"); 
  }
}
