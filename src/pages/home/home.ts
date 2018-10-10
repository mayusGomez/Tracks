import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
 
declare var google;
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapTrack = null;
 
  isTracking = false;
  trackedRoute = [];
  // previousTracks = [];

  positionSubscription: Subscription;
 
  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation, private storage: Storage) { }
 
  ionViewDidLoad() {
    this.plt.ready().then(() => {
      //this.loadHistoricRoutes();
 
      let mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
      this.geolocation.getCurrentPosition().then(pos => {
        let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.map.setCenter(latLng);
        this.map.setZoom(16);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }
 
  startTracking() {
    this.isTracking = true;
    this.trackedRoute = [];
 
    this.positionSubscription = this.geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
      .pipe(
        filter((p) => p.coords !== undefined) //Filter Out Errors
      )
      .subscribe(data => {
        setTimeout(() => {
          console.log('Lat:' + data.coords.latitude + ', longitude:'+ data.coords.longitude);
          this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude });
          // this.redrawPath(this.trackedRoute);
          console.log('this.trackedRoute:' + this.trackedRoute);
        }, 0);
      });
 
  }
 
  stopTracking() {
    console.log('redrawPath  stopTracking');   
    this.isTracking = false;
    this.positionSubscription.unsubscribe();
    // this.currentMapTrack.setMap(null);
  }
   
  showHistoryRoute(route) {
    // this.redrawPath(route);
  }

}