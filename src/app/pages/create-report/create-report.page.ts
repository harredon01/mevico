import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, ModalController, IonSlides} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api/api.service';
import {ImagesService} from '../../services/images/images.service';
import {ParamsService} from '../../services/params/params.service';
import {LocationsService} from '../../services/locations/locations.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {MapDataService} from '../../services/map-data/map-data.service';
import {ReportsService} from '../../services/reports/reports.service';
import {Report} from '../../models/report';
@Component({
    selector: 'app-create-report',
    templateUrl: './create-report.page.html',
    styleUrls: ['./create-report.page.scss'],
})
export class CreateReportPage implements OnInit {
    @ViewChild('slides') slides: IonSlides;
    isReadyToSave: boolean;
    locationLoaded: boolean = false;
    ReportLoaded: boolean = false;
    item: any;
    report: Report;
    type: any;
    galPage: any = 1;
    editName: boolean = false;
    editType: boolean = false;
    editDescription: boolean = false;
    editUnit_cost: boolean = false;
    saveAddress: boolean = false;

    countries: any[] = [];
    regions: any[] = [];
    cities: any[] = [];
    submitAttempt: boolean;
    form: FormGroup;
    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        formBuilder: FormBuilder,
        public api: ApiService,
        public imagesServ: ImagesService,
        public mapData: MapDataService,
        private cdr: ChangeDetectorRef,
        public reports: ReportsService,
        public locations: LocationsService,
        public params: ParamsService,
        public userData: UserDataService) {
        this.report = new Report({files: [], attributes: {}});
        this.submitAttempt = false;
        this.getCountries();
        this.form = formBuilder.group({
            id: ['', Validators.required],
            type: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
            email: ['', Validators.required],
            telephone: ['', Validators.required],
            address: [''],
            unit_cost: [''],
            lat: [''],
            long: [''],
            city_id: ['', Validators.required],
            region_id: ['', Validators.required],
            country_id: ['', Validators.required],
        });

        console.log("Form", this.form.errors)
        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            console.log("form change", v);
            this.isReadyToSave = this.form.valid;
        });
    }
    ionViewDidEnter() {
        let container: any = this.params.getParams();
        console.log("Params entering", container);
        if (container) {
            if (container.item) {
                this.getReport(container.item.id);
            }
            if (container.type) {
                if (container.type == "Report") {
                    this.getReport(container.objectId);
                }
            }
            let mapLocation = container.mapLocation;
            if (mapLocation) {
                this.saveAddress = true;
            }
        }
    }
    myImages() {
        let params = {
            "objectId": this.report.id,
            "type": "Report",
            "Name": this.report.name,
            "settings": true
        };
        this.params.setParams(params);
        this.navCtrl.navigateForward("shop/settings/reports/" + this.report.id + "/images");
    }
    addLocation() {
        console.log("Adding location");
        this.mapData.hideAll();
        this.mapData.activeType = "Location";
        this.mapData.activeId = "-1";
        this.mapData.merchantId = null;
        this.navCtrl.navigateForward('shop/map');
    }
    slidePrev() {
        this.galPage--;
        this.slides.slidePrev();
    }
    slideNext() {
        this.galPage++;
        this.slides.slideNext();
    }

    setAvatar() {
        this.api.loader();
        let container = {'type': "Report_avatar", 'intended_id': this.report.id};
        let options = {
            width: 800,
            height: 800,
            maximumImagesCount: 1,
            outputType: 0
        };
        this.imagesServ.prepareForUpload(options, container, true).then((value: any) => {
            console.log("Prepare for upload result", value);
            let results = value.images;
            if (results.length > 0) {
                this.report.icon = results[0];
            }
            this.api.dismissLoader();
        });
    }
    resetEdits(value: boolean) {
        this.editName = value;
        this.editType = value;
        this.editDescription = value;
        this.editUnit_cost = value;
    }
    resetEditsForm() {
        let keys = Object.keys(this.form.value);
        for (let item in keys) {
            if (!this.form.controls[keys[item]].valid) {
                let name = keys[item];
                let nameCapitalized = "edit" + name.charAt(0).toUpperCase() + name.slice(1);
                if (this[nameCapitalized] == false) {
                    this[nameCapitalized] = true;
                }
                console.log("Invalid", keys[item]);
            }
        }
    }
    editField(field: any) {
        if (this["edit" + field]) {
            this["edit" + field] = false;
        } else {
            this["edit" + field] = true;
        }
    }
    loadReport(editingReport: any) {
        let container: any = {
            id: editingReport.id,
            type: editingReport.type,
            name: editingReport.name,
            description: editingReport.description,
            email: editingReport.email,
            telephone: editingReport.telephone,
            address: editingReport.address,
            lat: editingReport.lat,
            long: editingReport.long,
            city_id: editingReport.city_id,
            region_id: editingReport.region_id,
            country_id: editingReport.country_id,
        };

        let attributes = editingReport.attributes;
        console.log("Attributes", attributes);
        if (attributes.unit_cost) {
            container['unit_cost'] = attributes.unit_cost;
        } else {
            container['unit_cost'] = 0;
        }

        if (this.saveAddress) {
            if (this.mapData.address.lat) {
                container.lat = this.mapData.address.lat
            }
            if (this.mapData.address.long) {
                container.long = this.mapData.address.long
            }
            if (this.mapData.address.address) {
                container.address = this.mapData.address.address
            }
            let theParams = this.params.getParams();
            theParams.mapLocation = null;
            this.params.setParams(theParams);
        }

        console.log("Setting form values: ", container);
        this.isReadyToSave = true;
        this.form.setValue(container);
        if (this.saveAddress) {
            this.saveAddress = false;
            this.done();
        }
        console.log("Before set company");
        this.ReportLoaded = true;
        this.selectCountry(editingReport.region_id, editingReport.city_id);
    }

    getCountries() {
        this.locations.getCountries().subscribe((resp: any) => {
            this.countries = resp.data;
            this.form.patchValue({country_id: 1});
            console.log("getCountries result", resp);

        }, (err) => {

        });
    }
    selectCountry(region, city) {
        if (!this.ReportLoaded) {
            return;
        }
        if (!region) {
            return;
        }
        if (!city) {
            return;
        }
        this.api.loader();
        console.log("selectCountry", this.form.get('country_id').value);
        this.locations.getRegionsCountry(this.form.get('country_id').value).subscribe((resp: any) => {
            this.api.dismissLoader();
            this.regions = resp.data;
            if (region) {
                this.form.patchValue({region_id: region});

                this.selectRegion(city);
            }

            console.log("getRegionsCountry result", resp);
            this.cdr.detectChanges();
        }, (err) => {
            this.api.dismissLoader();
        });
    }

    selectRegion(city) {
        if (!this.ReportLoaded) {
            return;
        }
        this.api.loader();
        this.locations.getCitiesRegion(this.form.get('region_id').value).subscribe((resp: any) => {
            this.api.dismissLoader();
            console.log("getCitiesRegion result", resp);
            this.cities = resp.data;
            if (city) {
                this.form.patchValue({city_id: city});
            }
            this.cdr.detectChanges();
        }, (err) => {
            this.api.dismissLoader();
        });
    }
    /**
           * Send a POST request to our signup endpoint with the data
           * the user entered on the form.
           */
    saveReport(report: any) {
        this.submitAttempt = true;
        console.log("saveReport", report);
        if (!this.form.valid) {return;}
        this.api.loader();
        this.reports.saveReport(report).subscribe((resp: any) => {
            this.api.dismissLoader();
            console.log("Save Address result", resp);
            if (resp.status == "success") {
                let data = resp.object;
                let container = data.report;
                container.files = data.files;
                container.ratings = data.ratings;
                this.report = new Report(container);
                this.loadReport(container);
                this.resetEdits(false);
                //                let container = {"hasChanged": true};
                //                this.params.setParams(container);
                //                this.navCtrl.back();
            } else {
                this.api.toast('MERCHANT_CREATE.ERROR_SAVE');
            }
        }, (err) => {
            this.api.dismissLoader();
            this.api.toast('MERCHANT_CREATE.ERROR_SAVE');
        });
    }

    getReport(report) {
        this.api.loader();
        let container = {"object_id": report, "includes": "files,ratings"};
        this.reports.getReportPrivate(container).subscribe((resp: any) => {
            this.api.dismissLoader();
            console.log("getReport result", resp);
            if (resp.report) {
                let container = resp.report;
                container.files = resp.files;
                container.ratings = resp.ratings;
                this.report = new Report(container);
                this.loadReport(container);
            } else {
                this.api.toast('INPUTS.ERROR_GET');
            }
        }, (err) => {
            this.api.dismissLoader();
            this.api.toast('INPUTS.ERROR_GET');
        });
    }

    /**
     * The user cancelled, so we dismiss without sending data back.
     */
    cancel() {
        this.navCtrl.back();
    }

    /**
     * The user is done and wants to create the item, so return it
     * back to the presenter.
     */
    done() {
        this.resetEdits(false);
        if (!this.form.valid) {this.resetEditsForm(); return;}
        this.saveReport(this.form.value);
    }

    ngOnInit() {
    }

}
