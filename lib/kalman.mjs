  /**
  * Create 1-dimensional kalman filter
  * @param  {Number} options.R Process noise, 1
  * @param  {Number} options.Q Measurement noise, 1
  * @param  {Number} options.A State vector, 1,
  * @param  {Number} options.B control vector, 0
  * @param  {Number} options.C Measurement vector, 1
  * @return {KalmanFilter}
  */
export function KalmanFilter(R,Q,A,B,C){
    if(R==undefined){
        this.R=1
    }else{
        this.R=R;
    }
    if(Q==undefined){
        this.Q=1
    }else{
        this.Q=Q
    }
    if(A==undefined){
        this.A=1
    }else{
        this.A=A
    }
    if(B==undefined){
        this.B=0
    }else{
        this.B=B
    }   
    if(C==undefined){
        this.C=1
    }else{
        this.C=C
    }
    this.cov = NaN;
    this.x=NaN
}
 /**
  * Filter a new value
  * @param  {Number} z Measurement
  * @param  {Number} u Control
  */
KalmanFilter.prototype.filter= function(z, u){
    if (isNaN(this.x)) {
        this.x = (1 / this.C) * z;
        this.cov = (1 / this.C) * this.Q * (1 / this.C);
    }
    else {
        // Compute prediction
        const predX = this.predict(u);
        const predCov = this.uncertainty();
  
        // Kalman gain
        const K = predCov * this.C * (1 / ((this.C * predCov * this.C) + this.Q));
  
        // Correction
        this.x = predX + K * (z - (this.C * predX));
        this.cov = predCov - (K * this.C * predCov);
    }
    return this.x;
}
KalmanFilter.prototype.predict= function(u) {
    var u1=0;
    if(u==undefined){
        u1=0
    }else{
        u1=u;
    }
    return (this.A * this.x) + (this.B * u1);
  }
KalmanFilter.prototype.uncertainty= function() {
    let num = this.A * this.cov * this.A + this.R
    return num;
  }
KalmanFilter.prototype.lastMeasurement = function() {
    return this.x;
  }
KalmanFilter.prototype.setMeasurementNoise=function(noise) {
    this.Q = noise;
  }
KalmanFilter.prototype.setProcessNoise=function(noise) {
    this.R = noise;
  }

